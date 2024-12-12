import { Box, Flex, Text, Image, useColorModeValue, VStack, HStack, Icon } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";

import { rootStore } from "stores";

const TopToursList = () => {
  const { statisticsStore } = rootStore;
  const { bookedTour } = statisticsStore;
  const [numOfTours, setNumOfTours] = useState<number>(5);

  useEffect(() => {
    statisticsStore.fetchBookedTour(numOfTours);
  }, []);

  const TourCard = ({ thumbnail, title, bookings }: { thumbnail: string; title: string; bookings: number }) => {
    const bgCard = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.700", "white");
  
    return (
      <Flex
        bg={bgCard}
        boxShadow="lg"
        rounded="lg"
        overflow="hidden"
        direction={{ base: "column", sm: "row" }}
        p={4}
        alignItems="center"
        w="full"
        mb={4}
      >
        <Image
          src={thumbnail}
          alt={title}
          boxSize={{ base: "full", sm: "120px" }}
          objectFit="cover"
          rounded="md"
          flexShrink={0}
        />
        <VStack align="start" spacing={2} ml={{ base: 0, sm: 4 }} mt={{ base: 4, sm: 0 }} flex="1">
          <Text fontWeight="bold" fontSize="lg" color={textColor} noOfLines={2}>
            {title}
          </Text>
  
          <HStack>
            <Icon as={FaUsers} color="teal.500" />
            <Text fontSize="sm" color="gray.500">
              {bookings} bookings
            </Text>
          </HStack>
        </VStack>
      </Flex>
    );
  };
  

  return (
    <Box maxW="800px" mx="auto" mt={8}>
      <Text fontSize="lg" fontWeight="bold" mb={4} textAlign="center" color={useColorModeValue("gray.700", "white")}>
        Top Booked Tours
      </Text>
      <Box
        maxH="500px" 
        overflowY="auto"
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
        bg={useColorModeValue("white", "gray.800")}
      >
        {bookedTour.map((tour, index) => (
          <TourCard
            key={index}
            thumbnail={tour.tour.thumbnail ?? ""}
            title={tour.tour.title ?? ""}
            bookings={tour.total ?? 0}
          />
        ))}
      </Box>
    </Box>
  );
};

export default observer(TopToursList);
