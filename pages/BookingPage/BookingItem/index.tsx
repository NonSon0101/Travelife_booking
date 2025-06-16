import { Box, HStack, Stack, Text, Button, IconButton, useDisclosure } from "@chakra-ui/react";
import capitalize from 'lodash/capitalize'
import { useRouter } from "next/navigation";
import routes from "routes";
import { IBookingInfoBody } from "interfaces/booking";
import { FaTrash } from "react-icons/fa";
import { useStores } from "hooks";
import { formatCurrency } from "utils/common";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import ConfirmModal from "components/ConfirmModal";

interface IBookingItem {
  booking: IBookingInfoBody
}

const BookingItem = (props: IBookingItem) => {
  const { booking } = props

  if (!booking) {
    return <Text>Error: Booking information is missing.</Text>;
  }

  const route = useRouter();
  const { bookingStore } = useStores();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCalled, setIsCalled] = useState<boolean>(false)
  const [time, setTime] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRefs = useRef<NodeJS.Timeout[]>([]);
  const { isOpen: isConfirming, onOpen: onConfirm, onClose: closeConfirm } = useDisclosure()

  useEffect(() => {
    if (booking.status === 'pending' && !isCalled) {
      setIsCalled(true)
      const dataBookingString = localStorage.getItem('booking_timeout')!;
      const userId = localStorage.getItem('websiteUserId')
      if (!dataBookingString) {
        setIsExpired(true);
        return;
      } else {

        const dataBooking = JSON.parse(dataBookingString);
        const timeoutString = booking.createdAt

        if (!userId || (userId !== dataBooking.userId)) {
          setIsExpired(true);
          return;
        }

        const now = dayjs();
        const timeout = dayjs(timeoutString, 'YYYY-MM-DD HH:mm:ss').add(10, 'minute');

        if (now.isAfter(timeout)) {
          bookingStore.fetchPendingBooking()
          setIsExpired(true);
          return;
        }

        const remainingSeconds = timeout.diff(now, 'second');
        setTime(remainingSeconds);

        intervalRef.current = setInterval(() => {
          setTime((prevTime) => {
            if (prevTime <= 1) {
              setTimeout(() => {
                bookingStore.fetchPendingBooking();
                clearInterval(intervalRef.current!);
                setIsExpired(true);
              }, 1000);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);

        intervalRefs.current.push(intervalRef.current)

        return () => clearInterval(intervalRef.current!);
      }
    }
  }, []);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  function handleGoToPayment() {
    bookingStore.setBookingId(booking._id)
    route.push(routes.booking.payment)
  }

  function handleViewBookingDetail() {
    window.location.href = routes.booking.detail(booking._id).toString();
  }

  function onClickDeleteBooking(): void {
    onConfirm()
  }

  async function handleDeleteBooking() {
    try {
      setIsLoading(true)
      intervalRefs.current.forEach((id) => clearInterval(id));
      intervalRefs.current = [];
      await bookingStore.deleteBooking(booking._id)
      localStorage.removeItem('booking_timeout')
      setIsExpired(true);
      bookingStore.fetchPendingBooking()
      location.reload()
      setIsLoading(false)
    } catch {
      setIsLoading(false)
    }
  }

  return (
    <>
      <HStack
        width="full"
        bg="#fff"
        boxShadow="lg"
        borderRadius="4px"
        p={4}
        justify="space-between"
      >
        <Stack flex={2} spacing={2} fontSize="md">
          <Text fontWeight="bold">{booking.personalInfo?.name || "N/A"}</Text>
          <Text fontSize="sm">{booking.personalInfo?.phone || "N/A"}</Text>
          <Text
            color='teal'
            fontWeight='bold'
            textUnderlineOffset={2}
            userSelect="none"
            onClick={handleViewBookingDetail}
            _hover={{
              textDecoration: "underline",
              color: "##026b6b",
              transition: "color 0.2s ease-in-out, text-decoration 0.2s ease-in-out"
            }}>
            {`View details ->`}
          </Text>
          {booking.status === 'pending' &&
            <Text>We’ll hold your booking for <Text color="teal.500" fontWeight="bold" display="inline">{formatTime(time)}</Text> minutes.</Text>
          }
        </Stack>

        <Box
          bg={booking.status == 'pending' ? "#f15c36" : "#4fd14a"}
          color="#fff"
          px={4}
          py={2}
          borderRadius="full"
          border={booking.status == 'pending' ? "3px solid #740a03" : "3px solid #0e961e"}
          fontSize="md"

        >
          <Text fontWeight="bold">{capitalize(booking.status)}</Text>
        </Box>
        <Stack flex={1} spacing={1} alignItems="flex-end">
          <HStack fontSize='lg'>
            <Text fontWeight="bold" color="gray.600">Total:</Text>
            <Text fontWeight="bold">{formatCurrency(booking.checkoutOrder.totalPrice, 'VND')}</Text>
          </HStack>
          <HStack spacing={5}>
            {booking.status == 'pending' ? (
              <>
                <Button colorScheme="teal" size="md" onClick={handleGoToPayment}>Pay Now</Button>
                <IconButton
                  colorScheme="red"
                  size="md"
                  aria-label="Delete"
                  onClick={onClickDeleteBooking}
                  icon={<FaTrash />} />
              </>
            ) : <Text >{`Payment code: `}<Text fontWeight="bold">{booking.payment?.bankTranNo}</Text> </Text>}
          </HStack>
        </Stack>
      </HStack>
      <ConfirmModal
        titleText="Delete Booking"
        bodyText={<Text>Are you sure to delete this booking?{<br />}This action can not be undo</Text>}
        cancelButtonText="No, keep this booking"
        confirmButtonText="Yes, delete"
        isOpen={isConfirming}
        onClose={closeConfirm}
        onClickAccept={handleDeleteBooking}
      />
    </>
  );
};

export default BookingItem;
