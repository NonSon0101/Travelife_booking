"use client";
import { Box, Divider, VStack, Text } from "@chakra-ui/react"
import RatingStart from "components/RatingStart"
import CustomnerReview from "./CustomerReview"
import { useStores } from "hooks"
import { useEffect } from "react"
import { observer } from "mobx-react";

interface ITourReviews {
  tourId: string
  ratingAverage: number
  numOfRating: number
}

const TourReviews = (props: ITourReviews) => {
  const{ratingAverage, numOfRating, tourId} = props
  const {reviewStore} = useStores()
  const {tourReviews} = reviewStore

  useEffect(() => {
    if (tourId !== 'undefined') { 
      reviewStore.getReviewInTour(tourId);
    }
  }, [tourId]);       
  return(
  <VStack height='fit-content' align='flex-start' spacing={10}>
    <Box >
      <Text fontWeight='bold'>Overal rating</Text>
      <RatingStart sizeStar={24} sizeText="xl" ratingAverage={ratingAverage} numOfRating={numOfRating}/>
    </Box>
    <Divider borderColor="#888" orientation='vertical'/>
    {tourReviews && tourReviews.map((review) => (
      <CustomnerReview 
        key={review._id} 
        ratingStar={review.rating} 
        avatarImg={review?.user?.profilePicture} 
        username={review?.user?.username}
        createDate={review.reviewAt}
        comment={review.content}
        isApprove={review.approve}
      />
    ))} 
    
  </VStack>         
  )
}

export default observer(TourReviews)