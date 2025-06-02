"use client";
import { SimpleGrid, VStack, Text, Box, HStack, Button, MenuButton, RadioGroup, MenuList, Menu, Stack, Radio } from "@chakra-ui/react"
import ChatBot from "components/ChatBot";
import ListTourLayout from "components/Layout/WebLayout/ListTourLayout"
import PageLayout from "components/Layout/WebLayout/PageLayout";
import { IPagination } from "components/Table";
import Pagination from "components/Table/components/Pagination";
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
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filterOptions, setFliterOptions] = useState<IApplyFilter>({} as IApplyFilter);
  const [countFilter, setCountFilter] = useState<number>(0);
  const [isApplySort, setIsApplySort] = useState<string>('');
  const [isOpenFilterModal, setIsOpenFilterModal] = useState<boolean>(false);
  const [locId, setLocId] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const pagination: IPagination = { pageIndex, tableLength: totalCount, gotoPage: setPageIndex };

  useEffect(() => {
    if (locId) {
      locationStore.fetchLocationDetail(locId);
    }
  }, [locId])

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split("/");
    setLocId(urlParts[urlParts.length - 1])

    let filter = `location=${urlParts[urlParts.length - 1]}&`
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

    const fetchData = async () => {
      setIsLoading(true);
      await tourStore.fetchActiveTours(pageIndex, filter);
      setIsLoading(false);
    };
    fetchData();
  }, [pageIndex, filterOptions]);

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
        height={{ base: '300px', md: '603px' }}
        px={{ base: 4, md: 0 }}
      >
        <HStack
          maxWidth="1300px"
          width="full"
          marginX="auto"
          justifyContent="space-between"
          marginY="20px"
          color="#1A2B49"
          align="center"
          flexDir={{ base: 'column', md: 'row' }}
          textAlign={{ base: 'center', md: 'left' }}
          spacing={6}
          pt={{ base: 8, md: 20 }}
        >
          <VStack spacing={2}>
            <Text fontWeight="700" fontSize={{ base: 'lg', md: '2xl' }} color="white">
              Things to do in
            </Text>
            <Text fontWeight="900" fontSize={{ base: '4xl', md: '7xl' }} color="white">
              {locationDetail?.title}
            </Text>
          </VStack>
          <Box mt={{ base: 4, md: 0 }}>
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
        <Stack
          direction={{ base: 'column', md: 'row' }}
          width="full"
          justify="space-between"
          spacing={4}
          mt={4}
        >
          <HStack spacing={4} wrap="wrap">
            <FilterPrice setFliterOptions={setFliterOptions} isAppliedfilter={!!filterOptions.priceMax && !!filterOptions.priceMin} />
            <FilterDuration setFliterOptions={setFliterOptions} isAppliedfilter={!!filterOptions.duration} />
            <FilterStar setFliterOptions={setFliterOptions} isAppliedfilter={!!filterOptions.star} />
          </HStack>

          <Button
            height={50}
            border="2px solid"
            borderColor={countFilter !== 0 ? 'teal' : '#dcdfe4'}
            bg="transparent"
            onClick={() => setIsOpenFilterModal(true)}
            leftIcon={<TbAdjustmentsHorizontal size={20} />}
          >
            Filters {countFilter !== 0 ? `applied: ${countFilter}` : ''}
          </Button>
        </Stack>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          width="full"
          spacing={4}
          mt={4}
        >
          <Text fontWeight="semibold">{totalCount} activities found</Text>
          <HStack>
            <Text whiteSpace="nowrap" fontWeight="bold" fontSize="md">
              Sort by:
            </Text>
            <Menu>
              <CustomMenuButton
                as={MenuButton}
                text={isApplySort || 'Recommended'}
              />
              <MenuList>
                <RadioGroup onChange={handleSort} p={6} colorScheme="teal">
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
        </Stack>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
          spacing={6}
          width="full"
          mt={4}
        >
          {tours?.map((tour) => (
            <TourCard key={tour?._id} tour={tour} />
          ))}
        </SimpleGrid>
        <Box alignSelf="center" marginY="8px">
          <Pagination pagination={pagination} pageSize={pageSize - 1} setPageSize={setPageSize} />
        </Box>
        <ChatBot/>
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