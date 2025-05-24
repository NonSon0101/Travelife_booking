"use client";
import React, { useEffect, useState } from 'react';
import {
  Button,
  Center,
  Divider,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  Box,
  Checkbox,
  FormLabel
} from '@chakra-ui/react';
import FormInput from 'components/FormInput';
import { tourPriceOptions } from 'constants/common';
import { getValidArray } from 'utils/common';
import { IPriceOption } from 'interfaces/common';
import { toast } from 'react-toastify';
import { updateTourDetail } from 'API/tour';
import Icon from 'components/Icon';
import Dropdown from 'components/Dropdown';

interface IManagePriceOptionsProps {
  isOpen: boolean
  onClose: () => void
  tourId: string
  methods: any
  existingOptions: IPriceOption[]
  setExistingOptions: (options: IPriceOption[]) => void
};

const ManagePriceOptions = (props: IManagePriceOptionsProps) => {
  const { isOpen, onClose, tourId, methods, existingOptions, setExistingOptions } = props;
  const { getValues, setValue } = methods || { getValues: () => { }, setValue: () => { } };
  const [isPrivateOption, setIsPrivateOption] = useState<boolean>(false);

  function handleAddNewPriceOption(): void {
    const newTitle = getValues('newPriceOptionTitle.value');
    const newValue = getValues('newPriceOptionValue');
    const currency = getValues('currencyValue.value');
    const newOption = { title: newTitle, value: Number(newValue), currency, ...(isPrivateOption && { participantsCategoryIdentifier: "Private" }) }
    const isDuplicate = existingOptions.some(option => option.title === newOption.title && option.participantsCategoryIdentifier === newOption.participantsCategoryIdentifier);
    if (!currency) {
      toast.error('Please choose currency!');
      return;
    }
    if (!newTitle || !newValue) {
      toast.error('Please fill in all fields');
      return;
    }
    if (isDuplicate) {
      toast.error('Price options already exists');
      return;
    }
    setExistingOptions([...existingOptions, newOption]);
    setValue('newPriceOptionTitle', '');
    setValue('newPriceOptionValue', '');
  }

  function handleDeletePriceOption(index: number): void {
    const newOptions = existingOptions.filter((_, i) => i !== index)
    setExistingOptions(newOptions);
  }

  function handlePrivateOption() {
    setIsPrivateOption(!isPrivateOption);
  }

  async function onSubmit(): Promise<void> {
    const data: IPriceOption[] = getValues('priceOptions');
    const priceOptionsData: IPriceOption[] = getValidArray(data).map(option => {
      return {
        title: option?.title,
        value: Number(option?.value),
        currency: option?.currency
      }
    });
    await updateTourDetail(tourId, { priceOptions: priceOptionsData });
    onClose();
  }

  useEffect(() => {
    if (isOpen && methods) {
      setValue('newPriceOptionTitle', '');
      setValue('newPriceOptionValue', '');
    }
  }, [isOpen, methods]);

  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent top={10} borderRadius={8} marginTop={0}>
        <ModalHeader color="gray.800" fontSize="18px" fontWeight={500} lineHeight={7}>
          Manage Price Options
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody border="1px solid #E2E8F0" padding={6}>
          <VStack width="full" align="flex-start" spacing={4}>
            <Dropdown
              name="newPriceOptionTitle"
              label="Price Option Title"
              options={tourPriceOptions}
              setValue={setValue}
            />
            <FormInput name="newPriceOptionValue" label="Price Option Value" type="number" min={0} />
            <Checkbox isChecked={isPrivateOption} onChange={handlePrivateOption}>Is Private Option</Checkbox>
            <Button width="full" colorScheme="teal" onClick={handleAddNewPriceOption}>
              Add New Price Option
            </Button>
          </VStack>
          <Divider color="gray.300" borderWidth={1} marginY={6} />
          <FormInput name="priceOptions" label="Public Price Options">
            <VStack width="full" align="flex-start">
              <VStack width="full" spacing={8} align="flex-start">
                {/* Public Price Options */}
                <VStack spacing={4} width="full">
                  {getValidArray(existingOptions)
                    .filter(option => !option.participantsCategoryIdentifier)
                    .map((option, index) => (
                      <HStack key={`public-${index}`} width="full" justify="space-between">
                        <HStack spacing={6} marginLeft={10}>
                          <Text width="200px" fontWeight={500}>{option?.title}</Text>
                          <Text fontWeight={500}>{`${option?.value} ${option?.currency}`}</Text>
                        </HStack>
                        <Center minWidth={8} cursor="pointer">
                          <Icon iconName="trash.svg" size={32} onClick={() => handleDeletePriceOption(index)} />
                        </Center>
                      </HStack>
                    ))}
                </VStack>

                {/* Private Price Options */}
                {Array.isArray(existingOptions) && existingOptions.some(option => option.participantsCategoryIdentifier === 'Private') &&
                  <Box width="full">
                    <FormLabel color="gray.700" mb={4}>
                      Private Price Options
                    </FormLabel>
                    <VStack spacing={4} width="full">
                      {getValidArray(existingOptions)
                        .filter(option => option.participantsCategoryIdentifier)
                        .map((option, index) => (
                          <HStack key={`private-${index}`} width="full" justify="space-between">
                            <HStack spacing={6} marginLeft={10}>
                              <Text width="200px" fontWeight={500}>{option?.title}</Text>
                              <Text fontWeight={500}>{`${option?.value} ${option?.currency}`}</Text>
                            </HStack>
                            <Center minWidth={8} cursor="pointer">
                              <Icon iconName="trash.svg" size={32} onClick={() => handleDeletePriceOption(index)} />
                            </Center>
                          </HStack>
                        ))}
                    </VStack>
                  </Box>
                }
              </VStack>

            </VStack>
          </FormInput>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
            lineHeight={6}
            border="1px solid #E2E8F0"
            border-radius="6px"
            paddingY={2}
            onClick={onClose}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ManagePriceOptions
