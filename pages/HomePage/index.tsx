"use client";
import { useEffect, useRef, useState } from "react";
import {
  SimpleGrid,
  Box,
  Button,
  extendTheme,
  ThemeProvider,
  Link,
} from "@chakra-ui/react";
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from "next/navigation";
import routes from "routes";
import TourCard from "components/TourCard";
import HomeLayout from "components/Layout/WebLayout/HomeLayout";
import TourCardSkeleton from "./TourCardSkeleton"
import { useStores } from "hooks";
import { observer } from "mobx-react";
import Title from "components/Title";
import { PLATFORM } from "enums/common";
import ChatBot from "components/ChatBot";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "lib/firestore";

const breakpoints = {
  base: '0px',
  sm: '578px',
  md: '868px',
  lg: '1060px',
  xl: '1300px',
  '2xl': '1536px',
};

const theme = extendTheme({ breakpoints });

const HomePage = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const userId = searchParams?.get('userId')
  const accessToken = searchParams?.get('accessToken')
  const route = useRouter();
  const { tourStore, authStore } = useStores();
  const { tours } = tourStore;
  const { user } = authStore;

  const [isLoading, setIsLoading] = useState(true);
  const [isFromGoogle, setIsFromGoogle] = useState(false);
  const [isCalled, setIsCalled] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    const platform = PLATFORM.WEBSITE;

    const getUser = async () => {
      if (userId && accessToken && typeof window !== "undefined") {
        localStorage.setItem(`${platform}UserId`, userId);
        localStorage.setItem(`${platform}Token`, accessToken);
        setIsFromGoogle(true);

        await authStore.getUserById(platform);
      } else {
        setIsFromGoogle(false);
      }
    };

    getUser();
  }, [userId, accessToken]);

  useEffect(() => {
    const loginFireStore = async () => {
      if ((!user._id && !user.email) || isCalled || !isFromGoogle || hasRun.current) return;

      console.log('user', user)

      hasRun.current = true;

      try {
        await signInWithEmailAndPassword(auth, user.email!, user._id!)
          .then((userCredential) => {
            const user = userCredential.user;
            if (user) { 
              console.log('signed in to firestore with user: ', user) 
              route.push('/')
            }
          })
          .catch(async (err) => {
            console.error(`Couldnt sign in to firestore ${err.code}, \n ${err.message}`)
            await createUserWithEmailAndPassword(auth, user.email!, user._id!)
              .then((userCredential) => {
                const user = userCredential.user;
                if (user) { 
                  console.log('signed up to firestore with user: ', user)
                  route.push('/')
                }
              })
              .catch((err) => {
                console.error(`Couldnt sign in to firestore ${err.code}, \n ${err.message}`)
              });
          });
      } catch (err: any) {
        console.error(`Couldn’t authenticate with Firestore ${err.code}, \n ${err.message}`);
      }
    };

    loginFireStore();
  }, [user, isFromGoogle, isCalled]);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await tourStore.fetchActiveTours();
      setIsLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkIfUserExists(email) {
    try {
      console.log('user email', email)
      const methods = await fetchSignInMethodsForEmail(auth, email);
      console.log('methods', methods)
      if (methods.includes('password')) {
        console.log("User exists with email/password sign-in.");
        return true;
      } else {
        console.log("Email exists but not with email/password (maybe Google, Facebook, etc).");
        return false;
      }
    } catch (error) {
      console.error("Error checking user:", error);
      return false;
    }
  }


  return (
    <ThemeProvider theme={theme}>
      <HomeLayout>
        <Box
          width='full'
          display='flex'
          justifyContent="center"
          alignItems="center"
          mt="32px"
          id="homepage"
        >
          <Title
            maxWidth="1300px"
            width='full'
            fontSize="3xl"
            fontWeight="600"
            text='Unforgettable tours experiences' />
        </Box>

        <SimpleGrid
          maxWidth="1300px"
          paddingY={{ base: '24px' }}
          columns={{ base: 1, sm: 2, md: 3, xl: 4 }}
          gap={8}
          padding={1}
          mt="8px"
        >
          {isLoading
            ? [...Array(8)].map((_, i) => (
              <TourCardSkeleton key={i} />
            ))
            : tours?.map((tour) => (
              <TourCard key={tour?._id} tour={tour} />
            ))}
        </SimpleGrid>

        <Box
          marginY={4}
          _before={{
            position: "absolute",
            content: "''",
            maxWidth: "600px",
            minWidth: "100px",
            marginLeft: "-600px",
            marginTop: "18px",
            width: "full",
            height: "2px",
            bg: 'teal',
            zIndex: -1,
          }}
          _after={{
            position: "absolute",
            content: "''",
            maxWidth: "600px",
            minWidth: "100px",
            marginTop: "18px",
            marginRight: '-120px',
            width: "full",
            height: "2px",
            bg: 'teal',
            zIndex: -1,
          }}
        >
          <Link href={routes.allActivities.value}>
            <Button
              color='teal'
              border='2px solid teal'
              borderRadius='full'
              bg='transparent'
              isDisabled={isLoading}
            >
              Show more
            </Button>
          </Link>
        </Box>
        <ChatBot />
      </HomeLayout>
    </ThemeProvider>
  );
};

export default observer(HomePage);
