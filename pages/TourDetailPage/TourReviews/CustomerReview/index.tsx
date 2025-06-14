import { Avatar, HStack, VStack, Text, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react"
import RatingStart from "components/RatingStart"
import dayjs from "dayjs"

interface ICustomerReview {
  ratingStar?: number
  avatarImg?: string
  username?: string
  createDate?: Date
  comment?: string
  isLoading?: boolean
  isApprove?: boolean
}

const CustomerReview = (props: ICustomerReview) => {
  const { ratingStar, avatarImg, username, createDate, comment, isLoading = false, isApprove = false } = props

  return (
    <VStack align="flex-start" spacing={3} width="full">
      {isLoading ? (
        <Skeleton height="24px" width="120px" />
      ) : (
        <RatingStart
          sizeStar={24}
          sizeText="sm"
          isShowDetail={false}
          ratingAverage={ratingStar}
          numOfRating={1}
        />
      )}

      <HStack align="flex-start" spacing={4}>
        {isLoading ? (
          <SkeletonCircle size="40px" />
        ) : (
          <Avatar src={avatarImg} name={username ?? "User"} />
        )}
        <VStack align="flex-start" spacing={1}>
          <Skeleton isLoaded={!isLoading}>
            <Text fontWeight="bold">{username ?? "Anonymous"}</Text>
          </Skeleton>
          <Skeleton isLoaded={!isLoading}>
            <Text fontSize="sm" color="gray.500">
              {createDate ? dayjs(createDate).format("YYYY-MM-DD") : "Unknown date"} {isApprove ? ' - Verified booking' : ''} 
            </Text>
          </Skeleton>
        </VStack>
      </HStack>

      {isLoading ? (
        <SkeletonText mt="4" noOfLines={2} spacing="3" skeletonHeight="3" />
      ) : (
        <Text>{comment}</Text>
      )}
    </VStack>
  )
}

export default CustomerReview
