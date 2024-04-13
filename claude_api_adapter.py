import sys
from pathlib import Path

import anthropic

sys.path.append(str(Path("__file__").resolve().parent))
from context import settings

anthropic_api_key = settings.anthropic_api_key


class ClaudeApiAdapter:
    def __init__(self) -> None:
        self.client = anthropic.Anthropic(api_key=anthropic_api_key)
        with open("constants/system_prompt.txt", "r", encoding="utf-8") as f:
            self.system_prompt = f.read()
        pass

    def create_text(self, prompt):
        message = self.client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=4096,
            system=self.system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt,
                        },
                    ],
                }
            ],
        )
        return message.content[0].text

    def translate_characters_in_the_image(self, image_path):
        image_media_type = "image/png"
        image_data = self._get_base64_encoded_image(image_path)

        message = self.client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=4096,
            system=self.system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": image_media_type,
                                "data": image_data,
                            },
                        },
                        {
                            "type": "text",
                            "text": "画像に表示されている文字を日本語に翻訳して。",
                        },
                    ],
                }
            ],
        )
        return message.content[0].text
