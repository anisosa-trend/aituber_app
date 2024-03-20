# aituber_app

Eel + React を使って GUI を構築する。

UI 部分は web フォルダ直下に作成する。

仮想環境の構築

`python -m venv .venv`

仮想環境に入る

`.venv\Scripts\activate.bat`

仮想環境を無効化する

`deactivate`

exe ファイルを作成する

`python -m eel run.py ./web/build --onefile`

## 利用サービス

### OpenWeather

天気情報を取得するために使用している。

https://openweathermap.org/

## 参考文献

以下の参考文献は、UI 部分を run.py と同じ階層に作成しているため、ファイル構成が違うことに注意する。

[python-eel/Eel](https://github.com/python-eel/Eel)

[Eel + React 環境構築](https://zenn.dev/teba_eleven/scraps/20f04b77fe8a7b)

[Python ＋ eel で React を使って GUI 開発(テンプレ)](https://qiita.com/dende-h/items/19fb0d461c5dc41105ff)
