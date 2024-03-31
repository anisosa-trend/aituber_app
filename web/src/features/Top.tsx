import { FC, useCallback, useState } from "react"
import { eel } from "../App";
import { Box, Button, Image, Input, Select, Stack } from "@chakra-ui/react";
import characterImage from "../settings/chara.webp"
import { ScreenshotIcon } from "../ui/ScreenshotIcon";
import { SpeechBubble } from "../ui/SpeechBubble";
import { AppFunctionButton } from "../ui/AppFunctionButton";
import { TwitterIcon } from "../ui/TwitterIcon";
import { SpeechBubbleIcon } from "../ui/SpeechBubbleIcon";
import { useTranslationScreenText } from "./useTranslationScreenText";
import { TranslationScreenTextForm } from "./TranslationScreenTextForm";

export const TopPage: FC = () => {
  const {
    windowList,
    translationText,
    isSelectedWindow,
    selectedWindowChangeEventHandler,
    getWindowTitle,
    translationScreenText,
    resetTranslationScreenTextState
  } = useTranslationScreenText()


  /**
   * @todo
   * フォームの入力内容を取得してAIに渡す
   */
  const [inputText, setInputText] = useState<string | null>(null)
  const [isOpenTwitterForm, setIsOpenTwitterForm] = useState<boolean>(false)

  const isInputText = inputText && inputText.length > 0

  // 1. appボタンを押したらpromptを入力するフォームが表示される
  const openTwitterForm = () => {
    setIsOpenTwitterForm(true)
  }
  // 2. フォームに入力されたpromptを使ってツイートを作成する

  // 3. 生成されたツイートを取得する

  // 4. 生成したツイートが問題なく、投稿ボタンを押されたらTwitterに投稿する。
  const postTwitter = useCallback(async () => {
    const response = await eel.post_twitter("test1")()
    console.log(response)
  }, [])

  const resetPostTwitterState = () => {
    setInputText(null)
    setIsOpenTwitterForm(false)
  }

  /**
   * @description それぞれの機能を実行する前に、それぞれの機能のStateをresetすることでフォームを切り替える。
   */
  const appButtonHandler = useCallback((func: () => Promise<void> | void) => {
    resetTranslationScreenTextState()
    resetPostTwitterState()
    func()
  }, [resetTranslationScreenTextState])

  /**
   * @todo
   * 設定を編集する機能を作成する
   *  - 使用しているAPIのリンクを張る
   *    - 現状API経由でbillingが取得できないため。
   *  - 画像やapi_keyを設定するフォームを追加
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
          {/* <AppFunctionButton
            colorScheme={"linkedin"}
            icon={<SpeechBubbleIcon fill={"#fff"} width={8} height={8} />}
            onClick={() => appButtonHandler(getWindowTitle)}
          /> */}

          <AppFunctionButton
            colorScheme={"twitter"}
            icon={<TwitterIcon fill={"#fff"} width={8} height={8} />}
            onClick={() => appButtonHandler(openTwitterForm)}
          />

          <AppFunctionButton
            colorScheme={"whatsapp"}
            icon={<ScreenshotIcon fill={"#fff"} width={8} height={8} />}
            onClick={() => appButtonHandler(getWindowTitle)}
          />
        </Stack>

        {/* 機能に応じたUIを表示する */}
        {windowList.length !== 0 && (
          <TranslationScreenTextForm
            windowList={windowList}
            isSelectedWindow={isSelectedWindow}
            selectedWindowChangeEventHandler={selectedWindowChangeEventHandler}
            translationScreenText={translationScreenText}
          />
        )}

        {isOpenTwitterForm && (
          <Stack direction={"row"}>
            <Input placeholder='どんなツイートを作成しますか？' onChange={(e) => { setInputText(e.currentTarget.value) }} />

            <Button
              colorScheme={"telegram"}
              fontSize={"sm"}
              isDisabled={!isInputText}
            // onClick={translationScreenText}
            >
              生成
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