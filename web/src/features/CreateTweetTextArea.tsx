import { Box, Button, Stack, Textarea, Text } from "@chakra-ui/react"
import { FC } from "react"

export const CreateTweetTextArea: FC<{
  isLoading: boolean;
  generatedTweet: string;
  generatedTweetOnChangeEventHandler: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  createTweet: () => Promise<void>
  postTwitter: (tweet: string) => () => Promise<void>
}> = ({
  isLoading,
  generatedTweet,
  generatedTweetOnChangeEventHandler,
  createTweet,
  postTwitter
}) => {
    return (
      <Stack direction={"column"}>
        <Box position={"relative"}>
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
          <Text position={"absolute"} bottom={"2px"} right={"4px"} opacity={0.5} zIndex={"10"}>{generatedTweet.length}/140</Text>
        </Box>

        <Stack direction={"row"} justifyContent={"end"}>
          <Button
            colorScheme={"telegram"}
            fontSize={"sm"}
            isDisabled={isLoading}
            onClick={postTwitter(generatedTweet)}
          >
            投稿
          </Button>

          <Button
            colorScheme={"green"}
            fontSize={"sm"}
            isDisabled={isLoading}
            onClick={createTweet}
          >
            再生成
          </Button>
        </Stack>
      </Stack>
    )
  }