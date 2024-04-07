import { Button, Stack, Textarea } from "@chakra-ui/react"
import { FC } from "react"

export const CreateTweetTextArea: FC<{
  generatedTweet: string;
  generatedTweetOnChangeEventHandler: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  postTwitter: (tweet: string) => () => Promise<void>
}> = ({
  generatedTweet,
  generatedTweetOnChangeEventHandler,
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

        <Button
          colorScheme={"telegram"}
          fontSize={"sm"}
          onClick={postTwitter(generatedTweet)}
        >
          投稿する
        </Button>
      </Stack>
    )
  }