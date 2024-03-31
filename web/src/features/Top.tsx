import { FC, useCallback, useState } from "react"
import { eel } from "../App";
import { Box, Button, Image, Select, Stack } from "@chakra-ui/react";
import characterImage from "../settings/chara.webp"
import { ScreenshotIcon } from "../ui/ScreenshotIcon";
import { SpeechBubble } from "../ui/SpeechBubble";
import { AppFunctionButton } from "../ui/AppFunctionButton";
import { TwitterIcon } from "../ui/TwitterIcon";
import { SpeechBubbleIcon } from "../ui/SpeechBubbleIcon";
import { useTranslationScreenText } from "./useTranslationScreenText";

export const TopPage: FC = () => {
  const {
    windowList,
    translationText,
    isSelectedWindow,
    setSelectedWindow,
    getWindowTitle,
    translationScreenText,
    resetTranslationScreenTextState
  } = useTranslationScreenText()


  /**
   * @todo
   * フォームの入力内容を取得してAIに渡す
   */
  const postTwitter = useCallback(async () => {
    const response = await eel.post_twitter("test1")()
    console.log(response)
  }, [])

  /**
   * @todo
   * claude3とOpenAiの残りの金額を表示出来るか調査する
   * claude3にsystem_promptが反映されないので、openAiを通してキャラ付けする
   */

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
        <Stack direction={"row"} spacing={1}>
          <AppFunctionButton
            colorScheme={"linkedin"}
            icon={<SpeechBubbleIcon fill={"#fff"} width={8} height={8} />}
            onClick={getWindowTitle}
          />

          <AppFunctionButton
            colorScheme={"twitter"}
            icon={<TwitterIcon fill={"#fff"} width={8} height={8} />}
            onClick={postTwitter}
          />

          <AppFunctionButton
            colorScheme={"whatsapp"}
            icon={<ScreenshotIcon fill={"#fff"} width={8} height={8} />}
            onClick={getWindowTitle}
          />
        </Stack>

        {/* 機能に応じたUIを表示する */}
        {windowList.length !== 0 && (
          <Stack direction={"row"}>
            <Select placeholder='翻訳する画面を選択' onChange={(e) => setSelectedWindow(e.currentTarget.value)}>
              {windowList.map((window) => {
                return (
                  <option key={window} value={window}>{window}</option>
                )
              })}
            </Select>

            <Button
              colorScheme={
                isSelectedWindow ? "telegram" : "gray"
              }
              fontSize={"sm"}
              isDisabled={!isSelectedWindow}
              onClick={translationScreenText}
            >
              翻訳
            </Button>
          </Stack>
        )}

        {/* 翻訳を表示する */}
        {translationText && (
          <SpeechBubble text={translationText} />
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