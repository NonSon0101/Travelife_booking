"use client";
import { HStack, VStack, Text, Image, Divider, Box, Button } from "@chakra-ui/react"
import PageLayout from "components/Layout/WebLayout/PageLayout"
import Title from "components/Title"
import dayjs from "dayjs"
import { useStores } from "hooks"
import routes from "routes";
import { observer } from "mobx-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react"
import { formatCurrency } from "utils/common";
import RatingModal from "./RatingModal";
import InvoiceItem from "./InvoiceItem";
import { ITour } from "interfaces/tour";
import { PLATFORM } from "enums/common";
import QRCodeGenerator from "./QrCode";


const BookingDetailsPage = () => {
  const { bookingStore } = useStores()
  const { bookingDetail } = bookingStore
  const router = useRouter();
  const params = useParams();
  const bookingId = Array.isArray(params?.bookingId)
    ? params.bookingId[0]
    : params?.bookingId;
  const [isOpenRatingModal, setIsOpenRatingModal] = useState<boolean>(false)
  const [tour, setTour] = useState<ITour>()

  function handleOpenRatingModal(tour: ITour) {
    setTour(tour)
    setIsOpenRatingModal(true)
  }

  function handleGoToPayment() {
    if (bookingDetail?._id) {
      bookingStore.setBookingId(bookingDetail?._id)
      localStorage.removeItem('booking_timeout')
      router.push(routes.booking.payment(bookingDetail?._id))
    }
  }

  useEffect(() => {
    bookingStore.fetchBookingDetail(bookingId, PLATFORM.WEBSITE)
  }, [bookingId])

  return (
    <>
      <VStack
        minHeight="700px"
        height="full"
        maxWidth="1300px"
        marginX="auto"
        width="full"
        padding="24px"
        spacing={8}
      >
        <Title alignSelf='flex-start' text='Your Booking Invoice' />
        <VStack width='100%' align='flex-start' spacing={6}>
          <Box width='100%'>
            <Text fontSize='2xl' fontWeight='bold' mb={2}>Personal Information</Text>
            <HStack fontSize='lg' fontWeight={500} width='full' justify='space-between' spacing={12}>
              <VStack align='flex-start' spacing={1}>
                <Text>{bookingDetail?.personalInfo.name ?? ''}</Text>
                <Text>{bookingDetail?.personalInfo.phone ?? ''}</Text>
              </VStack>
              <VStack align='flex-start' spacing={1}>
                <Text>Date: {dayjs(bookingDetail?.bookingItems[0].startDate).format('YYYY-MM-DD')}</Text>
                <Text>Invoice ID: {bookingDetail?.payment?.transactionNo ?? ''}</Text>
                <Text>Payment Method: {bookingDetail?.payment?.method ?? ''}</Text>
              </VStack>
            </HStack>
          </Box>
          <Divider />
          <Text fontSize='2xl' fontWeight='bold' mb={2}>Booking Details</Text>
          {bookingDetail?.bookingItems && bookingDetail?.bookingItems.map((bookingItem, index) =>
            <InvoiceItem key={bookingItem._id} numOfItem={index} bookingItems={bookingItem} openRatingModal={handleOpenRatingModal} />)}

          <Divider />
          <HStack width='full' justify='center' align='flex-start' paddingRight={6}>
            <QRCodeGenerator url={typeof window !== 'undefined' && window.location.href} />
            <VStack align='flex-start' spacing={5}>
              <HStack width='full' justify='space-between' spacing={4}>
                <Text fontSize='lg' fontWeight='bold'>Subtotal: </Text>
                <Text fontSize='lg' fontWeight={500}>{formatCurrency(bookingDetail?.checkoutOrder.totalOrder ?? 0, 'VND')}</Text>
              </HStack>
              <Divider />
              <HStack width='full' justify='space-between' spacing={4}>
                <Text fontSize='lg' fontWeight='bold'>Discount: </Text>
                <Text fontSize='lg' fontWeight={500}>{formatCurrency(bookingDetail?.checkoutOrder.discount ?? 0, 'VND')}</Text>
              </HStack>
              <Divider />
              <HStack width='full' justify='space-between' spacing={4}>
                <Text fontSize='lg' fontWeight='bold'>Total price: </Text>
                <Text fontSize='lg' fontWeight={500}>{formatCurrency(bookingDetail?.checkoutOrder.totalPrice ?? 0, 'VND')}</Text>
              </HStack>
              {bookingDetail?.status === 'pending' ?
                <Button width='full' colorScheme="teal" onClick={handleGoToPayment}>Go to payment</Button>
                : <Text
                  textAlign='center'
                  paddingY={5}
                  borderRadius={10}
                  fontSize='lg'
                  fontWeight={500}
                  width='full'
                  bg='#4dbb4d'
                  color='#fff' >
                  Your booking has been Paid
                </Text>
              }
            </VStack>
          </HStack>
        </VStack>
        <RatingModal tour={tour} isOpen={isOpenRatingModal} onClose={() => setIsOpenRatingModal(false)} />
      </VStack>
    </>
  )
}

export default observer(BookingDetailsPage)
