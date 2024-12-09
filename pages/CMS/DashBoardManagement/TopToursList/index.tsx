import { Box, Image, Text, Flex, VStack, HStack, Icon, useColorModeValue, Badge } from "@chakra-ui/react";
import { FaUsers } from "react-icons/fa";

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
      {/* Thumbnail */}
      <Image
        src={thumbnail}
        alt={title}
        boxSize={{ base: "full", sm: "120px" }}
        objectFit="cover"
        rounded="md"
        flexShrink={0}
      />

      {/* Tour Info */}
      <VStack align="start" spacing={2} ml={{ base: 0, sm: 4 }} mt={{ base: 4, sm: 0 }} flex="1">
        {/* Tour Title */}
        <Text fontWeight="bold" fontSize="lg" color={textColor} noOfLines={2}>
          {title}
        </Text>

        {/* Booking Count */}
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

const TopToursList = () => {
  const tours = [
    {
      thumbnail: "https://via.placeholder.com/120",
      title: "Discover the Beauty of Bali",
      bookings: 512,
    },
    {
      thumbnail: "https://via.placeholder.com/120",
      title: "Amazing Thailand Adventure",
      bookings: 460,
    },
    {
      thumbnail: "https://via.placeholder.com/120",
      title: "European Dream Tour",
      bookings: 399,
    },
    {
      thumbnail: "https://via.placeholder.com/120",
      title: "Magical Japan Journey",
      bookings: 350,
    },
  ];

  return (
    <Box maxW="800px" mx="auto" mt={8}>
      <Text fontSize="lg" fontWeight="bold" mb={6} textAlign="center" color={useColorModeValue("gray.700", "white")}>
        Top Booked Tours
      </Text>
      {tours.map((tour, index) => (
        <TourCard key={index} thumbnail={tour.thumbnail} title={tour.title} bookings={tour.bookings} />
      ))}
    </Box>
  );
};

export default TopToursList;
