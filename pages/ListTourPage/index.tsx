"use client";
import { SimpleGrid, VStack, Text, Box, HStack, Button, MenuButton, RadioGroup, MenuList, Menu, Stack, Radio } from "@chakra-ui/react"
import ListTourLayout from "components/Layout/WebLayout/ListTourLayout"
import PageLayout from "components/Layout/WebLayout/PageLayout";
import Title from "components/Title"
import TourCard from "components/TourCard";
import { useStores } from "hooks";
import { IApplyFilter } from "interfaces/common";
import { observer } from "mobx-react";
import CustomMenuButton from "pages/AllActivitiesPage/CustomMenuButton";
import FilterDuration from "pages/AllActivitiesPage/FilterDuration";
import FilterModal from "pages/AllActivitiesPage/FilterModal";
import FilterPrice from "pages/AllActivitiesPage/FilterPrice";
import FilterStar from "pages/AllActivitiesPage/FilterStar";
import Maps from "pages/TourDetailPage/Maps";
import { useEffect, useState } from "react";
import { TbAdjustmentsHorizontal } from "react-icons/tb";

const ListTourPage = () => {

  const { tourStore, locationStore } = useStores();
  const { tours, totalCount } = tourStore;
  const { locationDetail } = locationStore;
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [filterOptions, setFliterOptions] = useState<IApplyFilter>({} as IApplyFilter)
  const [countFilter, setCountFilter] = useState<number>(0)
  const [isApplySort, setIsApplySort] = useState<string>('')
  const [isOpenFilterModal, setIsOpenFilterModal] = useState<boolean>(false)
  const [locId, setLocId] = useState<string>()

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split("/");
    setLocId(urlParts[urlParts.length - 1])
  }, [])

  useEffect(() => {
    if (locId) {
      locationStore.fetchLocationDetail(locId);
    }
  }, [locId])

  useEffect(() => {
    tourStore.fetchActiveTours();
  }, []);

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
    < >
      <Box
        width="full"
        boxShadow="md"
        background={`linear-gradient(268deg, rgba(12, 24, 47, 0) 34.23%, rgba(12, 24, 47, .6) 97.86%), url(${locationDetail?.thumbnail}) no-repeat center/cover`}
        backgroundPosition="center"
        bgRepeat="no-repeat"
        height="603px"
      >
        <HStack
          maxWidth="1300px"
          width='full'
          marginX='auto'
          display='flex'
          justifyContent='space-between'
          marginY='20px'
          color='#1A2B49'
        >
          <VStack alignSelf='start'>
            <Text textAlign='left' fontWeight='700' fontSize='2xl' color='white'>Things to do in</Text>
            <Text fontWeight='900' fontSize='7xl' color='white'>{locationDetail?.title}</Text>
          </VStack>
          <Box>
            <Maps coordinates={locationDetail?.loc?.coordinates} />
          </Box>
        </HStack>
      </Box>
      <VStack
        minHeight="700px"
        height="full"
        maxWidth="1300px"
        marginX="auto"
        width="full"
        align='flex-start'
        mt='5'
      >
        <Title text='All activities' fontSize='3xl' />
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

export default observer(ListTourPage)