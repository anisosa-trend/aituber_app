import { Button } from "@chakra-ui/react"
import { FC } from "react"

export const AppFunctionButton: FC<{
  icon: JSX.Element;
  onClick: () => Promise<void>
}> = ({
  icon,
  onClick
}) => {
    return (
      <Button
        colorScheme="telegram"
        width={"56px"}
        height={"56px"}
        fontSize={"sm"}
        onClick={onClick}
      >
        {icon}
      </Button>
    )
  }