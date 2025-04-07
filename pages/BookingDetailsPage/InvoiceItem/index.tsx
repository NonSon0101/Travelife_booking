import { HStack, VStack, Text, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Image, Divider, Box } from "@chakra-ui/react"
import RatingStart from "components/RatingStart"
import { IBookingItem } from "interfaces/booking"
import { ITour } from "interfaces/tour"
import { formatCurrency } from "utils/common"

interface IInvoiceItem {
  openRatingModal: (tour: ITour) => void
  bookingItems: IBookingItem
  numOfItem?: number
}

const InvoiceItem = (props: IInvoiceItem) => {
  const { bookingItems, numOfItem = 0, openRatingModal } = props

  if (!bookingItems || !bookingItems.tour) {
    return (
      <VStack width="100%" marginTop="10px">
        <Text alignSelf="flex-start" fontSize="xl" fontWeight="bold" color="#004747">
          Tour 0{numOfItem + 1}
        </Text>
        <Text color="red.500">No booking details available.</Text>
      </VStack>
    );
  }

  return (
    <VStack width='100%' marginTop='10px'>
      <Text alignSelf='flex-start' fontSize='xl' fontWeight='bold' color='#004747'>Tour 0{numOfItem + 1}</Text>
      <Box width='100%'>
        <HStack align='flex-start' spacing={6}>
          <Image width={200} borderRadius="10px" src={`${bookingItems.tour.thumbnail}`} alt='tourimg' />
          <VStack align='flex-start' spacing={2}>
            <Text fontSize="lg" fontWeight="semibold">
              {bookingItems.tour.title || 'Tour title unavailable'}
            </Text>
            <RatingStart ratingAverage={bookingItems.tour.ratingAverage || 0} numOfRating={bookingItems.tour.numOfRating || 0} />
            {bookingItems.isShowReview && (
              <Text
                color="#ffd900"
                textUnderlineOffset={2}
                role="button"
                tabIndex={0}
                onClick={() => openRatingModal(bookingItems.tour)}
                userSelect="none"
                _hover={{
                  textDecoration: "underline",
                  color: "#ffb900",
                  transition: "color 0.2s ease-in-out, text-decoration 0.2s ease-in-out"
                }}
              >
                Give us a rate
              </Text>
            )}
          </VStack>
        </HStack>
      </Box>
      <TableContainer width='full' mt={4}>
        <Table variant='striped' colorScheme='teal'>
          <Thead >
            <Tr fontSize='xl' fontWeight={500}>
              <Th>Type</Th>
              <Th>Quantity</Th>
              <Th isNumeric>Price</Th>
            </Tr>
          </Thead>
          <Tbody fontSize="lg" fontWeight={500}>
            {bookingItems.participants?.length > 0 ? (
              bookingItems.participants.map((participant, index) => (
                <Tr key={index}>
                  <Td>{participant.title}</Td>
                  <Td>{participant.quantity}</Td>
                  <Td isNumeric>{formatCurrency(participant.price, 'VND')}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={3} textAlign="center">
                  No participants available
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  )
}

export default InvoiceItem