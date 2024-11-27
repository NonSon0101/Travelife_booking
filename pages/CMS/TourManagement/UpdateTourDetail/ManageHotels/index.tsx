import {
  Center,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  Text,
  chakra
} from '@chakra-ui/react'
import Dropdown from 'components/Dropdown'
import FormInput from 'components/FormInput'
import Icon from 'components/Icon'
import { useStores } from 'hooks/useStores'
import { useEffect } from 'react'
import { useFieldArray } from 'react-hook-form'
import { getOptions, getValidArray } from 'utils/common'


interface IManageHotelsProps {
  isOpen: boolean
  onClose: () => void
  methods: any
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
  const { isOpen, onClose, methods } = props
  const { hotelStore } = useStores()
  const { hotels } = hotelStore
  if (!methods) return null
  const { control, register } = methods
  const hotelsOptions = getOptions(hotels, 'name', '_id')
  const { fields, append, remove } = useFieldArray({ control, name: 'hotels' })
  console.log("hotelsOptions", hotelsOptions)

  useEffect(() => {
    hotelStore.fetchAllHotels();
  }, [])

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent top={10} borderRadius={8} marginTop={0}>
        <ModalHeader color="gray.800" fontSize="18px" fontWeight={500} lineHeight={7}>
          Manage Hotels
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody border="1px solid #E2E8F0" borderRadius={8} padding={6}>
          <FormInput name="inclusions" label="Inclusions">
            <VStack width="full" align="flex-start">
              <Dropdown
                name="hotelsValue"
                label="Hotels"
                options={hotelsOptions}
                setValue={() => {}}
              />
            </VStack>
          </FormInput>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ManageHotels
