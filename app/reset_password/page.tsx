'use client';
import PageLayout from "components/Layout/WebLayout/PageLayout";
import ResetPasswordPage from "pages/ResetPasswordPage";
import { Suspense } from "react";

const ResetPassword = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageLayout title={"Reset Password"}>
        <ResetPasswordPage />
      </PageLayout>
    </Suspense>
  )
}

export default ResetPassword