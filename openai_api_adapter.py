import sys
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


class OpenaiApiAdapter:
    def __init__(self) -> None:
        with open("constants/system_prompt.txt", "r", encoding="utf-8") as f:
            system_prompt = f.read()

        self.llm = ChatOpenAI(
            openai_api_key=api_key, model_name="gpt-3.5-turbo", temperature=0.7
        )

        self.prompt = ChatPromptTemplate.from_messages(
            [
                SystemMessagePromptTemplate.from_template(system_prompt),
                MessagesPlaceholder(variable_name="chat_history"),
                HumanMessagePromptTemplate.from_template("{input}"),
            ]
        )

        self.memory = ConversationBufferMemory(
            memory_key="chat_history", return_messages=True
        )
        pass

    def create_text(self, prompt):
        try:
            chain = LLMChain(
                llm=self.llm, prompt=self.prompt, verbose=False, memory=self.memory
            )
            response = chain.invoke({"input": prompt})
            return response["text"]
        except Exception as e:
            print(e)
            pass
