import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  Text,
  chakra,
  Center,
  HStack,
  Box
} from '@chakra-ui/react'
import Dropdown from 'components/Dropdown'
import { useStores } from 'hooks/useStores'
import { IHotel } from 'interfaces/hotel'
import { useEffect } from 'react'
import Icon from 'components/Icon';
import { getOptions, getValidArray } from 'utils/common'
import { coordinates } from '@maptiler/sdk'


interface IManageHotelsProps {
  isOpen: boolean
  onClose: () => void
  methods: any
  existingOptions: IHotel[]
  setExistingOptions: (options: IHotel[]) => void
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

const ManageHotels = (props: IManageHotelsProps) => {
  const { isOpen, onClose, methods, existingOptions, setExistingOptions } = props;
  const { getValues, setValue } = methods || { getValues: () => { }, setValue: () => { } };
  const { hotelStore } = useStores()
  const { hotels } = hotelStore
  if (!methods) return null
  const hotelsOptions = getOptions(hotels, 'name', '_id')

  function handleAddNewHotel(): void {
    const newHotelId = getValues('newHotelsTitle.value');
    const newHotelName = getValues('newHotelsTitle.label');
    const newHotelCoordinates = getValues('newHotelsTitle.coordinates')
    const newHotel = { _id: newHotelId, name: newHotelName, coordinates: newHotelCoordinates}

    // Add to existingOptions for display
    setExistingOptions([...existingOptions, newHotel]);
    
    // Add only ID to form data
    const hotels = getValues('hotels') || [];
    const currentHotels = Array.isArray(hotels) 
      ? hotels.map(hotel => typeof hotel === 'string' ? hotel : hotel._id)
      : [];
    setValue('hotels', [...currentHotels, newHotelId]);
  }

  function handleDeleteHotelOption(index: number): void {
    const newOptions = existingOptions.filter((_, i) => i !== index)
    setExistingOptions(newOptions);
    
    // Remove ID from form data
    const hotels = getValues('hotels') || [];
    const currentHotels = Array.isArray(hotels) 
      ? hotels.map(hotel => typeof hotel === 'string' ? hotel : hotel._id)
      : [];
    const hotelToRemove = existingOptions[index];
    const newHotels = currentHotels.filter(id => id !== hotelToRemove._id);
    setValue('hotels', newHotels);
  }

  useEffect(() => {
    hotelStore.fetchAllHotels();
  }, [])

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent top={10} borderRadius="xl" overflow="hidden" boxShadow="lg">
        <ModalHeader color="gray.800" fontSize="20px" fontWeight="bold" px={6} pt={6}>
          Manage Hotels
        </ModalHeader>
        <ModalCloseButton top={4} right={4} />
        <ModalBody px={6} pb={6}>
          <VStack width="full" align="stretch" spacing={4}>
            {/* Dropdown Select */}
            <Box>
              <Dropdown
                name="newHotelsTitle"
                label="Select Hotel"
                options={hotelsOptions}
                setValue={setValue}
              />
            </Box>

            {/* Existing Options List */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={2}>
                Selected Hotels
              </Text>
              <VStack spacing={3} align="stretch">
                {getValidArray(existingOptions).map((option, index) => (
                  <HStack
                    key={index}
                    justify="space-between"
                    bg="gray.50"
                    p={3}
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{ bg: "gray.100" }}
                  >
                    <Text fontWeight={500} color="gray.700" noOfLines={1}>
                      {option?.name}
                    </Text>
                    <Center
                      cursor="pointer"
                      onClick={() => handleDeleteHotelOption(index)}
                      _hover={{ color: "red.500", transform: "scale(1.05)" }}
                      transition="all 0.2s"
                    >
                      <Icon iconName="trash.svg" size={24} />
                    </Center>
                  </HStack>
                ))}
              </VStack>
            </Box>

            {/* Add Hotel Button */}
            <ManageText
              onClick={handleAddNewHotel}
              marginTop={4}
              fontSize="sm"
              color="blue.500"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
            >
              + Add New Hotel
            </ManageText>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>

  )
}

export default ManageHotels
