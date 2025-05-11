'use client';
import PageLayout from "components/Layout/WebLayout/PageLayout"
import BookingDetailsPage from "pages/BookingDetailsPage"

const BookingDetails = () => {
  return (
    <PageLayout title={"Booking details"}>
      <BookingDetailsPage />
    </PageLayout>
  )
}

export default BookingDetails