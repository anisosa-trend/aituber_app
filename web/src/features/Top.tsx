import { FC } from "react"
import { eel } from "../App";
import { Box } from "@chakra-ui/react";

function test(){
  eel.test();
}

export const TopPage: FC = () => {
  return (
    <Box width={"100%"} height={"100vh"} paddingX={2} paddingY={1}>
      TopPage
    </Box>
  )
}