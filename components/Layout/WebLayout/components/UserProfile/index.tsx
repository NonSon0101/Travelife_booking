/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import {
  Flex,
  HStack,
  Avatar,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  VStack,
  Link,
} from "@chakra-ui/react"
import { useEffect } from "react"
import { useStores } from "hooks/useStores"
import truncate from "lodash/truncate"
import { observer } from "mobx-react"
import { useRouter } from "next/navigation"
import routes from "routes"
import { FaRegUser } from "react-icons/fa"
import { IoMdLogIn } from "react-icons/io"
import { FaUserCircle } from "react-icons/fa"
import { BiLogOutCircle } from "react-icons/bi"
import ActionItem from "components/Layout/WebLayout/components/Actions/ActionItem"
import { PLATFORM } from "enums/common"

interface IUserProfileProps {
  openLoginModal: () => void
  color?: string
  underLineHoverColor?: string
  hoverColor?: string
}

const UserProfile = (props: IUserProfileProps) => {
  const { openLoginModal, color, underLineHoverColor, hoverColor } = props
  const { authStore } = useStores()
  const { user, isLogin } = authStore
  const { username, email } = user
  const router = useRouter()

  useEffect(() => {
    try {
      authStore.getMyUser(PLATFORM.WEBSITE)
    } catch (error) {
      console.warn('error at get user', error)
    }
  }, [])

  function handleLogout() {
    authStore.logout(PLATFORM.WEBSITE) 
    window.location.href = '/'
  }

  return (
    <Menu autoSelect={false} computePositionOnMount placement="bottom-end">
      <VStack
        _after={{
          content: '""',
          backgroundColor: "#transparent",
          height: "2px",
          width: "0px",
          mt: "-8px",
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
        <MenuButton padding="0px">
          {isLogin ? (
            <HStack
              spacing={3}
              order={{ base: 1, md: 2 }}
              flex="1"
              ml="8px"
              mb="4px"
            >
              <Avatar size="md" name={username} src={user.profilePicture} />
              <Flex
                color='#fff'
                flexDirection="column"
                display={{ base: "none", lg: "flex" }}
                alignItems="flex-start"
                maxW="100px"
              >
                <Text
                  fontSize="md"
                  fontWeight="500"
                  lineHeight="5"
                  marginBottom={1}
                  color={color}
                >
                  {truncate(username)}
                </Text>
                <Text fontSize="md" lineHeight="4" color={color}>
                  {truncate(email)}
                </Text>
              </Flex>
            </HStack>
          ) : (
            <VStack>
              <ActionItem
                underLineHoverColor={underLineHoverColor}
                hoverColor={hoverColor}
                color={color}
                actionIcon={<FaRegUser />}
                title="Login"
                to={() => {}}
              />
            </VStack>
          )}
        </MenuButton>
      </VStack>

      <MenuList
        fontSize="md"
        minWidth="210px"
        padding="16px 0px"
        borderRadius="16px"
      >
        {isLogin ? (
          <>
            <Link href={routes.myProfile.value}>
              <MenuItem maxH="40px" color="gray.700">
                <HStack spacing={3}>
                  <FaUserCircle fontSize="1.8rem" />
                  <Text fontWeight="600">My Profile</Text>
                </HStack>
              </MenuItem>
            </Link>
            <MenuItem
              fontWeight="600"
              maxH="40px"
              color="red.600"
              onClick={handleLogout}
            >
              <HStack spacing={3}>
                <BiLogOutCircle fontSize="1.8rem" />
                <Text fontWeight="600">Log Out</Text>
              </HStack>
            </MenuItem>
          </>
        ) : (
          <MenuItem
            fontWeight="600"
            maxH="40px"
            color="gray.700"
            onClick={openLoginModal}
          >
            <HStack spacing={3}>
              <IoMdLogIn fontSize="1.8rem" />
              <Text>Log in or sign up</Text>
            </HStack>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  )
}

export default observer(UserProfile)
