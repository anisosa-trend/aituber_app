import { FC, useCallback, useState } from "react"
import { eel } from "../App";
import { Box, Button, Image, Input, Stack, Textarea } from "@chakra-ui/react";
import characterImage from "../settings/chara.webp"
import { ScreenshotIcon } from "../ui/ScreenshotIcon";
import { SpeechBubble } from "../ui/SpeechBubble";
import { AppFunctionButton } from "../ui/AppFunctionButton";
import { TwitterIcon } from "../ui/TwitterIcon";
import { useTranslationScreenText } from "./useTranslationScreenText";
import { TranslationScreenTextForm } from "./TranslationScreenTextForm";
import { useGeneratedTweet } from "./useGeneratedTweet";
import { CreateTweetForm } from "./CreateTweetForm";
import { CreateTweetTextArea } from "./CreateTweetTextArea";

export const TopPage: FC = () => {
  const {
    windowList,
    translationText,
    isSelectedWindow,
    selectedWindowOnChangeEventHandler,
    getWindowTitle,
    translationScreenText,
    resetTranslationScreenTextState
  } = useTranslationScreenText()

  const {
    isLoading: isGeneratedTweetLoading,
    isOpenTwitterForm,
    generatedTweet,
    tweetedResponse,
    isInputTweetPrompt,
    openTwitterForm,
    createTweet,
    postTwitter,
    resetPostTwitterState,
    createTweetPromptOnChangeEventHandler,
    generatedTweetOnChangeEventHandler
  } = useGeneratedTweet()

  /**
   * @description それぞれの機能を実行する前に、それぞれの機能のStateをresetすることでフォームを切り替える。
   */
  const appButtonHandler = useCallback((func: () => Promise<void> | void) => () => {
    resetTranslationScreenTextState()
    resetPostTwitterState()
    func()
  }, [resetTranslationScreenTextState, resetPostTwitterState])

  /**
   * @todo
   * 設定を編集する機能を作成する
   *  - 使用しているAPIのリンクを張る
   *    - 現状API経由でbillingが取得できないため。
   *  - 画像やapi_keyを設定するフォームを追加
   * ウェブを検索してその結果を元に回答するエージェントを作る
   *  - @see https://blog.langchain.dev/tool-calling-with-langchain/
   *  - @see https://note.com/alexweberk/n/nd3797bbd84de
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
            onClick={appButtonHandler(openTwitterForm)}
          />

          <AppFunctionButton
            colorScheme={"whatsapp"}
            icon={<ScreenshotIcon fill={"#fff"} width={8} height={8} />}
            onClick={appButtonHandler(getWindowTitle)}
          />
        </Stack>

        {/* 翻訳したい画面を選択するUIを表示する */}
        {windowList.length !== 0 && (
          <TranslationScreenTextForm
            windowList={windowList}
            isSelectedWindow={isSelectedWindow}
            selectedWindowOnChangeEventHandler={selectedWindowOnChangeEventHandler}
            translationScreenText={translationScreenText}
          />
        )}

        {/* ツイートを自動生成する際の条件を入力するUIを表示する */}
        {isOpenTwitterForm && (
          <CreateTweetForm
            isLoading={isGeneratedTweetLoading}
            isInputTweetPrompt={isInputTweetPrompt}
            createTweet={createTweet}
            createTweetPromptOnChangeEventHandler={createTweetPromptOnChangeEventHandler}
          />
        )}

        {/* 生成したツイート内容確認するUIを表示する */}
        {generatedTweet && (
          <CreateTweetTextArea
            isLoading={isGeneratedTweetLoading}
            generatedTweet={generatedTweet}
            generatedTweetOnChangeEventHandler={generatedTweetOnChangeEventHandler}
            createTweet={createTweet}
            postTwitter={postTwitter}
          />
        )}

        {/* 翻訳を表示する */}
        {translationText && (
          <SpeechBubble text={translationText} />
        )}
        {tweetedResponse !== null && (
          <SpeechBubble text={tweetedResponse?.message} />
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