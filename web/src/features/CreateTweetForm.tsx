import { Button, Input, Stack } from "@chakra-ui/react"
import { FC } from "react"

export const CreateTweetForm: FC<{
  isInputTweetPrompt: boolean;
  createTweet: () => Promise<void>;
  createTweetPromptOnChangeEventHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
}> = ({
  isInputTweetPrompt,
  createTweet,
  createTweetPromptOnChangeEventHandler
}) => {
    return (
      <Stack direction={"row"}>
        <Input fontSize={"sm"} placeholder='どんなツイートを作成しますか？（例：○○のツイートを作成して）' onChange={createTweetPromptOnChangeEventHandler} />

        <Button
          colorScheme={"telegram"}
          fontSize={"sm"}
          isDisabled={!isInputTweetPrompt}
          onClick={createTweet}
        >
          生成
        </Button>
      </Stack>
    )
  }