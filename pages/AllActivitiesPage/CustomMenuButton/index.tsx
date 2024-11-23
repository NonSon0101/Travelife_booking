import { TriangleDownIcon } from "@chakra-ui/icons"
import { Box, HStack, Menu, MenuButton, MenuButtonProps, Text } from "@chakra-ui/react"

interface ICustomMenuButton extends MenuButtonProps {
  text: string
  icon?: React.ReactNode
}

const CustomMenuButton = ({ text, icon, ...rest }: ICustomMenuButton) => {
  return (
    <Box position="relative" width="100%" height={{ base: "40px", md: "50px" }}>
      <Menu>
        <MenuButton
          width="full"
          height="full"
          backgroundColor="white"
          border="2px solid"
          borderColor="gray.300"
          borderRadius="10px"
          padding="8px 12px"
          fontWeight="bold"
          _hover={{ background: "gray.100" }} 
          _active={{ background: "gray.200" }}
          aria-label={text}
          aria-haspopup="menu"
          {...rest}
        >
          <HStack justifyContent="space-between">
            <Text>{text}</Text>
            {icon ? icon : <TriangleDownIcon />}
          </HStack>
        </MenuButton>
      </Menu>
    </Box>
  )
}

export default CustomMenuButton