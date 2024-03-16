import os
import platform
import random
import sys

import eel


# main()を実行する前に宣言する。
# main()実行後に宣言するとエラーになる
@eel.expose
def test():
    print("hello eel")


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
