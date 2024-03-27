import sys
import mss
import base64
import datetime
from pathlib import Path


from PIL import Image
from ahk import AHK
import ctypes
from ctypes.wintypes import HWND, DWORD, RECT
import anthropic


sys.path.append(str(Path("__file__").resolve().parent))
from context import settings

anthropic_api_key = settings.anthropic_api_key


class TranslateScreenTextSystem:
    def __init__(self) -> None:
        self.client = anthropic.Anthropic(api_key=anthropic_api_key)
        with open("constants/system_prompt.txt", "r", encoding="utf-8") as f:
            self.system_prompt = f.read()
        pass

    # 起動しているウィンドウの一覧を取得する
    def get_window_title(self):
        ahk = AHK()
        window_id_list = list(ahk.windows())
        window_list = [win.title for win in window_id_list]
        filtered_window_list = list(filter(self._filter_window_list, window_list))
        return filtered_window_list

    # ウィンドウリストから空文字と不要なものを除外する
    def _filter_window_list(self, window_title):
        if window_title == "NVIDIA GeForce Overlay":
            return False

        if window_title == "Program Manager":
            return False

        if len(window_title) == 0:
            return False

        return True

    def translation_screen_text(self, target_window_title):
        # @TODO 同じ処理が走らないようにする（FEで対応でも良さそう。responseが返ってくるまでボタンを無効にする等）
        # @TODO 保存先のユーザー名はenvに入れておく
        print("Running translationScreenText...", target_window_title)

        # 指定したウィンドウタイトルからウィンドウの場所を取得する
        window_position = self._get_window_rect_from_window_name(target_window_title)

        # 指定したウィンドウのスクリーンショットを取って、保存先のPathを取得する
        # @TODO ウィンドウ名で保存する
        save_path = self._create_screenshot(window_position)

        # 作成したスクリーンショットをOpwnAI APIにPOSTする
        translate_text = self._translate_screen_text_with_ai(save_path)

        # AIからの回答をreturnする
        return translate_text

    def _get_window_rect_from_window_name(self, target_window_title):
        target_window_handle = ctypes.windll.user32.FindWindowW(0, target_window_title)

        # 対象の画面をアクティブにし最前列に表示する
        # @TODO 現状動作していない。
        # @see https://qiita.com/BlueSilverCat/items/44e98e1ed7d4bf4531b5
        ctypes.windll.user32.ShowWindow(target_window_title, 1)
        ctypes.windll.user32.SetForegroundWindow(target_window_title)

        rectangle = ctypes.wintypes.RECT()
        ctypes.windll.user32.GetWindowRect(
            target_window_handle, ctypes.pointer(rectangle)
        )
        return (rectangle.left, rectangle.top, rectangle.right, rectangle.bottom)

    def _create_screenshot(self, window_position):
        with mss.mss() as sct:
            current_datetime = datetime.datetime.now()
            savePath = (
                "C:\\Users\\owner\\Pictures\\Screenshots"
                + "\\"
                + str(current_datetime.year)
                + str(current_datetime.month)
                + str(current_datetime.day)
                + str(current_datetime.hour)
                + str(current_datetime.minute)
                + str(current_datetime.second)
                + str(current_datetime.microsecond)
                + ".png"
            )

            screenshot = sct.grab(window_position)
            image = Image.frombytes(
                "RGB", screenshot.size, screenshot.bgra, "raw", "BGRX"
            )
            image.save(savePath)
            return savePath

    # @see https://zenn.dev/tomioka/articles/26f360ad73edd1
    def _translate_screen_text_with_ai(self, image_path):
        image_media_type = "image/png"
        image_data = self._get_base64_encoded_image(image_path)

        message = self.client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=4096,
            system=self.system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": image_media_type,
                                "data": image_data,
                            },
                        },
                        {
                            "type": "text",
                            "text": "画像に表示されている文字を日本語に翻訳して。",
                        },
                    ],
                }
            ],
        )
        return message.content[0].text

    def _get_base64_encoded_image(self, image_file):
        with open(image_file, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
            return encoded_string
