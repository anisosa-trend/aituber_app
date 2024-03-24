import os
import platform
import sys
from pathlib import Path
import json
import base64

sys.path.append(str(Path("__file__").resolve().parent))
from context import settings

import eel
from ahk import AHK

import ctypes
from ctypes.wintypes import HWND, DWORD, RECT

import mss
from PIL import Image
import datetime

import anthropic


# main()を実行する前に宣言する。
# main()実行後に宣言するとエラーになる
@eel.expose
def test():
    print("hello eel")


# 起動しているウィンドウの一覧を取得する
@eel.expose
def getWindowTitle():
    ahk = AHK()
    window_id_list = list(ahk.windows())
    window_list = [win.title for win in window_id_list]
    filter_window_list = list(filter(filterWindowList, window_list))
    return filter_window_list


# ウィンドウリストから空文字と不要なものを除外する
def filterWindowList(window_title):
    if window_title == "NVIDIA GeForce Overlay":
        return False

    if window_title == "Program Manager":
        return False

    if len(window_title) == 0:
        return False

    return True


@eel.expose
def translationScreenText(targetWindowTitle):
    # @TODO 同じ処理が走らないようにする（FEで対応でも良さそう。responseが返ってくるまでボタンを無効にする等）
    # @TODO 保存先のユーザー名はenvに入れておく
    print("Running translationScreenText...", targetWindowTitle)

    # 指定したウィンドウタイトルからウィンドウの場所を取得する
    windowPosition = get_window_rect_from_window_name(targetWindowTitle)

    # 指定したウィンドウのスクリーンショットを取って、保存先のPathを取得する
    # @TODO ウィンドウ名で保存する
    savePath = create_screenshot(windowPosition)
    print(savePath)

    # 作成したスクリーンショットをOpwnAI APIにPOSTする
    translateText = translate_screen_text_with_ai(savePath)

    # AIからの回答をreturnする
    return translateText


def get_window_rect_from_window_name(targetWindowTitle):
    TargetWindowHandle = ctypes.windll.user32.FindWindowW(0, targetWindowTitle)

    # 対象の画面をアクティブにし最前列に表示する
    # @TODO 現状動作していない。
    # @see https://qiita.com/BlueSilverCat/items/44e98e1ed7d4bf4531b5
    ctypes.windll.user32.ShowWindow(targetWindowTitle, 1)
    ctypes.windll.user32.SetForegroundWindow(targetWindowTitle)

    Rectangle = ctypes.wintypes.RECT()
    ctypes.windll.user32.GetWindowRect(TargetWindowHandle, ctypes.pointer(Rectangle))
    return (Rectangle.left, Rectangle.top, Rectangle.right, Rectangle.bottom)


def create_screenshot(windowPosition):
    with mss.mss() as sct:
        currentDatetime = datetime.datetime.now()
        savePath = (
            "C:\\Users\\owner\\Pictures\\Screenshots"
            + "\\"
            + str(currentDatetime.year)
            + str(currentDatetime.month)
            + str(currentDatetime.day)
            + str(currentDatetime.hour)
            + str(currentDatetime.minute)
            + str(currentDatetime.second)
            + str(currentDatetime.microsecond)
            + ".png"
        )

        screenshot = sct.grab(windowPosition)
        image = Image.frombytes("RGB", screenshot.size, screenshot.bgra, "raw", "BGRX")
        image.save(savePath)
        return savePath


# @see https://zenn.dev/tomioka/articles/26f360ad73edd1
def translate_screen_text_with_ai(image_path):
    anthropic_api_key = settings.anthropic_api_key
    client = anthropic.Anthropic(api_key=anthropic_api_key)

    image_media_type = "image/png"
    image_data = get_base64_encoded_image(image_path)

    message = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=4096,
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


def get_base64_encoded_image(image_file):
    with open(image_file, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
        return encoded_string


# 開発者モードとbuild実行モードを切り替えられるようにする。
# 開発者モード：python run.py true：/webでnpm run start 後に実行する
# build実行モード：python run.py
def main(develop):
    if develop:
        directory = "./web/src"
        page = {"port": 3000}
    else:
        directory = "./web/build"
        page = "index.html"

    eel.init(directory, [".tsx", ".ts", ".jsx", ".js", ".html"])

    eel_kwargs = dict(
        host="localhost",
        port=8080,
        size=(1280, 800),
        cmdline_args=[
            f"--window-size={800},{1280}",
        ],
    )
    try:
        eel.start(page, mode="chrome", **eel_kwargs)
    except EnvironmentError:
        # If Chrome isn't found, fallback to Microsoft Edge on Win10 or greater
        if sys.platform in ["win32", "win64"] and int(platform.release()) >= 10:
            eel.start(page, mode="edge", **eel_kwargs)
        else:
            raise


if __name__ == "__main__":
    import sys

    # Pass any second argument to enable debugging
    main(develop=len(sys.argv) == 2)
