import sys
import tweepy
from pathlib import Path

sys.path.append(str(Path("__file__").resolve().parent))
from context import settings

from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.memory import ConversationBufferMemory

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
        self.llm = ChatOpenAI(
            openai_api_key=api_key, model_name="gpt-3.5-turbo", temperature=0.7
        )

        self.prompt = ChatPromptTemplate.from_messages(
            [
                SystemMessagePromptTemplate.from_template(
                    "次の設定に沿って、「視聴者ちゃん」は「みんな」に置き換えてツイート内容を考えてください。"
                    + system_prompt
                ),
                HumanMessagePromptTemplate.from_template("{input}"),
            ]
        )
        pass

    def create_tweet(self, prompt):
        try:
            chain = LLMChain(llm=self.llm, prompt=self.prompt, verbose=False)
            response = chain.invoke({"input": prompt})
            return response["text"]
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
