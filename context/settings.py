# os, dotenvのライブラリをインポートする
import os
from os.path import join, dirname
from dotenv import load_dotenv

# load_dotenvで.envを読み込む
load_dotenv()

# os.environで(APIキー・シークレットキー)を取得する
open_ai_api_key = os.environ.get("OPEN_AI_API_KEY")
anthropic_api_key = os.environ.get("ANTHROPIC_API_KEY")

twitter_consumer_key = os.environ.get("TWITTER_CONSUMER_KEY")
twitter_consumer_secret = os.environ.get("TWITTER_CONSUMER_SECRET")
twitter_access_token = os.environ.get("TWITTER_ACCESS_TOKEN")
twitter_access_token_secret = os.environ.get("TWITTER_ACCESS_TOKEN_SECRET")
twitter_bearer_token = os.environ.get("TWITTER_BEARER_TOKEN")
