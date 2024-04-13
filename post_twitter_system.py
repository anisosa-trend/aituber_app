import sys
import tweepy
from pathlib import Path

sys.path.append(str(Path("__file__").resolve().parent))
from context import settings

from claude_api_adapter import ClaudeApiAdapter
from openai_api_adapter import OpenaiApiAdapter

api_key = settings.open_ai_api_key

twitter_consumer_key = settings.twitter_consumer_key
twitter_consumer_secret = settings.twitter_consumer_secret
twitter_access_token = settings.twitter_access_token
twitter_access_token_secret = settings.twitter_access_token_secret
twitter_bearer_token = settings.twitter_bearer_token

with open("constants/system_prompt.txt", "r", encoding="utf-8") as f:
    system_prompt = f.read()


class PostTwitterSystem:
    def __init__(self) -> None:
        self.claude_api_adapter = ClaudeApiAdapter()
        self.openai_api_adapter = OpenaiApiAdapter()
        pass

    def create_tweet(self, prompt):
        try:
            response = self.openai_api_adapter.create_text(prompt)
            return response
        except Exception as e:
            print(e)
            pass

    def post_twitter(self, text):
        try:
            client = tweepy.Client(
                twitter_bearer_token,
                twitter_consumer_key,
                twitter_consumer_secret,
                twitter_access_token,
                twitter_access_token_secret,
            )
            client.create_tweet(text=text)
            return {"response": "ok", "message": "投稿したよ！"}
        except Exception as e:
            return {"response": "fail", "message": str(e)}
