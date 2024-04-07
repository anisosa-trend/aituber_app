import { Button, Select, Stack } from "@chakra-ui/react";
import { FC } from "react";

export const TranslationScreenTextForm: FC<{
  windowList: string[];
  isSelectedWindow: boolean;
  selectedWindowOnChangeEventHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void
  translationScreenText: () => Promise<void>;
}> = ({
  windowList,
  isSelectedWindow,
  selectedWindowOnChangeEventHandler,
  translationScreenText
}) => {
    return (
      <Stack direction={"row"}>
        <Select fontSize={"sm"} placeholder='翻訳する画面を選択' onChange={selectedWindowOnChangeEventHandler}>
          {windowList.map((window) => {
            return (
              <option key={window} value={window}>{window}</option>
            )
          })}
        </Select>

        <Button
          colorScheme={"telegram"}
          fontSize={"sm"}
          isDisabled={!isSelectedWindow}
          onClick={translationScreenText}
        >
          翻訳
        </Button>
      </Stack>
    )
  }