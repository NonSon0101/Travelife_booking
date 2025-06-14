"use client";
import { Box, HStack, VStack, Text, Image, FormControl, Button, FormLabel, Input, FormErrorMessage, SimpleGrid, Skeleton, Avatar } from "@chakra-ui/react";
import { toast } from 'react-toastify';
import { get, truncate } from "lodash";
import { FaUser } from "react-icons/fa";
import { useStores } from "hooks";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { PLATFORM } from "enums/common";
import { IUser } from "interfaces/user";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";


const ProfilePage = () => {
  const { handleSubmit, register, reset, formState: { errors, isSubmitting } } = useForm();
  const { authStore, userStore } = useStores();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
  const { user } = authStore;

  useEffect(() => {
    const fetchData = async () => {
      setIsUserLoading(true);
      await authStore.getMyUser(PLATFORM.WEBSITE);
      setIsUserLoading(false);
    };
    fetchData();
  }, []);


  useEffect(() => {
    reset({
      ...user,
      dateOfBirth: dayjs(user?.dateOfBirth).format('YYYY-MM-DD'),
      dateOfExpirationPassport: dayjs(user?.dateOfExpirationPassport).format('YYYY-MM-DD'),
    })
  }, [user])

  const onSubmit = async (data: any): Promise<void> => {
    try {
      setIsLoading(true)
      const userInfo: IUser = {
        fullname: data?.fullname,
        phone: data?.phone,
        email: data?.email,
        dateOfBirth: dayjs(data?.dateOfBirth).toDate(),
        gender: data?.gender,
        address: data?.address,
        passport: data?.passport,
        dateOfExpirationPassport: dayjs(data?.dateOfExpirationPassport).toDate()
      }
      const userId = user._id ?? ''
      await userStore.updateUser(userInfo, userId, PLATFORM.WEBSITE)
      toast.success("Update user successfully")
      setIsLoading(false)

    } catch (error) {
      setIsLoading(false)
      console.error('errorMessage', error)
      const errorMessage: string = get(error, 'data.error.message', 'Sign up failed') || JSON.stringify(error)
    }
  }

  return (
    <HStack
      maxW="1300px"
      w="full"
      minH="700px"
      h="full"
      mx="auto"
      align="flex-start"
      mt={{ base: '20px', md: '40px' }}
      spacing={{ base: 0, md: 10 }}
      flexDirection={{ base: 'column', md: 'row' }}
      px={{ base: 4, md: 0 }}
    >
      <VStack align="flex-start" spacing={0} flex={1} w="full">
        <Box w="full" alignItems="center" bg="#1F5855" px="12px" py="30px" borderTopRadius="2px" color="#fff">
          <HStack spacing={4}>
            <Skeleton isLoaded={!isUserLoading} borderRadius="4px">
              <Avatar
                w={{ base: '70px', md: '90px' }}
                borderRadius="4px"
                name={user?.fullname}
                src={user?.profilePicture}
              />
            </Skeleton>

            <VStack align="flex-start" spacing={1}>
              <Skeleton isLoaded={!isUserLoading}>
                <Text fontWeight="bold" fontSize={{ base: 'md', md: 'lg' }}>{user.username}</Text>
              </Skeleton>
              <Skeleton isLoaded={!isUserLoading}>
                <Text fontSize={{ base: 'sm', md: 'md' }}>{truncate(user.email)}</Text>
              </Skeleton>
            </VStack>
          </HStack>
        </Box>


        <HStack
          w="full"
          border="2px solid #ccc"
          py="15px"
          px="12px"
          fontWeight="bold"
        >
          <FaUser />
          <Text>Profile</Text>
        </HStack>
      </VStack>

      <Box
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        flex={3}
        w="full"
        bg="#fff"
        p={{ base: 4, md: 8 }}
        borderRadius="12px"
        border="1px solid teal"
        boxShadow="5px 10px rgba(0, 0, 0, 0.1)"
      >
        <SimpleGrid w="full" columns={{ base: 1, md: 2 }} spacing={8}>
          <Skeleton isLoaded={!isUserLoading}>
            <FormControl isInvalid={!!errors.fullname}>
              <FormLabel htmlFor="fullname">Full name</FormLabel>
              <Input
                id="fullname"
                bg="#fff"
                placeholder="Full name"
                {...register('fullname', { required: 'This is required' })}
              />
              <FormErrorMessage>{errors.fullname?.message as string}</FormErrorMessage>
            </FormControl>
          </Skeleton>

          <Skeleton isLoaded={!isUserLoading}>
            <FormControl isInvalid={!!errors.phone}>
              <FormLabel htmlFor="phone">Phone number</FormLabel>
              <Input
                id="phone"
                bg="#fff"
                placeholder="Phone number"
                {...register('phone', {
                  required: 'This is required',
                  minLength: { value: 10, message: 'Minimum length should be 10' },
                })}
              />
              <FormErrorMessage>{errors.phone?.message as string}</FormErrorMessage>
            </FormControl>
          </Skeleton>

          <Skeleton isLoaded={!isUserLoading}>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                bg="#fff"
                placeholder="Email"
                {...register('email', { required: 'This is required' })}
              />
              <FormErrorMessage>{errors.email?.message as string}</FormErrorMessage>
            </FormControl>
          </Skeleton>

          <Skeleton isLoaded={!isUserLoading}>
            <FormControl isInvalid={!!errors.dateOfBirth}>
              <FormLabel htmlFor="dateOfBirth">Date of birth</FormLabel>
              <Input
                id="dateOfBirth"
                bg="#fff"
                placeholder="Date of birth"
                {...register('dateOfBirth', { required: 'This is required' })}
              />
              <FormErrorMessage>{errors.dateOfBirth?.message as string}</FormErrorMessage>
            </FormControl>
          </Skeleton>

          <Skeleton isLoaded={!isUserLoading}>
            <FormControl isInvalid={!!errors.gender}>
              <FormLabel htmlFor="gender">Gender</FormLabel>
              <Input
                id="gender"
                bg="#fff"
                placeholder="Gender"
                {...register('gender', { required: 'This is required' })}
              />
              <FormErrorMessage>{errors.gender?.message as string}</FormErrorMessage>
            </FormControl>
          </Skeleton>

          <Skeleton isLoaded={!isUserLoading}>
            <FormControl isInvalid={!!errors.address}>
              <FormLabel htmlFor="address">Address</FormLabel>
              <Input
                id="address"
                bg="#fff"
                placeholder="Address"
                {...register('address', {
                  required: 'This is required',
                  minLength: { value: 10, message: 'Minimum length should be 10' },
                })}
              />
              <FormErrorMessage>{errors.address?.message as string}</FormErrorMessage>
            </FormControl>
          </Skeleton>

          <Skeleton isLoaded={!isUserLoading}>
            <FormControl isInvalid={!!errors.passport}>
              <FormLabel htmlFor="passport">Passport</FormLabel>
              <Input
                id="passport"
                bg="#fff"
                placeholder="Passport"
                {...register('passport', {
                  required: 'This is required',
                  minLength: { value: 10, message: 'Minimum length should be 10' },
                })}
              />
              <FormErrorMessage>{errors.passport?.message as string}</FormErrorMessage>
            </FormControl>
          </Skeleton>

          <Skeleton isLoaded={!isUserLoading}>
            <FormControl isInvalid={!!errors.dateOfExpirationPassport}>
              <FormLabel htmlFor="dateOfExpirationPassport">Date of expiration passport</FormLabel>
              <Input
                id="dateOfExpirationPassport"
                bg="#fff"
                placeholder="Date of expiration passport"
                {...register('dateOfExpirationPassport', {
                  required: 'This is required',
                  minLength: { value: 10, message: 'Minimum length should be 10' },
                })}
              />
              <FormErrorMessage>{errors.dateOfExpirationPassport?.message as string}</FormErrorMessage>
            </FormControl>
          </Skeleton>
        </SimpleGrid>

        <Button
          mt={6}
          colorScheme="teal"
          type="submit"
          isLoading={isLoading}
          w={{ base: 'full', sm: 'auto' }}
        >
          Save
        </Button>
      </Box>
    </HStack>

  )
}

export default observer(ProfilePage)
