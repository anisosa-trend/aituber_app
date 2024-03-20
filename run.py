import os
import platform
import random
import sys

import eel
from ahk import AHK


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
def createScreenshot(windowTitle):
    # 指定したウィンドウタイトルからウィンドウの場所を取得する

    # 指定したウィンドウのスクリーンショットを撮る

    # 作成したスクリーンショットをOpwnAI APIにPOSTする

    # AIからの回答をreturnする
    return


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
