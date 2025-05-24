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
import { useEffect } from 'react'
import Icon from 'components/Icon';
import { getOptions, getValidArray } from 'utils/common'
import { ITransportation } from 'interfaces/transportation'


interface IManageTransportationProps {
  isOpen: boolean
  onClose: () => void
  methods: any
  existingOptions: ITransportation[]
  setExistingOptions: (options: ITransportation[]) => void
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

const ManageHotels = (props: IManageTransportationProps) => {
  const { isOpen, onClose, methods, existingOptions, setExistingOptions } = props;
  const { getValues, setValue } = methods || { getValues: () => { }, setValue: () => { } };
  const { transportationStore } = useStores()
  const { transportations } = transportationStore
  if (!methods) return null
  const TransportationsOptions = getOptions(transportations, 'name', '_id')
  console.log('TransportationsOptions', TransportationsOptions)

  function handleAddNewHotel(): void {
    const newTransportId = getValues('newTransportationTitle.value');
    const newTransportName = getValues('newTransportationTitle.label');
    const newHotel = { _id: newTransportId, name: newTransportName }

    const transports = getValues('transports') || [];
    const currentTransports = Array.isArray(transports) 
      ? transports.map(transport => typeof transport === 'string' ? transport : transport._id)
      : [];
    setValue('transports', [...currentTransports, newTransportId]);
    setExistingOptions([...existingOptions, newHotel]);
  }

  function handleDeleteTransportOption(index: number): void {
    const newOptions = existingOptions.filter((_, i) => i !== index)
    setExistingOptions(newOptions);

    const transports = getValues('transports') || [];
    const currentTransports = Array.isArray(transports) 
      ? transports.map(transport => typeof transport === 'string' ? transport : transport._id)
      : [];
    const transportToRemove = existingOptions[index];
    const newTransports = currentTransports.filter(id => id !== transportToRemove._id);
    setValue('transports', newTransports);
  }

  useEffect(() => {
    transportationStore.fetchAllTransportations();
  }, [])

  console.log('existingOptions', existingOptions);
  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent top={10} borderRadius="xl" overflow="hidden" boxShadow="lg">
        <ModalHeader color="gray.800" fontSize="20px" fontWeight="bold" px={6} pt={6}>
          Manage Transportation
        </ModalHeader>
        <ModalCloseButton top={4} right={4} />
        <ModalBody px={6} pb={6}>
          <VStack width="full" align="stretch" spacing={4}>
            {/* Dropdown Select */}
            <Box>
              <Dropdown
                name="newTransportationTitle"
                label="Select Transportation"
                options={TransportationsOptions}
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
                      onClick={() => handleDeleteTransportOption(index)}
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
              + Add New Transportation
            </ManageText>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>

  )
}
export default ManageHotels
