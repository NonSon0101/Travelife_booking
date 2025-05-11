'use client';
import CMSLayout from 'components/Layout/CMSLayout'
import DashBoardManagement from 'pages/CMS/DashBoardManagement';

const BookingManagementPage = () => {
  return (
    <CMSLayout title="Dashboard" topBarTitle="Dashboard">
      <DashBoardManagement/>
    </CMSLayout>
  );
}

export default BookingManagementPage
