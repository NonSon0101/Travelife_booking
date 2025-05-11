'use client';
import CartPageLayout from "app/cart/page";
import PageLayout from "components/Layout/WebLayout/PageLayout";
import BookingPage from "pages/BookingPage";


const Booking = () => {
  return (
    <PageLayout title={"View Booking"}>
      <BookingPage />;
    </PageLayout>
  )
};

export default Booking;
