import { Box, Img, Text, VStack, HStack, Link, extendTheme } from "@chakra-ui/react";
import Icon from "components/Icon";
import { border } from "themes/globalStyles";
import { ITour } from "interfaces/tour";
import { formatCurrency } from "utils/common";
import RatingStart from "components/RatingStart";
import { ThemeProvider } from "@emotion/react";

const breakpoints = {
  base: '0px',
  sm: '578px',
  md: '868px',
  lg: '1060px',
  xl: '1300px',
  '2xl': '1536px',
};

const theme = extendTheme({ breakpoints });

interface ITourCard {
  tour: ITour;
}

const TourCard = (props: ITourCard) => {
  const { tour } = props
  
  const src = `${tour?.thumbnail}`

  return (
    <Link href={`/tour-detail/${tour._id}`} _hover={{ textDecoration: "none" }}>
      <ThemeProvider theme={theme}>
        <Box
          position='relative'
          border={border}
          height="500px"
          width={{base: 'full', md: '288px'}}
          borderRadius={8}
          boxShadow="md"
          cursor="pointer"
          borderBlock="1px solid #dcdfe4"
          overflow="hidden"
          _hover={{
            "& img": {
              transform: "scale(1.2)",
            },
          }}
        >
          <Box width="full" height="260px" overflow="hidden">
            <Img
              height="260px"
              width='full'
              src={src}
              objectFit="cover"
              borderTopRadius={8}
              transition="transform .5s ease"
            />
          </Box>

          <VStack
            position="relative"
            fontSize="lg"
            align="flex-start"
            padding="8px 12px 0px"
          >
            <Text>Hiking</Text>
            <Text color="gray.800" fontWeight={700} lineHeight={1} mb="4px">
              {tour.title}
            </Text>
            <Text fontSize="md" mb="4px" fontWeight="500">
              2 hours
            </Text>
            <RatingStart sizeStar={24} sizeText="sm" ratingAverage={tour.ratingAverage} numOfRating={tour.numOfRating}/>
          </VStack>
          <Text padding="8px 12px 0px" position='absolute' bottom="0" fontSize="lg" fontWeight="600">
              From {formatCurrency(tour?.regularPrice ?? 0)}
          </Text>
        </Box>
      </ThemeProvider>
    </Link>
  )
}

export default TourCard
