"use client";

import { Button, Center, FormControl, FormLabel, HStack, Img, Input, Select, SimpleGrid, Text, VStack, } from "@chakra-ui/react";
import Icon from "components/Icon";
import { ChangeEvent, useRef, useState, useEffect } from "react";
import { useWatch } from "react-hook-form";
import { toast } from 'react-toastify';
import { getValidArray } from 'utils/common';
import { IHotSpot, IVirtualTour } from "interfaces/tour";
import { m } from "framer-motion";
import { LuInfo } from "react-icons/lu";
import { Tooltip } from "react-tooltip";
import { processVirtualTour } from "API/tour";
import routes from "routes";
import { useDisclosure } from '@chakra-ui/react';
// import VirtualTourModal from "./VirtualTouModal";

import dynamic from "next/dynamic";
const VirtualTourModal = dynamic(
    () => import('./VirtualTouModal'), { ssr: false });
interface IVirtualTourProps {
    methods: any;
}

const VirtualTour = (props: IVirtualTourProps) => {
    const { methods } = props;
    if (!methods) return null;
    const { control, setValue, getValues } = methods;
    const [isImageLoading, setIsImageLoading] = useState<boolean>(false)
    const imagesRef = useRef<any>(null)
    const virtualTours: IVirtualTour[] = useWatch({ control, name: 'virtualTours' }) || [];
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedHotspots, setSelectedHotspots] = useState<IHotSpot[]>([]);
    const [virtualIndex, setVirtualIndex] = useState<number>(0);
    const tourCode = getValues('code');

    function deleteImages(url: string, pageIndex: number) {
        const newVirtualTours = [...virtualTours]
        newVirtualTours[pageIndex].images = newVirtualTours[pageIndex].images.filter(image => image !== url)
        setValue('virtualTours', newVirtualTours)
    }

    function deleteFile(fileIndex: number, pageIndex: number) {
        const newVirtualTours = [...virtualTours]
        newVirtualTours[pageIndex].files = (newVirtualTours[pageIndex]?.files || []).filter((_, i) => i !== fileIndex)
        setValue('virtualTours', newVirtualTours)
    }

    const handleAddHotspot = (pageIndex: number) => {
        const newVirtualTours = [...virtualTours]
        newVirtualTours[pageIndex].hotspots = [...newVirtualTours[pageIndex].hotspots, {
            id: (newVirtualTours[pageIndex].hotspots.length + 1).toString(),
            pitch: null,
            yaw: null,
            name: '',
            action: ''
        }]
        setValue('virtualTours', newVirtualTours)
    }

    const handleHotspotChange = (pageIndex: number, hotspotIndex: number, field: string, value: string) => {
        const newVirtualTours = [...virtualTours]
        newVirtualTours[pageIndex].hotspots[hotspotIndex] = {
            ...newVirtualTours[pageIndex].hotspots[hotspotIndex],
            [field]: value
        }
        setValue('virtualTours', newVirtualTours)
    }

    const handleDeleteHotspot = (pageIndex: number, hotspotIndex: number) => {
        const newVirtualTours = [...virtualTours]
        newVirtualTours[pageIndex].hotspots = newVirtualTours[pageIndex].hotspots.filter((_, i) => i !== hotspotIndex)
        setValue('virtualTours', newVirtualTours)
    }

    const handleAddPage = () => {
        const data = [...virtualTours, {
            id: (virtualTours.length + 1).toString(),
            name: `Page ${virtualTours.length + 1}`,
            images: [],
            files: [],
            hotspots: [],
            processedImage: null
        }];
        setValue('virtualTours', data)
    }

    const handleDeletePage = (pageIndex: number) => {
        const updatedVirtualTours = virtualTours.filter((_, i) => i !== pageIndex)
        
        // Update IDs and reset hotspots that point to deleted page
        updatedVirtualTours.forEach((tour, index) => {
            tour.id = (index + 1).toString();
            tour.name = `Page ${index + 1}`;
            
            // Reset hotspots that point to the deleted page
            tour.hotspots = tour.hotspots.map(hotspot => {
                if (hotspot.action === (pageIndex + 1).toString()) {
                    return {
                        ...hotspot,
                        action: ''
                    };
                }
                // Update action if it points to a page after the deleted one
                if (hotspot.action && parseInt(hotspot.action) > pageIndex + 1) {
                    return {
                        ...hotspot,
                        action: (parseInt(hotspot.action) - 1).toString()
                    };
                }
                return hotspot;
            });
        });
        
        setValue('virtualTours', updatedVirtualTours)
    }

    const handlePageNameChange = (pageIndex: number, value: string) => {
        const newVirtualTours = [...virtualTours]
        newVirtualTours[pageIndex].name = value
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
        const currentFiles = virtualTours[pageIndex].files || []
        const totalFiles = currentFiles.length + files.length
        if (totalFiles > 5) {
            toast.error('Maximum 5 images allowed per page')
            return
        }

        const newVirtualTours = [...virtualTours]
        newVirtualTours[pageIndex].files = [...currentFiles, ...files]
        setValue('virtualTours', newVirtualTours)
    }

    async function handleProcess(pageIndex: number) {
        try {
            setIsImageLoading(true)
            const currentPage = virtualTours[pageIndex]
            let  code, currentPageId;
            if (!currentPage) {
                code = "temp";
                currentPageId = "temp";
            } else {
                code = tourCode || "temp";
                currentPageId = currentPage.id;
            }

            const response = await processVirtualTour(
                code,
                currentPageId,
                {
                    files: currentPage.files || [],
                    images: currentPage.images
                }
            )
            
            // Update state with new URLs
            const newVirtualTours = [...virtualTours]
            newVirtualTours[pageIndex].images = [...response.images]
            newVirtualTours[pageIndex].files = [] 
            newVirtualTours[pageIndex].processedImage = response.processedImage
            setValue('virtualTours', newVirtualTours)

            toast.success('Images processed successfully')
        } catch (error) {
            console.error('Error processing images:', error)
        } finally {
            setIsImageLoading(false)
        }
    }

    function handlePreview(pageIndex: number) {
        const currentVirtualTour = virtualTours[pageIndex]
        if (!currentVirtualTour?.processedImage) return;

        setSelectedImage(currentVirtualTour.processedImage);
        setSelectedHotspots(currentVirtualTour.hotspots);
        setVirtualIndex(pageIndex);
        onOpen();
    }

    function handleClickHotspot(hotspot: IHotSpot) {
        if (hotspot.action) {
            const pageIndex = parseInt(hotspot.action) - 1
            const newVirtualTour = virtualTours[pageIndex]
            if (!newVirtualTour?.processedImage) return;
            setSelectedImage(newVirtualTour.processedImage);
            setSelectedHotspots(newVirtualTour.hotspots);
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
                        background="white"
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
                        {virtualTour?.files && virtualTour?.files.map((file, fileIndex) => (
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
                            onClick={() => imagesRef?.current?.[pageIndex]?.click()}
                        >
                            Upload Images
                        </Button>
                        <input 
                            type="file" 
                            ref={(el) => {
                                if (!imagesRef.current) imagesRef.current = [];
                                imagesRef.current[pageIndex] = el;
                            }} 
                            onChange={(e) => uploadImages(e, pageIndex)} 
                            style={{ display: 'none' }} 
                            multiple 
                            accept="image/*"
                        />
                        <Button
                            colorScheme="teal"
                            isLoading={isImageLoading}
                            onClick={() => handleProcess(pageIndex)}
                            isDisabled={(!virtualTour.files || virtualTour.files.length === 0) && virtualTour.images.length === 0}
                        >
                            Process
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={() => { handlePreview(pageIndex) }}
                            isDisabled={!virtualTour?.processedImage}
                        >
                            Preview
                        </Button>
                    </HStack>
                    
                    <VStack width="full" align="flex-start" spacing={4}>
                    <HStack align="center" spacing={2}>
                        <Text color="teal.500" fontSize="lg" fontWeight={600} lineHeight={8}>
                            Hotspots
                        </Text>
                        <a data-tooltip-id="hotspot-tooltip" data-tooltip-content="Hotspot must be added after processing images">
                            <LuInfo size={16} color="gray.500" />
                        </a>
                        <Tooltip id="hotspot-tooltip" />
                    </HStack>
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
                                                value={hotspot.pitch ?? ''}
                                                onChange={(e) => handleHotspotChange(pageIndex, hotspotIndex, 'pitch', e.target.value)}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Yaw</FormLabel>
                                            <Input 
                                                type="number" 
                                                placeholder="Enter yaw value"
                                                value={hotspot.yaw ?? ''}
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
                                                placeholder="No Action"
                                                value={hotspot.action}
                                                onChange={(e) => handleHotspotChange(pageIndex, hotspotIndex, 'action', e.target.value)}
                                            >
                                                {Array.from({ length: virtualTours.length }, (_, i) => i + 1)
                                                    .filter((page) => page !== pageIndex + 1 && virtualTours[page - 1]?.processedImage)
                                                    .map((page) => (
                                                        <option key={page} value={page}>
                                                            Go to page {page}
                                                        </option>
                                                ))}
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
                                isDisabled={!virtualTour?.processedImage}
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
            <VirtualTourModal
                isOpen={isOpen}
                onClose={onClose}
                // image={selectedImage}
                index={virtualIndex}
                // hotspots={selectedHotspots}
                // handleClickHotspot={handleClickHotspot}
                virtualTours={virtualTours}
            />
        </VStack>
    )
}

export default VirtualTour