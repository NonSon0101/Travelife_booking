"use client"
import { border, Button, HStack, SimpleGrid, VStack, Text, Box, Menu, MenuButton, MenuList, RadioGroup, Stack, Radio } from "@chakra-ui/react"
import { usePathname, useSearchParams } from 'next/navigation'
import ListTourLayout from "components/Layout/WebLayout/ListTourLayout"
import Title from "components/Title"
import { useEffect, useState } from "react"
import { useStores } from "hooks"
import FilterPrice from "./FilterPrice"
import FilterDuration from "./FilterDuration"
import FilterTime from "./FilterTime"
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import TourCard from "components/TourCard"
import { observer } from "mobx-react"
import FilterStar from "./FilterStar"
import Pagination from "components/Table/components/Pagination"
import { IPagination } from "components/Table"
import FilterModal from "./FilterModal"
import PageLayout from "components/Layout/WebLayout/PageLayout"
import { IApplyFilter } from "interfaces/common"
import CustomMenuButton from "./CustomMenuButton"

const AllActivitiesPage = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { tourStore } = useStores()
  const { tours, totalCount } = tourStore;
  const [searchResult, setSearchResult] = useState<string>("");
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [isOpenFilterModal, setIsOpenFilterModal] = useState<boolean>(false)
  const [filterOptions, setFliterOptions] = useState<IApplyFilter>({} as IApplyFilter)
  const [countFilter, setCountFilter] = useState<number>(0)
  const [isApplySort, setIsApplySort] = useState<string>('')
  const pagination: IPagination = { pageIndex, tableLength: totalCount, gotoPage: setPageIndex }

  useEffect(() => {
    const search = searchParams?.get('search')
    if (search) {
      setSearchResult(search)
    }
  }, [pathname, searchParams])

  useEffect(() => {
    tourStore.fetchActiveTours(pageIndex);
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
      case 'recommeded':
        sortFilter = ''
        setIsApplySort('Recommended')
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
    <PageLayout>
      <VStack
        minHeight="700px"
        height="full"
        mt='5'
        maxWidth="1300px"
        width="full"
        align='flex-start'
      >
        <Title text={searchResult === "" ? "All activities" : `Result for "${searchResult}"`} fontSize='3xl' />
        <HStack width='full' justify='space-between'>
          <HStack spacing={5}>
            <FilterPrice setFliterOptions={setFliterOptions} isAppliedfilter={!!filterOptions.priceMax && !!filterOptions.priceMin} />
            <FilterDuration setFliterOptions={setFliterOptions} isAppliedfilter={!!filterOptions.duration} />
            <FilterStar setFliterOptions={setFliterOptions} isAppliedfilter={!!filterOptions.star} />
            {/* <FilterTime setFliterOptions={setFliterOptions}/> */}
          </HStack>
          <Button
            height={50}
            border='2px solid #dcdfe4'
            {...(countFilter !== 0 && { borderColor: 'teal' })}
            bg='transparent'
            onClick={() => setIsOpenFilterModal(true)}
          >
            {<TbAdjustmentsHorizontal size={24} />} Filters {countFilter !== 0 ? `applied: ${countFilter}` : ''}
          </Button>
        </HStack>
        <HStack width='full' justify='space-between'>
          <Text fontWeight="semibold">{totalCount} activities found</Text>
          <HStack>
            <Text whiteSpace='nowrap' fontWeight="bold" fontSize='md'>Sort by: </Text>
            <Menu
              autoSelect={false}
              computePositionOnMount
              placement="bottom-start"
            >
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
          </HStack>
        </HStack>
        <SimpleGrid
          maxWidth="1300px"
          columns={{ base: 1, sm: 2, md: 4 }}
          gap={8}
          padding={1}
          mt="8px"
        >
          {tours?.map((tour) => (
            <TourCard key={tour?._id} tour={tour} />
          ))}
        </SimpleGrid>
        <Pagination pagination={pagination} pageSize={4} setPageSize={setPageSize} />
      </VStack>
      <FilterModal
        isOpen={isOpenFilterModal}
        onClose={() => setIsOpenFilterModal(false)}
        setFliterOptions={setFliterOptions}
        filterOptions={filterOptions}
      />
    </PageLayout>
  )
}

export default observer(AllActivitiesPage)