import { Button, Select, Stack } from "@chakra-ui/react";
import { FC } from "react";

export const TranslationScreenTextForm: FC<{
  windowList: string[];
  isSelectedWindow: boolean;
  setSelectedWindow: (value: React.SetStateAction<string | null>) => void
  translationScreenText: () => Promise<void>;
}> = ({
  windowList,
  isSelectedWindow,
  setSelectedWindow,
  translationScreenText
}) => {
    return (
      <Stack direction={"row"}>
        <Select placeholder='翻訳する画面を選択' onChange={(e) => setSelectedWindow(e.currentTarget.value)}>
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