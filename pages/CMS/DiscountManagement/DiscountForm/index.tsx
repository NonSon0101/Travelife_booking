import React, { createElement, forwardRef, useEffect, useState } from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid
} from '@chakra-ui/react'
import { createDiscount, updateDiscount } from 'API/discount'
import DateInput from 'components/DateInput'
import DateTimeInput from 'components/DateTimeInput'
import Dropdown, { IOption } from 'components/Dropdown'
import FormInput from 'components/FormInput'
import { discountAppliesToOptions, discountTypeOptions } from 'constants/common'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { EDiscountAppliesTo } from 'enums/discount'
import { useStores } from 'hooks/useStores'
import { IDiscount } from 'interfaces/discount'
import { observer } from 'mobx-react'
import DatePicker from 'react-datepicker'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'
import { getValidArray } from 'utils/common'
import { ITour } from 'interfaces/tour'
import { IUser } from 'interfaces/user'

dayjs.extend(utc)
dayjs.extend(timezone)

interface IDiscountForm {
  name: string
  code: string
  value: number
  type: string
  minOrder: number
  appliesTo: string
  tours: string[]
  users: string[]
  startDate: Date
  endDate: Date
  scheduleAt: Date
  typeValue: IOption
  appliesToValue: IOption
  tourValue: IOption
  applyUsers: IOption[]
}

interface IDiscountFormProps {
  isOpen: boolean
  onClose: () => void
  discountId: string
}

const DiscountForm = (props: IDiscountFormProps) => {
  const { discountStore, tourStore, userStore } = useStores()
  const { discountDetail } = discountStore
  const { isOpen, onClose, discountId } = props
  const [tours, setTours] = useState<ITour[]>([])
  const [users, setUsers] = useState<IUser[]>([])
  const [isDataReady, setIsDataReady] = useState(false)
  const methods = useForm<IDiscountForm>()
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    register,
    reset,
    setValue
  } = methods
  const startDate: Date = dayjs(useWatch({ control, name: 'startDate' }) || new Date()).toDate()
  const endDate: Date = dayjs(useWatch({ control, name: 'endDate' }) || new Date()).toDate()
  const appliesToValue = useWatch({ control, name: 'appliesToValue' })
  const scheduleAt = useWatch({ control, name: 'scheduleAt' })
  const tourOptions = getValidArray(tours).map(tour => ({ label: tour?.title ?? '', value: tour?._id ?? '' }))
  const userOptions = getValidArray(users).map(user => ({ label: user?.email ?? '', value: user?._id ?? '' }))
  const isSpecific = appliesToValue?.value === EDiscountAppliesTo.SPECIFIC

  async function fetchTours() {
    await tourStore.fetchAllActiveTours()
    setTours(tourStore.tours)
  }

  async function fetchUsers() {
    await userStore.fetchAllActiveUsers()
    setUsers(userStore.users)
  }

  async function fetchData() {
    if (discountId) {
      await discountStore.fetchDiscountDetail(discountId)
    }
    await fetchTours()
    await fetchUsers()
    setIsDataReady(true)
  }

  function handleOnClose(): void {
    reset()
    onClose()
  }

  async function onSubmit(data: IDiscountForm): Promise<void> {
    const discount = {
      name: data?.name,
      code: data?.code,
      value: data?.value,
      type: data?.typeValue?.value,
      minOrder: data?.minOrder,
      appliesTo: data?.appliesToValue?.value,
      tours: isSpecific ? [data?.tourValue?.value] : undefined,
      applyUsers: data?.applyUsers?.map(user => user?.value) ?? [],
      startDate: dayjs(data?.startDate).toDate(),
      endDate: dayjs(data?.endDate).toDate(),
      scheduleAt: dayjs(data?.scheduleAt).utc().toDate(),
    }
    try {
      if (discountId) {
        await updateDiscount(discountId, discount)
      } else {
        await createDiscount(discount)
      }
      await discountStore.fetchAllDiscounts()
      onClose()
      toast.success('Update discount successfully')
    } catch (error) {
      onClose()
      toast.error('Update discount failed')
    }
  }

  useEffect(() => {
    if (isOpen) {
      setIsDataReady(false)
      fetchData()
    }
  }, [isOpen, discountId])

  useEffect(() => {
    if (isOpen && !discountId) {
      reset({})
    }
  }, [isOpen, discountId])

  useEffect(() => {
    if (isDataReady && discountDetail && isOpen && discountId) {
      const formData = {
        ...discountDetail,
        tourValue: tourOptions.find(option => option?.value === discountDetail?.tours?.[0]),
        applyUsers: userOptions.filter(option => discountDetail?.applyUsers?.includes(option?.value)),
        typeValue: discountTypeOptions.find(option => option?.value === discountDetail?.type),
        appliesToValue: discountAppliesToOptions.find(option => option?.value === discountDetail?.appliesTo),
        scheduleAt: discountDetail?.scheduleAt ? dayjs.utc(discountDetail.scheduleAt).toDate() : new Date()
      }
      reset(formData)
    }
  }, [isDataReady, discountDetail, discountId])

  return (
    <Modal size="xl" isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent borderRadius={8}>
        <ModalHeader color="gray.800" fontSize="18px" fontWeight={500} lineHeight={7}>
          {discountId ? 'Update Discount Detail' : 'Create New Discount'}
        </ModalHeader>
        <ModalCloseButton />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody border="1px solid #E2E8F0" padding={6}>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                <FormInput name="startDate" label="Start Date">
                  <DatePicker
                    {...register('startDate')}
                    selected={startDate}
                    dateFormat="MM/dd/yyyy"
                    onChange={(date: Date) => setValue('startDate', dayjs(date).toDate(), { shouldDirty: true })}
                    customInput={<DateInput />}
                  />
                </FormInput>
                <FormInput name="endDate" label="End Date">
                  <DatePicker
                    {...register('endDate')}
                    selected={endDate}
                    dateFormat="MM/dd/yyyy"
                    onChange={(date: Date) => setValue('endDate', dayjs(date).toDate(), { shouldDirty: true })}
                    customInput={<DateInput />}
                  />
                </FormInput>
                <FormInput name="scheduleAt" label="Schedule At">
                  <DatePicker
                    {...register('scheduleAt')}
                    selected={scheduleAt ? new Date(scheduleAt) : new Date()}
                    dateFormat="MM/dd/yyyy HH:mm"
                    // showTimeSelect
                    // timeFormat="HH:mm"
                    // timeIntervals={1}
                    onChange={(date: Date) => {
                      const dateWithZeroSeconds = dayjs(date).second(0).toDate()
                      setValue('scheduleAt', dateWithZeroSeconds, { shouldDirty: true })
                    }}
                    showTimeInput={true}
                    customInput={<DateTimeInput />}
                  />
                </FormInput>
                <FormInput name="code" label="Code" placeholder="Enter Code" />
                <FormInput name="name" label="Name" placeholder="Enter Name" />
                <FormInput name="value" label="Value" placeholder="Enter Value" />
                <Dropdown
                  name="typeValue"
                  label="Type"
                  options={discountTypeOptions}
                  setValue={setValue}
                />
                <FormInput name="minOrder" label="Min Order" placeholder="Enter Min Order" />
                <Dropdown
                  name="appliesToValue"
                  label="Applies To"
                  options={discountAppliesToOptions}
                  setValue={setValue}
                />
                <Dropdown
                  name="applyUsers"
                  label="Applies To Users"
                  options={userOptions}
                  setValue={setValue}
                  isMulti={true}
                  isClearable={true}
                />
                {isSpecific && (
                  <Dropdown
                    name="tourValue"
                    label="Applies To Tour"
                    options={tourOptions}
                    setValue={setValue}
                    isRequired={true}
                  />
                )}
              </SimpleGrid>
            </ModalBody>
            <ModalFooter>
              <Button
                color="gray.700"
                background="white"
                lineHeight={6}
                border="1px solid #E2E8F0"
                border-radius="6px"
                paddingY={2}
                marginRight={4}
                onClick={handleOnClose}
                isLoading={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="teal"
                border-radius="6px"
                lineHeight={6}
                paddingY={2}
                isLoading={isSubmitting}
              >
                Save
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  )
}

export default observer(DiscountForm)

