import eel


@eel.expose
def test():
    print("hello eel")


def main():
    eel.init("./web/build", [".tsx", ".ts", ".jsx", ".js", ".html"])

    eel.start(
        "index.html",
        port=8080,
        size=(1280, 800),
    )


if __name__ == "__main__":
    main()
