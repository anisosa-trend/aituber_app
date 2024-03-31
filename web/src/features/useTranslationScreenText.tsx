import { useCallback, useState } from "react"
import { eel } from "../App"

export const useTranslationScreenText = () => {
  const [windowList, setWindowList] = useState<string[]>([])
  const [selectedWindow, setSelectedWindow] = useState<string | null>(null)
  const [translationText, setTranslationText] = useState<string | null>(null)

  const isSelectedWindow = selectedWindow ? true : false

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

  const resetTranslationScreenTextState = useCallback(() => {
    setWindowList([])
    setSelectedWindow(null)
    setTranslationText(null)
  }, [])

  return {
    windowList,
    translationText,
    isSelectedWindow,
    setSelectedWindow,
    getWindowTitle,
    translationScreenText,
    resetTranslationScreenTextState
  }
}