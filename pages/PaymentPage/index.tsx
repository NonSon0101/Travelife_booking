"use client";
import {
  VStack,
  Flex,
  Box,
  Text,
  Image,
  Button,
  HStack,
  Divider
} from "@chakra-ui/react";
import BookingStatus from "components/BookingStatus";
import PageLayout from "components/Layout/WebLayout/PageLayout";
import { useParams, useRouter } from "next/navigation";
import Title from "components/Title";
import { useEffect, useState } from "react";
import { useStores } from "hooks";
import { formatCurrency } from "utils/common";
import { observer } from "mobx-react";
import BillingInfo from "./BillingInfo";
import { PLATFORM } from "enums/common";
import CountdownTimer from "components/CountDownTimer";


const PaymentPage = () => {
  const route = useRouter()
  const { bookingStore, checkoutStore } = useStores();
  const { bookingDetail, currentCurrency } = bookingStore
  const { paymentURL } = checkoutStore
  const params = useParams();
  const bookingId = Array.isArray(params?.bookingId)
    ? params.bookingId[0]
    : params?.bookingId;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const handlePaymentMethodClick = (paymentMethod: string) => {
    setSelectedPaymentMethod(paymentMethod);
  };

  useEffect(() => {
    bookingStore.fetchBookingDetail(bookingId, PLATFORM.WEBSITE);
    bookingStore.fetchPendingBooking()
  }, [bookingId]);

  useEffect(() => {
    if (paymentURL) {
      route.push(paymentURL)
    }
  }, [paymentURL])

  async function handlePayment() {
    await checkoutStore.prePayCheckout(bookingId!)
  }
  return (
    <>
      <CountdownTimer/>
      <VStack
        minHeight="700px"
        height="full"
        maxWidth="1300px"
        marginX="auto"
        width="full"
        padding="24px">
        <BookingStatus currentPage="payment" />
        <VStack
          direction="column"
          width="500px"
          height="full"
          backgroundColor="#fff"
          align='flex-start'
          borderRadius='15px'
          boxShadow='lg'
          padding='20px 14px'
        >
          <Title text='Continue secure payment with VNPay' />

          <Flex mt={10} justify="center" width="full" marginY='20px'>
            {/* <Box
            width={100}
            alignItems='center'
            border='2px solid transparent'
            onClick={() => handlePaymentMethodClick('visa')}
            borderColor={selectedPaymentMethod === 'visa' ? 'teal' : 'transparent'}
            cursor="pointer"
          >
            <Image src="https://1000logos.net/wp-content/uploads/2021/11/VISA-logo.png" alt="Visa" width={100} />
          </Box>

          <Box
            width={100}
            alignItems='center'
            border='2px solid transparent'
            onClick={() => handlePaymentMethodClick('mastercard')}
            borderColor={selectedPaymentMethod === 'mastercard' ? 'teal' : 'transparent'}
            cursor="pointer"
          >
            <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7Wl7obNMoRyoW5ZJirDhZVLf99NQKWw6UZv5zIUOLUuDn6UrCOU6qcqJx2VIrhRIRblg&usqp=CAU" alt="Mastercard" width={100} />
          </Box> */}

            <Box
              width={100}
              alignItems='center'
              border='2px solid transparent'
              onClick={() => handlePaymentMethodClick('vnpay')}
              borderColor={selectedPaymentMethod === 'vnpay' ? 'teal' : 'transparent'}
              cursor="pointer"
            >
              <Image src="https://vnpay.vn/dat-ve-may-bay/1803/6.png?12" alt="VnPay" width={100} />
            </Box>
            {/* <Box
            width={100}
            alignItems='center'
            border='2px solid transparent'
            onClick={() => handlePaymentMethodClick('momo')}
            borderColor={selectedPaymentMethod === 'momo' ? 'teal' : 'transparent'}
            cursor="pointer"
          >
            <Image src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="Momo" width={100} />
          </Box> */}
          </Flex>
          <Divider colorScheme='teal.300' size='xl' variant='solid' />
          {bookingDetail && bookingDetail.personalInfo && (
            <BillingInfo bookingDetail={bookingDetail} currentCurrency={currentCurrency} />
          )}
          <Divider />
          <Button marginY='20px' width='full' colorScheme="teal" onClick={handlePayment}>
            Continue to secure payment
          </Button>

        </VStack>
      </VStack>
    </>
  );
};

export default observer(PaymentPage);
