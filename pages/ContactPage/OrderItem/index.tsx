import { Box, HStack, VStack, Image, Text, Divider } from "@chakra-ui/react"
import RatingStart from "components/RatingStart";
import { ITourCart } from "interfaces/cart";
import { IDiscountItem } from "interfaces/checkout";
import { FaBus, FaHotel } from "react-icons/fa";
import { IoTimerOutline } from "react-icons/io5";
import { LuCalendarDays } from "react-icons/lu";
import { MdPeopleAlt } from "react-icons/md";

interface IOrderItem {
  tour: ITourCart
}

const OrderItem = (props: IOrderItem) => {
  const { tour } = props
  return (
    <Box padding='2px'>
      <HStack fontSize='lg' fontWeight='500' margin="28px 28px 12px 28px" >
        <Image borderRadius="8px" width="180px" src={`${tour?.tour?.thumbnail}`} alt="img" align="flex-start" />
        <VStack alignItems="flex-start">
          <Text>{`${tour?.tour?.title}`}</Text>
          <RatingStart sizeStar={24} sizeText="md" ratingAverage={tour?.tour?.ratingAverage} numOfRating={tour?.tour?.numOfRating} />
        </VStack>
      </HStack>
      <Divider />
      <VStack fontWeight='500' align='flex-start' margin="12px 28px 12px 28px">
        <HStack>
          <LuCalendarDays />
          <Text>{tour?.startDate.slice(0, 10)}</Text>
        </HStack>
        <HStack>
          <IoTimerOutline />
          <Text>{tour?.startTime}</Text>
        </HStack>
        {tour?.isPrivate &&
          <>
            <HStack>
              <FaHotel />
              <Text>{tour?.hotels[0]?.name}</Text>
            </HStack>
            <HStack>ß
              <FaBus />
              <Text>{tour?.transports[0]?.name}</Text>
            </HStack>
          </>
        }
        <HStack>
          <MdPeopleAlt />
          {tour?.participants.map((participant) => (
            <Text fontSize="md" fontWeight="bold" key={participant?.title}>
              {participant?.quantity} {participant?.title}
            </Text>
          ))}
        </HStack>
      </VStack>
      <Divider borderColor="teal.500" borderWidth="2px" />
    </Box>
  )
}

export default OrderItem