import { HStack, Image, Text } from "@chakra-ui/react";
import { useState } from "react";


interface IPrivateOptions {
  index?: number
  name?: string
  image?: string
}

const PrivateOptions = (props: IPrivateOptions) => {
  const {index, name, image} = props

  return (
    <HStack justifyContent="space-between" width='full' padding='8px' gap={4}>
      <Image
        key={index}
        width={{ base: '70px' }}
        height={{ base: '70px' }}
        position="relative"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        borderRadius='12px'
        backgroundImage={`url(${image})`}
      />
      <Text textAlign='start'>{name}</Text>
    </HStack>
  );
}

export default PrivateOptions