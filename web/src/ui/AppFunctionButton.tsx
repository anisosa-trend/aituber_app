import { Button } from "@chakra-ui/react"
import { FC } from "react"

export const AppFunctionButton: FC<{
  colorScheme: "whiteAlpha" | "blackAlpha" | "gray" | "red" | "orange" | "yellow" | "green" | "teal" | "blue" | "cyan" | "purple" | "pink" | "linkedin" | "facebook" | "messenger" | "whatsapp" | "twitter" | "telegram"
  icon: JSX.Element;
  onClick: () => Promise<void>
}> = ({
  colorScheme,
  icon,
  onClick
}) => {
    return (
      <Button
        colorScheme={colorScheme}
        width={"56px"}
        height={"56px"}
        fontSize={"sm"}
        borderRadius={0}
        onClick={onClick}
      >
        {icon}
      </Button>
    )
  }