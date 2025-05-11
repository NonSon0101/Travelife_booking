"use client";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    VStack,
    HStack,
    Text
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import Clipboard from 'components/Clipboard';
import { IHotSpot, IVirtualTour } from 'interfaces/tour';
import ReactPannellum, { addScene, loadScene, getViewer, getContainer, getAllScenes } from "react-pannellum";

import dynamic from 'next/dynamic';

const Hotspot = dynamic(
    () => import('pannellum-react').then((mod) => {
        const Pannellum = mod.Pannellum;
        return Pannellum.Hotspot;
}),
{ 
    ssr: false,
    loading: () => <div>Loading 360 viewer...</div>
});

interface IVirtualTourModalProps {
    isOpen: boolean;
    onClose: () => void;
    index: number;
    virtualTours: IVirtualTour[];
}

const VirtualTourModal = ({
    isOpen,
    onClose,
    index,
    virtualTours = [],
}: IVirtualTourModalProps) => {
    const [yaw, setYaw] = useState<number>(0);
    const [pitch, setPitch] = useState<number>(0);
    const viewerId = "mainViewer";
    const [currentTour, setCurrentTour] = useState<IVirtualTour | null>(null);
    const [config, setConfig] = useState<any>(null);

    // Initialize scenes when virtualTours changes
    useEffect(() => {
        if (!isOpen || !virtualTours.length) return;
            virtualTours.forEach((tour, idx) => {
                const sceneId = `scene_${idx}`;
                ReactPannellum.addScene(sceneId, {
                    type: "equirectangular",
                    style: {
                        width: "100%",
                        height: "100%",
                    },
                    imageSource: tour.processedImage || tour.images[0],
                    autoLoad: true,
                    hfov: 110,
                    yaw: 180,
                    pitch: 10,
                    compass: true,
                    autoRotate: -2,
                    author: "Vo Minh Dat",
                    previewTitle: "360 Virtual Tour",
                    previewAuthor: "Vo Minh Dat",
                    panorama: tour.processedImage || tour.images[0],
                    hotSpots: tour.hotspots
                        .filter(h => h?.pitch != null && !isNaN(h.pitch) && h?.yaw != null && !isNaN(h.yaw))
                        .map(hotspot => ({
                            pitch: hotspot.pitch || 0,
                            yaw: hotspot.yaw || 0,
                            text: hotspot.name,
                            type: !hotspot.action ? 'info' : 'scene',
                            sceneId: hotspot.action ? `scene_${parseInt(hotspot.action) - 1}` : undefined
                        }))
                });
        });
        setCurrentTour(virtualTours[index]);
        setConfig({
            type: "equirectangular",
            style: {
                width: "100%",
                height: "100%",
            },
            autoLoad: true,
            hfov: 110,
            yaw: 180,
            pitch: 10,
            compass: true,
            autoRotate: -2,
            author: "Vo Minh Dat",
            previewTitle: "360 Virtual Tour",
            previewAuthor: "Vo Minh Dat",
            disableKeyboardCtrl: true,
            hotSpots: virtualTours[index]?.hotspots.map(hotspot => ({
                pitch: hotspot.pitch || 0,
                yaw: hotspot.yaw || 0,
                text: hotspot.name,
                type: !hotspot.action ? 'info' : 'scene',
                sceneId: `scene_${parseInt(hotspot.action) - 1}`,
            })),
        });
    }, [isOpen, virtualTours, index]);

    // Track mouse position
    useEffect(() => {
        if (!isOpen) return;
        const handleMouseUp = (e: MouseEvent) => {
            const coords = ReactPannellum.getViewer().mouseEventToCoords(e);
            if (coords?.length === 2) {
                setPitch(coords[0]);
                setYaw(coords[1]);
            }
        };

        const interval = setInterval(() => {
            const container = getContainer();
            if (container) {
                container.addEventListener("mouseup", handleMouseUp);
                clearInterval(interval);
            }
        }, 100);

        return () => {
            clearInterval(interval);
            const container = getContainer();
            if (container) container.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isOpen, viewerId]);

    if (!virtualTours.length || !currentTour) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="full">
            <ModalOverlay />
            <ModalContent borderRadius={8} marginInline={10}>
                <ModalCloseButton zIndex={10} backgroundColor={"rgba(0, 0, 0, 0.5)"} color="white" />
                <ModalBody p={0} position="relative">
                    <VStack width="full" height="100vh" position="relative">
                        <VStack
                            position="absolute"
                            top={10}
                            right={10}
                            zIndex={9}
                            padding={3}
                            backgroundColor="rgba(0, 0, 0, 0.5)"
                            borderRadius="md"
                            spacing={3}
                        >
                            <HStack spacing={2}>
                                <Text fontSize="xl" color="white">
                                    Pitch: {pitch.toFixed(2)}
                                </Text>
                                <Clipboard value={String(pitch)} ariaLabel="Copy pitch" />
                            </HStack>
                            <HStack spacing={2}>
                                <Text fontSize="xl" color="white">
                                    Yaw: {yaw.toFixed(2)}
                                </Text>
                                <Clipboard value={String(yaw)} ariaLabel="Copy yaw" />
                            </HStack>
                        </VStack>

                        <ReactPannellum 
                            id={viewerId} 
                            sceneId={`scene_${index}`}
                            imageSource={currentTour.processedImage || currentTour.images[0]}
                            style={{ width: "100%", height: "100%" }}
                            config={config}
                        />
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default VirtualTourModal;
