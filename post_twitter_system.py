import sys
import tweepy
from pathlib import Path

sys.path.append(str(Path("__file__").resolve().parent))
from context import settings

twitter_consumer_key = settings.twitter_consumer_key
twitter_consumer_secret = settings.twitter_consumer_secret
twitter_access_token = settings.twitter_access_token
twitter_access_token_secret = settings.twitter_access_token_secret
twitter_bearer_token = settings.twitter_bearer_token


class PostTwitterSystem:
    def __init__(self) -> None:
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
            return {"response": "ok"}
        except Exception as e:
            return {"response": "fail", "message": str(e)}
