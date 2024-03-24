import os
import platform
import sys

import eel
from ahk import AHK

import ctypes
from ctypes.wintypes import HWND, DWORD, RECT

import mss
from PIL import Image
import datetime


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
    # @TODO 同じ処理が走らないようにする（FEで対応でも良さそう）
    # @TODO 保存先のユーザー名はenvに入れておく
    print("Running translationScreenText...", targetWindowTitle)

    # 指定したウィンドウタイトルからウィンドウの場所を取得する
    windowPosition = GetWindowRectFromName(targetWindowTitle)

    # 指定したウィンドウのスクリーンショットを取って、保存先のPathを取得する
    savePath = createScreenshot(windowPosition)
    print(savePath)

    # 作成したスクリーンショットをOpwnAI APIにPOSTする

    # AIからの回答をreturnする
    return


def GetWindowRectFromName(targetWindowTitle):
    TargetWindowHandle = ctypes.windll.user32.FindWindowW(0, targetWindowTitle)

    # 対象の画面をアクティブにし最前列に表示する
    # @TODO 現状動作していない。
    ctypes.windll.user32.ShowWindow(targetWindowTitle, 1)
    ctypes.windll.user32.SetForegroundWindow(targetWindowTitle)

    Rectangle = ctypes.wintypes.RECT()
    ctypes.windll.user32.GetWindowRect(TargetWindowHandle, ctypes.pointer(Rectangle))
    return (Rectangle.left, Rectangle.top, Rectangle.right, Rectangle.bottom)


def createScreenshot(windowPosition):
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
