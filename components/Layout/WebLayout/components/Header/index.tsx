import { Box, HStack, Img, Link, StackProps } from "@chakra-ui/react";
import Action from "../Actions";
import SearchBarInput from "../SearchBarInput";
import logo from "../../../../public/assets/images/logo.jpg";

interface IHeader extends StackProps {
  openLoginModal: () => void;
  background?: string;
  bgGradient?: string;
  color?: string;
  underLineHoverColor?: string;
  hoverColor?: string;
}

const Header = (props: IHeader) => {
  const {
    openLoginModal,
    background,
    bgGradient,
    color,
    underLineHoverColor,
    hoverColor,
    ...rest
  } = props;
  return (
    <Box
      width="full"
      height={{ base: '130px', md: '80px' }}
      paddingX={8}
      paddingTop="10px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      zIndex={999}
      {...(bgGradient
        ? { bgGradient: `${bgGradient}` }
        : { background: `${background}` })}
      {...rest}
    >
      <HStack
        maxWidth='1300px'
        justifyContent="space-between"
        alignItems="center"
        alignSelf='center'
        height="100%"
        width="full"
      >
        <HStack spacing={10}>
          <Link href="/">
            <Img
              src="/assets/images/logo.jpg"
              boxSize="90px"
              cursor="pointer"
            />
          </Link>

          <SearchBarInput hideBelow="md" minHeight="65px" placeholder="Search tours by name" />
        </HStack>
        <Action
          openLoginModal={openLoginModal}
          color={color}
          hoverColor={hoverColor}
          underLineHoverColor={underLineHoverColor}
        />
      </HStack>
      <SearchBarInput hideFrom="md" minHeight="50px" width='full' placeholder="Search tours by name" />
    </Box>
  );
};

export default Header;
