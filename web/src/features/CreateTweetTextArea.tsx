import { Button, Stack, Textarea } from "@chakra-ui/react"
import { FC } from "react"

export const CreateTweetTextArea: FC<{
  generatedTweet: string;
  generatedTweetOnChangeEventHandler: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  createTweet: () => Promise<void>
  postTwitter: (tweet: string) => () => Promise<void>
}> = ({
  generatedTweet,
  generatedTweetOnChangeEventHandler,
  createTweet,
  postTwitter
}) => {
    return (
      <Stack direction={"column"}>
        <Textarea
          value={generatedTweet}
          size={'sm'}
          resize={"none"}
          height={{
            base: "120px",
            md: "50vh"
          }}
          backgroundColor={"#e0edff"}
          borderRadius={8}
          overflowY={"scroll"}
          css={{
            '&::-webkit-scrollbar': {
              display: "none"
            }
          }}
          onChange={generatedTweetOnChangeEventHandler}
        />

        <Stack direction={"row"} justifyContent={"end"}>
          <Button
            colorScheme={"telegram"}
            fontSize={"sm"}
            onClick={postTwitter(generatedTweet)}
          >
            投稿
          </Button>

          <Button
            colorScheme={"green"}
            fontSize={"sm"}
            onClick={createTweet}
          >
            再生成
          </Button>
        </Stack>
      </Stack>
    )
  }