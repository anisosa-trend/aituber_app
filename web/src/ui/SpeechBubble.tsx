import { Box, Text } from "@chakra-ui/react"
import { FC } from "react"

export const SpeechBubble: FC<{
  text: string
}> = ({
  text
}) => {
    return (
      <Box
        position={"relative"}
        padding={3}
        backgroundColor={"#e0edff"}
        borderRadius={8}
        _before={{
          content: '""',
          position: "absolute",
          top: {
            base: "100%",
            md: "90%"
          },
          left: {
            base: "70%",
            md: "100%"
          },
          border: "15px solid transparent",
          borderTop: {
            base: "15px solid #e0edff",
            md: "none"
          },
          borderLeft: {
            base: "none",
            md: "15px solid #e0edff"
          }
        }}
      >
        <Box
          height={{
            base: "120px",
            md: "50vh"
          }}
          fontSize={"14px"}
          overflowY={"scroll"}
          css={{
            pre: {
              fontSize: "14px"
            },
            '&::-webkit-scrollbar': {
              display: "none"
            }
          }}
        >
          <pre>{text}</pre>
        </Box>
      </Box>
    )
  }