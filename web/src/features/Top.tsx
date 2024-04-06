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
  const [isOpenTwitterForm, setIsOpenTwitterForm] = useState<boolean>(false)
  const [createTweetPrompt, setCreateTweetPrompt] = useState<string | null>(null)
  const [generatedTweet, setGeneratedTweet] = useState<string | null>(null)
  const [tweetedResponse, setTweetedResponse] = useState<{
    response: "ok" | "fail",
    message: string
  } | null>(null)

  const isInputTweetPrompt = createTweetPrompt && createTweetPrompt.length > 0

  // 1. appボタンを押したらpromptを入力するフォームが表示される
  const openTwitterForm = () => {
    setIsOpenTwitterForm(true)
  }
  // 2. フォームに入力されたpromptを使ってツイートを作成する
  const createTweet = useCallback(async () => {
    const response = await eel.create_tweet(createTweetPrompt)()
    setGeneratedTweet(response)
    setIsOpenTwitterForm(false)
  }, [createTweetPrompt])

  // 3. 生成したツイートが問題なく、投稿ボタンを押されたらTwitterに投稿する。
  const postTwitter = useCallback((tweet: string) => async () => {
    const response = await eel.post_twitter(tweet)()
    setTweetedResponse(response)
    setGeneratedTweet(null)
  }, [])

  // 4. 使用しているStateを全てresetする
  const resetPostTwitterState = () => {
    setCreateTweetPrompt(null)
    setIsOpenTwitterForm(false)
    setGeneratedTweet(null)
    setTweetedResponse(null)
  }

  /**
   * @description それぞれの機能を実行する前に、それぞれの機能のStateをresetすることでフォームを切り替える。
   */
  const appButtonHandler = useCallback((func: () => Promise<void> | void) => () => {
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
            selectedWindowChangeEventHandler={selectedWindowChangeEventHandler}
            translationScreenText={translationScreenText}
          />
        )}

        {/* ツイートを自動生成する際の条件を入力するUIを表示する */}
        {isOpenTwitterForm && (
          <Stack direction={"row"}>
            <Input fontSize={"sm"} placeholder='どんなツイートを作成しますか？' onChange={(e) => { setCreateTweetPrompt(e.currentTarget.value) }} />

            <Button
              colorScheme={"telegram"}
              fontSize={"sm"}
              isDisabled={!isInputTweetPrompt}
              onClick={createTweet}
            >
              生成
            </Button>
          </Stack>
        )}

        {/* 生成したツイート内容確認するUIを表示する */}
        {generatedTweet && (
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
              onChange={(e) => { setGeneratedTweet(e.currentTarget.value) }}
            />

            <Button
              colorScheme={"telegram"}
              fontSize={"sm"}
              onClick={postTwitter(generatedTweet)}
            >
              投稿する
            </Button>
          </Stack>
        )}

        {/* 翻訳を表示する */}
        {translationText && (
          <SpeechBubble text={translationText} />
        )}
        {tweetedResponse?.message && (
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