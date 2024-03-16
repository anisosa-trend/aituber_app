import { FC } from "react"
import { eel } from "../App";
import { Box, Text } from "@chakra-ui/react";
import { Datetime } from "../ui/Datetime";

function test(){
  eel.test();
}

export const TopPage: FC = () => {
  return (
    <Box width={"100%"} height={"100vh"} paddingX={2} paddingY={1}>
      <Box>
        <Datetime/>
      </Box>
      TopPage
    </Box>
  )
}