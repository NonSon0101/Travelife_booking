"use client";
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Box, Button, Center, HStack, Img, SimpleGrid, Switch, Text, VStack, chakra } from '@chakra-ui/react'
import { createTour, updateTourDetail } from 'API/tour'
import { uploadImage, uploadTourImage } from 'API/upload'
import { IOption } from 'components/Dropdown'
import Icon from 'components/Icon'
import FormInput from 'components/FormInput'
import { useStores } from 'hooks/useStores'
import { IPriceOption } from 'interfaces/common'
import { ITour, IVirtualTour } from 'interfaces/tour'
import get from 'lodash/get'
import { observer } from 'mobx-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import NoImage from 'public/assets/images/no-image.png'
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'
import routes from 'routes'
import { convertToBase64, getOptions, getValidArray } from 'utils/common'
import { formatFormData } from 'utils/CMS/TourManagement/utils'
import ManageExclusions from './ManageExclusions'
import ManageInclusions from './ManageInclusions'
import ManagePriceOptions from './ManagePriceOptions'
import { currencyOptions, tourTypeOptions } from 'constants/common'
import ManageHotels from './ManageHotels'
import VirtualTour from './VirtualTour';
import ItinerarySetup from './ItinerarySetup';
import MapSelector from 'components/MapSelector'
import { IHotel } from 'interfaces/hotel';
import { ITransportation } from 'interfaces/transportation';
import ManageTransportations from './ManageTransportations';
const Dropdown = dynamic(() => import('components/Dropdown'), {
  ssr: false,
})

export interface IUpdateTourForm extends ITour {
  typeValue: IOption
  locationValue: IOption
  categoryValue: IOption
  currencyValue: IOption
}

export const ManageText = chakra(Text, {
  baseStyle: () => ({
    color: 'teal',
    fontSize: 'lg',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: 4,
  })
})

const UpdateTourDetail = () => {
  const { categoryStore, locationStore, tourStore } = useStores()
  const { tourDetail } = tourStore
  const { locations } = locationStore
  const { categories } = categoryStore
  const router = useRouter()
  const pathname = usePathname()
  const imagesRef = useRef<any>(null)
  const thumbnailRef = useRef<any>(null)
  const tourId = pathname?.split('/').pop() ?? ''
  const isEditMode = tourId !== 'create'
  const methods = useForm<IUpdateTourForm>()
  const { control, handleSubmit, reset, setValue } = methods
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false)
  const [isManageInclusion, setIsManageInclusion] = useState<boolean>(false)
  const [isManageExclusion, setIsManageExclusion] = useState<boolean>(false)
  const [isManageHotels, setIsManageHotels] = useState<boolean>(false)
  const [isManageTransports, setIsManageTransports] = useState<boolean>(false)
  const [isManagePriceOptions, setIsManagePriceOptions] = useState<boolean>(false)
  const [existingPriceOptions, setExistingPriceOptions] = useState<IPriceOption[]>([])
  const [existingHotels, setExistingHotels] = useState<IHotel[]>([])
  const [existingTransports, setExistingTransports] = useState<ITransportation[]>([])
  const [privateTour, setPrivateTour] = useState<boolean>(false)
  const [isMapReady, setIsMapReady] = useState<boolean>(false)
  const thumbnail = useWatch({ control, name: 'thumbnail' }) ?? ''
  const images = useWatch({ control, name: 'images' }) ?? []
  const locationOptions = getOptions(locations, 'title', '_id')
  const categoryOptions = getOptions(categories, 'name', '_id')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const { getValues } = methods

  function backToTourList() {
    router.push(routes.cms.tourManagement.value)
  }

  function deleteImages(url: string) {
    setValue('images', images.filter((image: string) => image !== url))
  }
 
  async function uploadImages(event: ChangeEvent<HTMLInputElement>) {
    setIsImageLoading(true)
    if (!event.target.files || event.target.files.length === 0) {
      return
    }
    const files = Array.from(event.target.files)
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const invalidFiles = files.filter(file => !imageTypes.includes(file.type))
    if (invalidFiles.length > 0) {
        toast.error('Only image files (JPEG, PNG, GIF, WEBP) are allowed')
        return
    }
    if (!isEditMode) {
      setImageFiles(files)
      setIsImageLoading(false)
      return;
    }
    try {
      const formData = new FormData()
      for (let i = 0; i < files?.length; i++) {
        formData.append('images', files[i])
      }
      const { imagesURL } = await uploadTourImage(tourId, formData)
      setValue('images', [...images, ...imagesURL])
    } catch (error) {
      setIsImageLoading(false)
      toast.error('Upload images failed')
    } finally {
      setIsImageLoading(false)
    }
  }

  async function deleteFile(file: File) {
    const newFiles = [...imageFiles]
    newFiles.splice(newFiles.indexOf(file), 1)
    setImageFiles(newFiles)
  }

  async function uploadThumbnail(event: ChangeEvent<HTMLInputElement>) {
    setIsImageLoading(true)
    if (!event.target.files || event.target.files.length === 0) {
      return
    }
    try {
      const formData = new FormData()
      formData.append('image', event.target.files[0])
      const imageUrl: string = await uploadImage('tour', formData)
      setValue('thumbnail', imageUrl)
    } catch (error) {
      setIsImageLoading(false)
      toast.error('Upload thumbnail failed')
    } finally {
      setIsImageLoading(false)
    }
  }

  async function onSubmit(formData: IUpdateTourForm) {
    console.log(formData);
    setIsLoading(true)

    // handle files in virtual tours
    if (formData.virtualTours && formData?.virtualTours?.length > 0) {
      await Promise.all(
        formData.virtualTours.map(async (virtualTour: IVirtualTour) => {
          if (virtualTour?.files && virtualTour?.files?.length > 0) {
            const base64Images: string[] = await Promise.all(
              virtualTour.files.map(async (file: File) => {
                const base64 = await convertToBase64(file);
                return base64;
              })
            )
            virtualTour.images = [...(virtualTour.images || []), ...base64Images];
            virtualTour.files = [];
          }
        })
      ); 
    }

    if (!isEditMode && imageFiles.length > 0) {
      const base64Images: string[] = await Promise.all(
          imageFiles.map(async (file: File) => {
            const base64 = await convertToBase64(file);
            return base64;
          })
      )
      setValue('images', [...images, ...base64Images]);
      setImageFiles([]);
    }

    const hotels = getValues('hotels') || [];
    const transports = getValues('transports') || [];
    const hotelsData = Array.isArray(hotels) 
      ? hotels.map(hotel => typeof hotel === 'string' ? hotel : hotel._id)
      : [];
    const transportsData = Array.isArray(transports) 
      ? transports.map(transport => typeof transport === 'string' ? transport : transport._id)
      : [];

    const data: ITour = formatFormData(formData, existingPriceOptions, hotelsData, transportsData)
    try {
      if (isEditMode) {
        await updateTourDetail(tourId, data)
        await tourStore.fetchTourDetail(tourId)
        toast.success('Update tour detail successfully')
      } else {
        const location = getValidArray(locations).find(
          (location) => location?._id === formData?.locationValue?.value
        )
        const startLocation = {
          type: 'Point',
          coordinates: location?.loc?.coordinates ?? [],
          description: location?.title ?? '',
          address: location?.title ?? ''
        }
        await createTour({ ...data, startLocation })
        toast.success('Create new tour successfully')
        backToTourList()
      }
    } catch (error) {
      setIsLoading(false)
      toast.error(isEditMode ? 'Update tour detail failed' : 'Create new tour failed')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (tourId && isEditMode) {
      setIsLoading(true)
      tourStore.fetchTourDetail(tourId).finally(() => {
        setIsLoading(false)
        setIsMapReady(true)
        // setIsPrivateTour(tourDetail.)
      })
    } else {
      setIsMapReady(true)
    }
    locationStore.fetchAllLocations()
    categoryStore.fetchAllCategories()
  }, [tourId])

  useEffect(() => {
    if (tourDetail?._id && isEditMode) {
      console.log('tourDetail in useEffect:', tourDetail);
      console.log('startLocation in useEffect:', tourDetail?.startLocation);
      reset({
        ...tourDetail,
        typeValue: {
          label: tourDetail?.type ?? '',
          value: tourDetail?.type ?? ''
        },
        currencyValue: {
          label: tourDetail?.currency ?? '',
          value: tourDetail?.currency ?? ''
        },
        categoryValue: {
          label: get(tourDetail?.category, 'name') ?? '',
          value: get(tourDetail?.category, '_id') ?? ''
        },
        locationValue: {
          label: get(tourDetail?.location, 'title') ?? '',
          value: get(tourDetail?.location, '_id') ?? ''
        }
      })
      const priceOptionsData: IPriceOption[] = getValidArray(tourDetail?.priceOptions).map(option => {
        return {
          title: option?.title,
          value: Number(option?.value),
          currency: option?.currency,
          participantsCategoryIdentifier: option?.participantsCategoryIdentifier
        }
      })
      const HotelsData: IHotel[] = getValidArray(tourDetail?.hotels as IHotel[]).map(option => {
        if (typeof option === 'string') {
          return {
            _id: option,
            name: ''
          }
        }
        return {
          _id: option._id,
          name: option.name
        }
      })
      const TransportsData: ITransportation[] = getValidArray(tourDetail?.transports as ITransportation[]).map(option => {
        if (typeof option === 'string') {
          return {
            _id: option,
            name: ''
          }
        }
        return {
          _id: option._id,
          name: option.name
        }
      })
      setExistingPriceOptions(priceOptionsData)
      setExistingHotels(HotelsData)
      setExistingTransports(TransportsData)
    }
  }, [tourDetail])

  return (
    <Box paddingX={{ base: 6, lg: 8 }} paddingY={6}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <HStack width="full" justify="space-between" marginBottom={6}>
            <VStack>
              <Text fontSize="lg" fontWeight={600}>
                {isEditMode ? 'Update Tour Detail' : 'Create New Tour'}
              </Text>
              <HStack display='flex' alignItems='center' width='unset'>
                <Text mb='0'>
                  Private tour?
                </Text>
                <Switch id='private-tour' isChecked={privateTour} onChange={() => setPrivateTour(!privateTour)} />
              </HStack>
            </VStack>
            <HStack spacing={4}>
              <Button background="white" borderWidth={1} borderColor="gray.300" isLoading={isLoading} onClick={backToTourList}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="teal" variant="solid" paddingX={4} isLoading={isLoading}>
                Save
              </Button>
            </HStack>
          </HStack>
          <HStack width="full" align="flex-start" spacing={8}>
            <Box width="full" background="white" padding={8} borderRadius={8} borderWidth={1} boxShadow="sm">
              <VStack width="full" align="flex-start" spacing={6}>
                <SimpleGrid width="full" maxWidth="1200px" columns={{ base: 1, md: 2 }} gap={6}>
                  <FormInput name="code" label="Code" />
                  <FormInput name="title" label="Title" />
                  <FormInput name="description" label="Description" gridColumn="span 2" />
                  <FormInput name="summary" label="Summary" />
                  <Controller
                    name="typeValue"
                    control={control}
                    defaultValue={undefined}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        label="Type"
                        options={tourTypeOptions}
                        placeholder="Select a type"
                        setValue={setValue}
                      />
                    )}
                  />
                  <Controller
                    name="currencyValue"
                    control={control}
                    defaultValue={undefined}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        label="Currency"
                        options={currencyOptions}
                        placeholder="Select Currency"
                        setValue={setValue}
                      />
                    )}
                  />
                  <Controller
                    name="categoryValue"
                    control={control}
                    defaultValue={undefined}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        label="Category"
                        options={categoryOptions}
                        placeholder="Select a category"
                        setValue={setValue}
                      />
                    )}
                  />
                  <Controller
                    name="locationValue"
                    control={control}
                    defaultValue={undefined}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        label="Location"
                        options={locationOptions}
                        placeholder="Select a location"
                        setValue={setValue}
                      />
                    )}
                  />
                  {/* <FormInput name="interest" label="Interest" /> */}
                  {/* <FormInput name="details" label="Details" /> */}
                  <FormInput name="regularPrice" label="Regular Price" type="number" min={1} />
                  <FormInput name="discountPrice" label="Discount Price" type="number" min={1} />
                  <FormInput name="discountPercentage" label="Discount Percentage" type="number" min={1} />
                  <FormInput name="duration" label="Duration" type="number" min={0} />
                  <FormInput name="priceOptions" label="Price Options">
                    <ManageText onClick={() => setIsManagePriceOptions(true)}>
                      Manage Price Options 
                    </ManageText>
                  </FormInput>
                  <FormInput name="inclusions" label="Inclusions">
                    <ManageText onClick={() => setIsManageInclusion(true)}>
                      Manage Inclusions
                    </ManageText>
                  </FormInput>
                  <FormInput name="exclusions" label="Exclusions">
                    <ManageText onClick={() => setIsManageExclusion(true)}>
                      Manage Exclusions
                    </ManageText>
                  </FormInput>
                  {privateTour &&
                    <>
                      <FormInput name="transports" label="Transports">
                        <ManageText onClick={() => setIsManageTransports(true)}>
                          Manage Transports
                        </ManageText>
                      </FormInput>
                      <FormInput name="hotels" label="Hotels">
                        <ManageText onClick={() => setIsManageHotels(true)}>
                          Manage Hotels
                        </ManageText>
                      </FormInput>
                    </>
                  }
                </SimpleGrid>
                {(
                  <VStack width="full" align="flex-start" spacing={0}>
                    <Text color="gray.700" fontWeight={500} lineHeight={6} marginBottom={2}>
                      Tour Photo Gallery
                    </Text>
                    <SimpleGrid width="full" columns={{ base: 1, md: 4 }} gap={4}>
                      {getValidArray(images).map((image: string) => (
                        <Center key={image} position="relative">
                          <Button
                            boxSize={10}
                            padding={0}
                            borderRadius="50%"
                            position="absolute"
                            zIndex={9}
                            top={2}
                            right={2}
                            onClick={() => deleteImages(image)}
                          >
                            <Icon iconName="trash.svg" size={32} />
                          </Button>
                          <Img key={image} width="full" height="130px" src={image} borderRadius={8} />
                        </Center>
                      ))}
                      {getValidArray(imageFiles).map((file: File) => (
                        <Center key={file.name} position="relative">
                          <Button
                            boxSize={10}
                            padding={0}
                            borderRadius="50%"
                            position="absolute"
                            zIndex={9}
                            top={2}
                            right={2}
                            onClick={() => deleteFile(file)}
                          >
                            <Icon iconName="trash.svg" size={32} />
                          </Button>
                          <Img key={file.name} width="full" height="130px" src={URL.createObjectURL(file)} borderRadius={8} />
                        </Center>
                      ))}
                    </SimpleGrid>
                    <Button
                      marginTop={4}
                      background="gray.300"
                      isLoading={isImageLoading}
                      onClick={() => imagesRef?.current?.click()}
                    >
                      Upload Tour Images
                    </Button>
                    <input type="file" ref={imagesRef} onChange={uploadImages} style={{ display: 'none' }} multiple />
                  </VStack>
                )}
              </VStack>
            </Box>
            <VStack width="full" maxWidth={300} spacing={8}>
              <VStack
                width="full"
                align="flex-start"
                background="white"
                padding={8}
                borderRadius={8}
                borderWidth={1}
                boxShadow="sm"
                spacing={4}
              >
                <Text color="gray.700" fontWeight={500} lineHeight={6}>
                  Thumbnail
                </Text>
                {thumbnail ? (
                  <Img width="full" height="180px" src={thumbnail} borderRadius={8} />
                ) : (
                  <Image width={300} height={180} alt="thumbnail" src={NoImage} />
                )}
                <Button
                  width="full"
                  borderWidth={1}
                  background="white"
                  isLoading={isImageLoading}
                  onClick={() => thumbnailRef?.current?.click()}
                >
                  Choose Thumbnail
                </Button>
                <input type="file" ref={thumbnailRef} onChange={uploadThumbnail} style={{ display: 'none' }} />
              </VStack>
              <VStack
                width="full"
                height={500}
                align="flex-start"
                background="white"
                padding={8}
                borderRadius={8}
                borderWidth={1}
                boxShadow="sm"
                spacing={4}
              >
                <Text color="gray.700" fontWeight={500} lineHeight={6}>
                  Start Location
                </Text>
                <Box flex={1} width="full">
                  {isMapReady && (
                    <MapSelector 
                      onLocationSelect={(address, coordinates) => {
                        setValue('startLocation', {
                          type: 'Point',
                          coordinates: coordinates,
                          description: address,
                          address: address
                        });
                      }}
                      initialLocation={tourDetail?.startLocation ? {
                        address: tourDetail.startLocation.address,
                        coordinates: tourDetail.startLocation.coordinates as [number, number]
                      } : undefined}
                    />
                  )}
                </Box>
              </VStack>
            </VStack>
          </HStack>
          {(
            <Box width="full" background="white" padding={8} borderRadius={8} borderWidth={1} boxShadow="sm" marginTop={8}>
              <VStack width="full" align="flex-start" spacing={6}>
                <VirtualTour
                  methods={methods}
                />
              </VStack>
            </Box>
          )}
          <Box width="full" background="white" padding={8} borderRadius={8} borderWidth={1} boxShadow="sm" marginTop={8}>
              <VStack width="full" align="flex-start" spacing={6}>
                <ItinerarySetup methods={methods} />
              </VStack>
          </Box>
          <ManagePriceOptions
            tourId={tourId}
            methods={methods}
            isOpen={isManagePriceOptions}
            onClose={() => setIsManagePriceOptions(false)}
            existingOptions={existingPriceOptions}
            setExistingOptions={setExistingPriceOptions}
          />
          <ManageHotels 
            isOpen={isManageHotels} 
            onClose={() => setIsManageHotels(false)} 
            methods={methods}
            existingOptions={existingHotels}
            setExistingOptions={setExistingHotels}
          />
          <ManageTransportations
            isOpen={isManageTransports} 
            onClose={() => setIsManageTransports(false)} 
            methods={methods}
            existingOptions={existingTransports}
            setExistingOptions={setExistingTransports}
          />
          <ManageInclusions methods={methods} isOpen={isManageInclusion} onClose={() => setIsManageInclusion(false)} />
          <ManageExclusions methods={methods} isOpen={isManageExclusion} onClose={() => setIsManageExclusion(false)} />
        </form>
      </FormProvider>
    </Box>
  )
}

export default observer(UpdateTourDetail)
