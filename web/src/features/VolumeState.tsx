import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { Box } from "@chakra-ui/react"
import { VolumeOnIcon } from "../ui/VolumeOnIcon"
import { VolumeOffIcon } from "../ui/VolumeOffIcon"
import sfx from '../settings/sound.mp3';

export const VolumeState: FC = () => {
  const audio = useMemo(() => new Audio(sfx), [])
  const [isPaused, setIsPaused] = useState<boolean>(true)

  useEffect(() => {
    audio.loop = true;
    audio.volume = 0.1;
  }, [audio])
  
  const handleOnclick = useCallback(() => {
    if(audio.paused) audio.play()
    else audio.pause()

    setIsPaused(audio.paused)
    return
  }, [audio])

  return(
    <Box cursor={"pointer"}>
      {isPaused ? (
        <VolumeOffIcon width={5} height={"auto"} onClick={handleOnclick}/>
      ) : (
        <VolumeOnIcon width={5} height={"auto"} onClick={handleOnclick}/>
      )}
    </Box>
  )
}