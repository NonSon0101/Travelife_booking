"use client";
import { Box, HStack, VStack, Text, useDisclosure } from "@chakra-ui/react";
import { observer } from "mobx-react";
import PageLayout from "components/Layout/WebLayout/PageLayout";
import { useStores } from "hooks";
import Title from "components/Title";
import BookingItem from "./BookingItem";
import { useEffect, useState } from "react";
import { IPagination } from "components/Table";
import Pagination from "components/Table/components/Pagination";
import CountdownTimer from "components/CountDownTimer";
import ConfirmModal from "components/ConfirmModal";


const BookingPage = () => {
  const { bookingStore, authStore } = useStores()
  const { bookingList, totalResult } = bookingStore
  const { isLogin } = authStore
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const pagination: IPagination = { pageIndex, tableLength: totalResult, gotoPage: setPageIndex }

  useEffect(() => {
    bookingStore.fetchListBooking(pageIndex)
  }, [pageIndex])


  return (
    <>
      {isLogin &&
        <CountdownTimer />
      }
      <VStack
        position='relative'
        minHeight="700px"
        height="full"
        maxWidth="1300px"
        marginX="auto"
        width="full"
        padding="24px"
        align='flex-start'
      >
        <Title text='Your booking' />
        <HStack width='full' justify='space-between' marginTop='20px' spacing={10} align='flex-start'>
          <VStack width='full' flex={2} align='flex-start' spacing={8}>
            {bookingList.length > 0 && (bookingList.map((booking) => <BookingItem key={booking._id} booking={booking} />))}

          </VStack>
        </HStack>
        <Box position='absolute' bottom={0} left='50%' transform='translateX(-50%)'>
          <Pagination pagination={pagination} pageSize={4} setPageSize={setPageSize} />
        </Box>
      </VStack>
    </>
  );
}

export default observer(BookingPage);
