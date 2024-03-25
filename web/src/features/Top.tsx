import { FC, useCallback, useState } from "react"
import { eel } from "../App";
import { Box, Button, Image, Select, Stack } from "@chakra-ui/react";
import characterImage from "../settings/chara.webp"
import { ScreenshotIcon } from "../ui/ScreenshotIcon";

export const TopPage: FC = () => {
  const [windowList, setWindowList] = useState<string[]>([])
  const [selectedWindow, setSelectedWindow] = useState<string | null>(null)
  const [translationText, setTranslationText] = useState<string | null>(null)

  // Python側からの返り値がある場合は、async/awaitを使用する
  const getWindowTitle = useCallback(async () => {
    // Python側からの返り値がある場合は、戻り値が関数なので、それを実行するためにもう一つカッコを付けている。
    /** @see https://ja.stackoverflow.com/questions/71919/javascript%E3%81%AEawait%E3%81%AE%E5%BE%8C%E3%82%8D%E3%81%AB%E6%8B%AC%E5%BC%A7%E3%81%8C%E4%BA%8C%E9%87%8D%E3%81%AB%E4%B8%A6%E3%82%93%E3%81%A7%E3%81%84%E3%82%8B */
    const windowTitleList = await eel.get_window_title()();
    setWindowList(windowTitleList)
  }, [])

  const translationScreenText = useCallback(async () => {
    const translationText = await eel.translation_screen_text(selectedWindow)()
    setTranslationText(translationText)
  }, [selectedWindow])

  return (
    <Box width={"100%"} height={"100vh"} paddingX={2} paddingY={1} overflow={"hidden"}>
      <Stack
        direction={"column"}
        spacing={4}
        width={{
          base: "100%",
          md: "50vw"
        }}
        paddingTop={{
          base: "80px",
          md: "32px"
        }}
      >
        {/* 機能ボタンを表示する */}
        <Button
          colorScheme="telegram"
          width={"56px"}
          height={"56px"}
          fontSize={"sm"}
          onClick={getWindowTitle}
        >
          <ScreenshotIcon fill={"#fff"} width={8} height={8} />
        </Button>

        {/* 機能に応じたUIを表示する */}
        {windowList.length !== 0 && (
          <Stack direction={"row"}>
            <Select placeholder='画面を選択' onChange={(e) => setSelectedWindow(e.currentTarget.value)}>
              {windowList.map((window) => {
                return (
                  <option key={window} value={window}>{window}</option>
                )
              })}
            </Select>

            <Button colorScheme="telegram" fontSize={"sm"} onClick={translationScreenText}>翻訳</Button>
          </Stack>
        )}

        {/* 翻訳を表示する */}
        {translationText && (
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
              overflowY={"scroll"}
              css={{
                '&::-webkit-scrollbar': {
                  display: "none"
                }
              }}
            >
              {translationText}
            </Box>
          </Box>
        )}
      </Stack>

      {/* キャラクター画像を表示する */}
      <Box
        position={"fixed"}
        bottom={0}
        right={0}
      >
        <Image
          src={characterImage}
          alt={""}
          width={{
            base: "auto",
            md: "50vw"
          }}
          height={{
            base: "50vh",
            md: "auto"
          }}
          aspectRatio={"1/1"}
          objectFit={"cover"}
          objectPosition={"top"}
        />
      </Box>
    </Box>
  )
}