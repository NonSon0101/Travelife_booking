import { Box, Skeleton, SkeletonText, VStack } from "@chakra-ui/react";

const TourCardSkeleton = () => {
  return (
    <Box
      position='relative'
      border='1px solid #dcdfe4'
      height="500px"
      width={{ base: 'full', md: '288px' }}
      borderRadius={8}
      boxShadow="md"
      overflow="hidden"
    >
      <Skeleton height="260px" width="100%" />

      <VStack align="flex-start" padding="8px 12px 0px" spacing={3}>
        <Skeleton height="20px" width="40%" />
        <Skeleton height="24px" width="80%" />
        <Skeleton height="20px" width="60%" />
        <Skeleton height="20px" width="50%" />
      </VStack>

      <Box padding="8px 12px 0px" position='absolute' bottom="0" width="full">
        <Skeleton height="24px" width="50%" />
      </Box>
    </Box>
  );
};

export default TourCardSkeleton;
