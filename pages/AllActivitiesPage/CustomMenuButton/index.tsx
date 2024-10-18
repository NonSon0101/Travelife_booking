import { TriangleDownIcon } from "@chakra-ui/icons"
import { Box, HStack, MenuButton, MenuButtonProps, StackProps, Text } from "@chakra-ui/react"

interface ICustomMenuButton extends MenuButtonProps {
    text: string
    icon?: React.ReactNode // Use ReactNode for actual icon components
}

const CustomMenuButton = ({ text, icon, ...rest }: ICustomMenuButton) => {
    return (
        <Box position='relative' width="full" height="50px">
            <MenuButton
                width="full"
                height='full'
                backgroundColor="white"
                border="2px solid"
                borderColor="gray.300"
                borderRadius="10px"
                padding="8px 12px"
                fontWeight="bold"
                _hover={{ background: "gray.100" }} 
                _active={{ background: "gray.200" }}
                aria-label={text} // Accessibility
                {...rest}
            >
                <HStack justifyContent="space-between">
                    <Text>{text}</Text>
                    <TriangleDownIcon />
                </HStack>
            </MenuButton>
        </Box>
    )
}

export default CustomMenuButton