import { HStack, Skeleton, SkeletonText, Text } from "@chakra-ui/react";
import { CustomRatingStar } from "components/Layout/WebLayout/components/CustomRatingStar";
import Icon from "components/Icon";

interface IRatingStart {
  sizeStar?: number;
  sizeText?: string;
  isShowDetail?: boolean;
  ratingAverage?: number;
  numOfRating?: number;
  isLoading?: boolean;
}

const RatingStart = (props: IRatingStart) => {
  const {
    sizeStar = 24,
    ratingAverage = 0,
    numOfRating = 0,
    sizeText,
    isShowDetail = true,
    isLoading = false,
  } = props;

  return (
    <HStack fontWeight="bold">
      {/* Skeleton cho phần sao */}
      <HStack spacing={0.5}>
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} width={`${sizeStar}px`} height={`${sizeStar}px`} borderRadius="full" />
            ))
          : Array.from(Array(5)).map((_, index) => {
              const starSerialNumber = index + 1;

              if (starSerialNumber <= Math.floor(ratingAverage)) {
                return <CustomRatingStar key={starSerialNumber} size={sizeStar} filling={1} />;
              }

              if (starSerialNumber > Math.ceil(ratingAverage)) {
                return <CustomRatingStar key={starSerialNumber} size={sizeStar} filling={0} />;
              }

              const filling = ratingAverage - index;
              return <CustomRatingStar key={starSerialNumber} size={sizeStar} filling={filling} />;
            })}
      </HStack>

      {/* Skeleton cho phần text chi tiết */}
      {isShowDetail && (
        <HStack fontSize={`${sizeText}`}>
          {isLoading ? (
            <>
              <Skeleton height="20px" width="40px" />
              <Skeleton height="20px" width="80px" />
            </>
          ) : (
            <>
              <Text>{ratingAverage.toFixed(1)} / 5</Text>
              <Text color="#888">{numOfRating} reviews</Text>
            </>
          )}
        </HStack>
      )}
    </HStack>
  );
};

export default RatingStart;
