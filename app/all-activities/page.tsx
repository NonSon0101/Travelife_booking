'use client';
import PageLayout from "components/Layout/WebLayout/PageLayout"
import AllActivitiesPage from "pages/AllActivitiesPage"
import { Suspense } from "react"

const AllActivities = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageLayout title={"All Activities"}>
        <AllActivitiesPage />
      </PageLayout>
    </Suspense>
  )
}

export default AllActivities