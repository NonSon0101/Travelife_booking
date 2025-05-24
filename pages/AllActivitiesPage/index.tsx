"use client";
import { Button, SimpleGrid, VStack, Text, Box, Menu, MenuButton, MenuList, RadioGroup, Stack, Radio, WrapItem, Wrap, Skeleton, SkeletonText } from "@chakra-ui/react"
import { usePathname, useSearchParams } from 'next/navigation'
import Title from "components/Title"
import { useEffect, useState } from "react"
import { useStores } from "hooks"
import FilterPrice from "./FilterPrice"
import FilterDuration from "./FilterDuration"
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import TourCard from "components/TourCard"
import { observer } from "mobx-react"
import FilterStar from "./FilterStar"
import Pagination from "components/Table/components/Pagination"
import { IPagination } from "components/Table"
import FilterModal from "./FilterModal"
import { IApplyFilter } from "interfaces/common"
import CustomMenuButton from "./CustomMenuButton"

const AllActivitiesPage = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.get('search');
  const { tourStore } = useStores();
  const { tours, totalCount } = tourStore;
  const [searchResult, setSearchResult] = useState<string>("");
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isOpenFilterModal, setIsOpenFilterModal] = useState<boolean>(false);
  const [filterOptions, setFliterOptions] = useState<IApplyFilter>({} as IApplyFilter);
  const [countFilter, setCountFilter] = useState<number>(0);
  const [isApplySort, setIsApplySort] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const pagination: IPagination = { pageIndex, tableLength: totalCount, gotoPage: setPageIndex };

  useEffect(() => {
    if (search) {
      setSearchResult(search)
    }
  }, [search])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await tourStore.fetchActiveTours(pageIndex);
      setIsLoading(false);
    };
    fetchData();
  }, [pageIndex]);

  useEffect(() => {
    let filter = ""
    setCountFilter(0)
    if (filterOptions.priceMax && filterOptions.priceMin) {
      filter += `regularPrice[lt]=${filterOptions.priceMax.value}&`
      filter += `regularPrice[gt]=${filterOptions.priceMin.value}&`
      setCountFilter(prevCount => prevCount + 1)
    }
    if (filterOptions.star) {
      filter += `ratingAverage[gt]=${filterOptions.star.value}&`
      setCountFilter(prevCount => prevCount + 1)
    }
    if (filterOptions.duration) {
      filter += `duration[lt]=${filterOptions.duration.value}&`
      setCountFilter(prevCount => prevCount + 1)
    }

    tourStore.fetchActiveTours(pageIndex, filter)
  }, [filterOptions])

  async function handleSort(sortOption: string) {
    let sortFilter = '';

    switch (sortOption) {
      case 'recommended':
        sortFilter = ''
        setIsApplySort('Recommended')
        break;
      case 'priceUp':
        sortFilter = 'sort=regularPrice';
        setIsApplySort('Price - Low To High')
        break;
      case 'priceDown':
        sortFilter = 'sort=-regularPrice';
        setIsApplySort('Price - Hign To Low')
        break;
      case 'rating':
        sortFilter = 'sort=-ratingAverage';
        setIsApplySort('Rating')
        break;
      default:
        console.warn('Invalid sort option:', sortOption);
        return;
    }
    await tourStore.fetchActiveTours(pageIndex, sortFilter);
  }


  return (
    <>
      <VStack
        minHeight="700px"
        height="full"
        mt='5'
        maxWidth="1300px"
        marginX="auto"
        width="full"
        align='flex-start'
      >
        <Title text={searchResult === "" ? "All activities" : `Result for "${searchResult}"`} fontSize='3xl' />
        <Stack
          direction={['column', 'row']}
          width='full'
          justify='space-between'
          spacing={4}
          align={['stretch', 'center']}
        >
          <Wrap spacing={3}>
            <WrapItem>
              <FilterPrice setFliterOptions={setFliterOptions} isAppliedfilter={!!filterOptions.priceMax && !!filterOptions.priceMin} />
            </WrapItem>
            <WrapItem>
              <FilterDuration setFliterOptions={setFliterOptions} isAppliedfilter={!!filterOptions.duration} />
            </WrapItem>
            <WrapItem>
              <FilterStar setFliterOptions={setFliterOptions} isAppliedfilter={!!filterOptions.star} />
            </WrapItem>
          </Wrap>

          <Button
            height={50}
            border='2px solid #dcdfe4'
            {...(countFilter !== 0 && { borderColor: 'teal' })}
            bg='white'
            onClick={() => setIsOpenFilterModal(true)}
            width={['full', 'auto']}
          >
            {<TbAdjustmentsHorizontal size={24} />} Filters {countFilter !== 0 ? `applied: ${countFilter}` : ''}
          </Button>
        </Stack>
        <Stack
          direction={['column', 'row']}
          width='full'
          justify='space-between'
          align={['flex-start', 'center']}
          spacing={4}
          mt={4}
        >
          <Text fontWeight="semibold">{totalCount} activities found</Text>
          <Stack direction='row' align="center" spacing={2}>
            <Text whiteSpace='nowrap' fontWeight="bold" fontSize='md'>Sort by: </Text>
            <Menu autoSelect={false} computePositionOnMount placement="bottom-start">
              <CustomMenuButton
                as={MenuButton}
                text={isApplySort || 'Recommended'}
              />
              <MenuList>
                <RadioGroup
                  as="fieldset"
                  borderColor="gray.300"
                  p={6}
                  rounded="md"
                  colorScheme="teal"
                  onChange={handleSort}
                >
                  <Stack spacing={4}>
                    <Radio value="recommended">Recommended</Radio>
                    <Radio value="priceUp">Price - Low To High</Radio>
                    <Radio value="priceDown">Price - High To Low</Radio>
                    <Radio value="rating">Rating</Radio>
                  </Stack>
                </RadioGroup>
              </MenuList>
            </Menu>
          </Stack>
        </Stack>
        <SimpleGrid
          maxWidth="1300px"
          columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
          gap={8}
          p={1}
          mt={2}
          w="full"
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, idx) => (
                <VStack key={idx} spacing={3} align="flex-start">
                  <Skeleton height="200px" width="full" borderRadius="md" />
                  {/* just a workaround solution and need improve further */}
                  {typeof window !== 'undefined' && <SkeletonText noOfLines={3} spacing={2} skeletonHeight={3} width="full" />}
                  <Skeleton height="20px" width="40%" />
                </VStack>
              ))
            : tours?.map((tour) => <TourCard key={tour?._id} tour={tour} />)}
        </SimpleGrid>
        <Box alignSelf="center" marginY="8px">
          <Pagination pagination={pagination} pageSize={pageSize - 1} setPageSize={setPageSize}/>
        </Box>
      </VStack>
      <FilterModal
        isOpen={isOpenFilterModal}
        onClose={() => setIsOpenFilterModal(false)}
        setFliterOptions={setFliterOptions}
        filterOptions={filterOptions}
      />
    </>
  )
}

export default observer(AllActivitiesPage)