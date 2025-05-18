"use client";
import { useEffect, useState } from "react";
import {
  SimpleGrid,
  Box,
  Button,
  extendTheme,
  ThemeProvider,
  Link,
  Skeleton,
  SkeletonText
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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const platform = PLATFORM.WEBSITE

    if (userId && accessToken && localStorage) {
      localStorage?.setItem(`${platform}UserId`, userId);
      localStorage?.setItem(`${platform}Token`, accessToken);
    }
    if (userId) {
      authStore.getUserById(PLATFORM.WEBSITE)
      route.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, accessToken]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await tourStore.fetchActiveTours();
      setIsLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <HomeLayout>
        <Box
          width='full'
          display='flex'
          justifyContent="center"
          alignItems="center"
          mt="32px"
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
      </HomeLayout>
    </ThemeProvider>
  );
};

export default observer(HomePage);
