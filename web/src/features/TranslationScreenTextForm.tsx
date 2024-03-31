import { Button, Select, Stack } from "@chakra-ui/react";
import { FC } from "react";

export const TranslationScreenTextForm: FC<{
  windowList: string[];
  isSelectedWindow: boolean;
  selectedWindowChangeEventHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void
  translationScreenText: () => Promise<void>;
}> = ({
  windowList,
  isSelectedWindow,
  selectedWindowChangeEventHandler,
  translationScreenText
}) => {
    return (
      <Stack direction={"row"}>
        <Select placeholder='翻訳する画面を選択' onChange={selectedWindowChangeEventHandler}>
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
    )
  }