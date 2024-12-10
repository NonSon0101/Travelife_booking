import {VStack, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

interface IActionItemProps {
  actionIcon: ReactNode
  title: string
  color?: string
  underLineHoverColor?: string
  hoverColor?: string
}



const ActionItem = (props: IActionItemProps) => {
  const { actionIcon, title, color, underLineHoverColor, hoverColor } = props

  

  return (
    <VStack
      fontSize="md"
      {...(color ? { color: `${color}` } : { color: "#fff" })}
      margin="0px 16px"
      lineHeight="8px"
      _after={{
        content: '""',
        backgroundColor: "#transparent",
        mt: "4px",
        height: "2px",
        width: "0px",
        transition: "width .1s ease-in",
      }}
      _hover={{
        "&::after": {
          width: "100%",
          backgroundColor: underLineHoverColor ? underLineHoverColor : "#fff",
        },
        color: hoverColor ? hoverColor : "#fff",
      }}
    >
      <Text userSelect="none" fontSize="2xl">{actionIcon}</Text>
      <Text userSelect="none">{title}</Text>
    </VStack>
  )
}

export default ActionItem
