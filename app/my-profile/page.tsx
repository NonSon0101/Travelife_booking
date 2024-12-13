import PageLayout from "components/Layout/WebLayout/PageLayout";
import ProfilePage from "pages/ProfilePage";

const MyProfile = () => {
  return (
    <PageLayout title={"User Profile"}>
      <ProfilePage />;
    </PageLayout>
  )
};

export default MyProfile;
