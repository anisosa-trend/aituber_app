import { Box } from "@chakra-ui/react";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { AntennaIcon } from "../ui/AntennaIcon";

export const ApplicationState: FC = () => {
  const networkState = window.navigator.onLine;

  return (
    <Box><AntennaIcon width={5} height={"auto"} opacity={networkState ? "1" : "0.5"}/></Box>
  )
}