import { useCallback, useState } from "react"
import { eel } from "../App"

export const useGeneratedTweet = () => {
  const [isOpenTwitterForm, setIsOpenTwitterForm] = useState<boolean>(false)
  const [createTweetPrompt, setCreateTweetPrompt] = useState<string | null>(null)
  const [generatedTweet, setGeneratedTweet] = useState<string | null>(null)
  const [tweetedResponse, setTweetedResponse] = useState<{
    response: "ok" | "fail",
    message: string
  } | null>(null)

  const isInputTweetPrompt = createTweetPrompt !== null && createTweetPrompt.length > 0

  const createTweetPromptOnChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateTweetPrompt(e.currentTarget.value)
  }
  const generatedTweetOnChangeEventHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGeneratedTweet(e.currentTarget.value)
  }

  const openTwitterForm = () => {
    setIsOpenTwitterForm(true)
  }

  const createTweet = useCallback(async () => {
    const response = await eel.create_tweet(createTweetPrompt)()
    setGeneratedTweet(response)
    setIsOpenTwitterForm(false)
  }, [createTweetPrompt])

  const postTwitter = useCallback((tweet: string) => async () => {
    const response = await eel.post_twitter(tweet)()
    setTweetedResponse(response)
    setGeneratedTweet(null)
  }, [])

  const resetPostTwitterState = () => {
    setCreateTweetPrompt(null)
    setIsOpenTwitterForm(false)
    setGeneratedTweet(null)
    setTweetedResponse(null)
  }

  return {
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
  }
}