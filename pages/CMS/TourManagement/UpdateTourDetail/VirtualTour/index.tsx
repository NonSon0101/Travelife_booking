"use client";

import { Button, Center, FormControl, FormLabel, HStack, Img, Input, Select, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import Icon from "components/Icon";
import { ChangeEvent, useRef, useState, useEffect } from "react";
import { useWatch } from "react-hook-form";
import { toast } from 'react-toastify';
import { getValidArray } from 'utils/common';
import { IVirtualTour } from "interfaces/tour";
import { m } from "framer-motion";

interface IVirtualTourProps {
    methods: any;
}

const VirtualTour = (props: IVirtualTourProps) => {
    const { methods } = props;
    if (!methods) return null;
    const { control, setValue, getValues } = methods;
    const [isImageLoading, setIsImageLoading] = useState<boolean>(false)
    const imagesRef = useRef<any>(null)
    const [virtualTours, setVirtualTours] = useState<Array<IVirtualTour>>([])
    useEffect(() => {
        console.log(methods)
        const initialTours = getValues('virtualTours') ?? []
        setVirtualTours(initialTours);
    }, [getValues]);


    function deleteImages(url: string, pageIndex: number) {
        const newVirtualTours = [...virtualTours]
        newVirtualTours[pageIndex].images = newVirtualTours[pageIndex].images.filter(image => image !== url)
        setVirtualTours(newVirtualTours)
        setValue('virtualTours', newVirtualTours)
    }

    function deleteFile(fileIndex: number, pageIndex: number) {
        const newVirtualTours = [...virtualTours]
        newVirtualTours[pageIndex].files = newVirtualTours[pageIndex].files.filter((_, i) => i !== fileIndex)
        setVirtualTours(newVirtualTours)
        setValue('virtualTours', newVirtualTours)
    }

    const handleAddHotspot = (pageIndex: number) => {
        const newVirtualTours = [...virtualTours]
        newVirtualTours[pageIndex].hotspots = [...newVirtualTours[pageIndex].hotspots, {
            id: (newVirtualTours[pageIndex].hotspots.length + 1).toString(),
            pitch: '',
            yaw: '',
            name: '',
            action: ''
        }]
        setVirtualTours(newVirtualTours)
        setValue('virtualTours', newVirtualTours)
    }

    const handleHotspotChange = (pageIndex: number, hotspotIndex: number, field: string, value: string) => {
        const newVirtualTours = [...virtualTours]
        newVirtualTours[pageIndex].hotspots[hotspotIndex] = {
            ...newVirtualTours[pageIndex].hotspots[hotspotIndex],
            [field]: value
        }
        setVirtualTours(newVirtualTours)
        setValue('virtualTours', newVirtualTours)
    }

    const handleDeleteHotspot = (pageIndex: number, hotspotIndex: number) => {
        const newVirtualTours = [...virtualTours]
        newVirtualTours[pageIndex].hotspots = newVirtualTours[pageIndex].hotspots.filter((_, i) => i !== hotspotIndex)
        setVirtualTours(newVirtualTours)
        setValue('virtualTours', newVirtualTours)
    }

    const handleAddPage = () => {
        const data = [...virtualTours, {
            id: (virtualTours.length + 1).toString(),
            name: `Page ${virtualTours.length + 1}`,
            images: [],
            files: [],
            hotspots: []
        }];
        setVirtualTours(data)
        setValue('virtualTours', data)
    }

    const handleDeletePage = (pageIndex: number) => {
        setVirtualTours(virtualTours.filter((_, i) => i !== pageIndex))
        setValue('virtualTours', virtualTours.filter((_, i) => i !== pageIndex))
    }

    const handlePageNameChange = (pageIndex: number, value: string) => {
        const newVirtualTours = [...virtualTours]
        newVirtualTours[pageIndex].name = value
        setVirtualTours(newVirtualTours)
        setValue('virtualTours', newVirtualTours)
    }

    async function uploadImages(event: ChangeEvent<HTMLInputElement>, pageIndex: number) {
        if (!event.target.files || event.target.files.length === 0) {
            return
        }

        const files = Array.from(event.target.files)
        const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        
        // Check file types
        const invalidFiles = files.filter(file => !imageTypes.includes(file.type))
        if (invalidFiles.length > 0) {
            toast.error('Only image files (JPEG, PNG, GIF, WEBP) are allowed')
            return
        }

        // Check total number of files
        const currentFiles = virtualTours[pageIndex].files
        const totalFiles = currentFiles.length + files.length
        if (totalFiles > 5) {
            toast.error('Maximum 5 images allowed per page')
            return
        }

        const newVirtualTours = [...virtualTours]
        newVirtualTours[pageIndex].files = [...currentFiles, ...files]
        setVirtualTours(newVirtualTours)
        setValue('virtualTours', newVirtualTours)
    }

    async function handleProcess(pageIndex: number) {
        try {
            setIsImageLoading(true)
            const currentPage = virtualTours[pageIndex]
            
            // Create FormData for new files
            const formData = new FormData()
            currentPage.files.forEach((file, index) => {
                formData.append('files', file)
            })

            // Send files to API
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                throw new Error('Upload failed')
            }

            const result = await response.json()
            
            // Update state with new URLs
            const newVirtualTours = [...virtualTours]
            newVirtualTours[pageIndex].images = [...currentPage.images, ...result.urls]
            newVirtualTours[pageIndex].files = [] // Clear uploaded files after successful upload
            setVirtualTours(newVirtualTours)
            setValue('virtualTours', newVirtualTours)

            toast.success('Images processed successfully')
        } catch (error) {
            toast.error('Failed to process images')
        } finally {
            setIsImageLoading(false)
        }
    }

    return (
        <VStack width="full" align="flex-start" spacing={8}>
            <Text color="teal.500" fontSize="lg" fontWeight={600} lineHeight={8}>
                Set Up Virtual Tour
            </Text>
            {virtualTours.map((virtualTour, pageIndex) => (
                <VStack
                    key={virtualTour.id}
                    width="full"
                    align="flex-start"
                    background="white"
                    boxShadow="sm"
                    spacing={4}
                    padding={6}
                    position="relative"
                    borderWidth={1}
                    borderColor="black"
                    borderRadius={8}
                >
                    <Button
                        boxSize={8}
                        padding={0}
                        borderRadius="30%"
                        position="absolute"
                        zIndex={9}
                        top={2}
                        right={2}
                        onClick={() => handleDeletePage(pageIndex)}
                    >
                        <Icon iconName="delete.svg" size={24} />
                    </Button>
                    <Text color="gray.700" fontSize="md" fontWeight={500}>
                        Page {pageIndex + 1}
                    </Text>
                    <SimpleGrid width="full" columns={{ base: 1, md: 4 }} gap={4}>
                        {getValidArray(virtualTour.images).map((image: string) => (
                            <Center key={image} position="relative">
                                <Button
                                    boxSize={10}
                                    padding={0}
                                    borderRadius="50%"
                                    background="white"
                                    position="absolute"
                                    zIndex={9}
                                    top={2}
                                    right={2}
                                    onClick={() => deleteImages(image, pageIndex)}
                                >
                                    <Icon iconName="trash.svg" size={32} />
                                </Button>
                                <Img key={image} width="full" height="130px" src={image} borderRadius={8} />
                            </Center>
                        ))}
                        {virtualTour.files.map((file, fileIndex) => (
                            <Center key={fileIndex} position="relative">
                                <Button
                                    boxSize={10}
                                    padding={0}
                                    borderRadius="50%"
                                    background="white"
                                    position="absolute"
                                    zIndex={9}
                                    top={2}
                                    right={2}
                                    onClick={() => deleteFile(fileIndex, pageIndex)}
                                >
                                    <Icon iconName="trash.svg" size={32} />
                                </Button>
                                <Img 
                                    width="full" 
                                    height="130px" 
                                    src={URL.createObjectURL(file)} 
                                    borderRadius={8} 
                                />
                            </Center>
                        ))}
                    </SimpleGrid>
                    <HStack spacing={4}>
                        <Button
                            background="gray.300"
                            isLoading={isImageLoading}
                            onClick={() => imagesRef?.current?.click()}
                        >
                            Upload Tour Images
                        </Button>
                        <input 
                            type="file" 
                            ref={imagesRef} 
                            onChange={(e) => uploadImages(e, pageIndex)} 
                            style={{ display: 'none' }} 
                            multiple 
                            accept="image/*"
                        />
                        <Button
                            colorScheme="teal"
                            isLoading={isImageLoading}
                            onClick={() => handleProcess(pageIndex)}
                        >
                            Process
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={() => {/* Handle preview */}}
                        >
                            Preview
                        </Button>
                    </HStack>
                    
                    <VStack width="full" align="flex-start" spacing={4}>
                        <Text color="teal.500" fontSize="lg" fontWeight={600} lineHeight={8}>
                            Hotspots
                        </Text>
                        <VStack width="full" align="flex-start" spacing={6}>
                            {virtualTour.hotspots.map((hotspot, hotspotIndex) => (
                                <VStack 
                                    key={hotspotIndex} 
                                    width="full" 
                                    align="flex-start" 
                                    spacing={4}
                                    padding={4}
                                    borderWidth={1}
                                    borderRadius={8}
                                    position="relative"
                                >
                                    <Button
                                        boxSize={8}
                                        padding={0}
                                        borderRadius="30%"
                                        background="white"
                                        position="absolute"
                                        zIndex={9}
                                        top={2}
                                        right={2}
                                        onClick={() => handleDeleteHotspot(pageIndex, hotspotIndex)}
                                    >
                                        <Icon iconName="delete.svg" size={20} />
                                    </Button>
                                    <SimpleGrid width="full" columns={{ base: 1, md: 2 }} gap={6}>
                                        <FormControl>
                                            <FormLabel>Pitch</FormLabel>
                                            <Input 
                                                type="number" 
                                                placeholder="Enter pitch value"
                                                value={hotspot.pitch}
                                                onChange={(e) => handleHotspotChange(pageIndex, hotspotIndex, 'pitch', e.target.value)}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Yaw</FormLabel>
                                            <Input 
                                                type="number" 
                                                placeholder="Enter yaw value"
                                                value={hotspot.yaw}
                                                onChange={(e) => handleHotspotChange(pageIndex, hotspotIndex, 'yaw', e.target.value)}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Name</FormLabel>
                                            <Input 
                                                placeholder="Enter hotspot name"
                                                value={hotspot.name}
                                                onChange={(e) => handleHotspotChange(pageIndex, hotspotIndex, 'name', e.target.value)}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Action</FormLabel>
                                            <Select 
                                                placeholder="Select action"
                                                value={hotspot.action}
                                                onChange={(e) => handleHotspotChange(pageIndex, hotspotIndex, 'action', e.target.value)}
                                            >
                                                <option value="1">Action 1</option>
                                                <option value="2">Action 2</option>
                                                <option value="3">Action 3</option>
                                            </Select>
                                        </FormControl>
                                    </SimpleGrid>
                                </VStack>
                            ))}
                            <Button
                                leftIcon={<Icon iconName="plus.svg" size={20} />}
                                colorScheme="teal"
                                variant="outline"
                                onClick={() => handleAddHotspot(pageIndex)}
                            >
                                Add Hotspot
                            </Button>
                        </VStack>
                    </VStack>
                </VStack>
            ))}
            <Button
                leftIcon={<Icon iconName="plus.svg" size={20} />}
                colorScheme="teal"
                variant="outline"
                onClick={handleAddPage}
            >
                Add Page
            </Button>
        </VStack>
    )
}

export default VirtualTour