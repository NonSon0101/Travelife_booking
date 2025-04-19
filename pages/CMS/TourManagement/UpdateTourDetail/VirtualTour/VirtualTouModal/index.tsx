'use client'

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    VStack,
    HStack,
    Text,
    ModalHeader
} from '@chakra-ui/react';
import { Pannellum } from 'pannellum-react';
import { useEffect, useRef, useState } from 'react';
import Clipboard from 'components/Clipboard';
import { IHotSpot } from 'interfaces/tour';

interface IVirtualTourModalProps {
    isOpen: boolean;
    onClose: () => void;
    image?: string | null;
    hotspots?: IHotSpot[];
    handleClickHotspot?: (hotspot: IHotSpot) => void;
}

const VirtualTourModal = ({
    isOpen,
    onClose,
    image,
    hotspots = [],
    handleClickHotspot = () => {},
}: IVirtualTourModalProps) => {
    const [yaw, setYaw] = useState<number>(0);
    const [pitch, setPitch] = useState<number>(0);
    const panImage = useRef<any>(null);
    const [isViewerReady, setViewerReady] = useState(false);

    useEffect(() => {
        console.log('hotspots', hotspots);
    }, [hotspots]);

    if (!image) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="full">
            <ModalOverlay />
            <ModalContent 
            borderRadius={8} marginInline={10}
            >  
                {/* <ModalHeader color="gray.800"fontSize="18px" fontWeight={500} lineHeight={7}>
                    Preview Virtual Tour
                </ModalHeader> */}
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

                        <Pannellum
                            width="100%"
                            height="100%"
                            image={image}
                            title="360 Virtual Tour"
                            previewTitle="360 Virtual Tour"
                            author="Vo Minh Dat"
                            previewAuthor="Vo Minh Dat"
                            // @ts-ignore
                            authorURL="https://github.com/vmdt"
                            pitch={10}
                            yaw={10}
                            hfov={110}
                            // autoRotate={1}
                            autoLoad
                            compass
                            disableKeyboardCtrl
                            ref={panImage}
                            onMouseup={(event: any) => {
                            setPitch(panImage.current.getViewer().mouseEventToCoords(event)[0]);
                            setYaw(panImage.current.getViewer().mouseEventToCoords(event)[1]);
                            }}
                        >
                            {(hotspots || [])
                                .filter(
                                    (hotspot) =>
                                        hotspot?.pitch != null &&
                                        !isNaN(hotspot.pitch) &&
                                        hotspot?.yaw != null &&
                                        !isNaN(hotspot.yaw)
                                )
                                .flatMap((hotspot: IHotSpot, index: number): JSX.Element[] => {
                                    const hotspotElements: JSX.Element[] = [];
                                
                                    hotspotElements.push(
                                        <Pannellum.Hotspot
                                            // @ts-ignore
                                            type={!hotspot.action ? 'info' : 'custom'}
                                            pitch={hotspot.pitch || 0}
                                            yaw={hotspot.yaw || 0}
                                            text={hotspot.name}
                                            handleClick={() => {
                                                if (hotspot.action && hotspot.action !== 'info') {
                                                    handleClickHotspot(hotspot);
                                                }
                                            }}
                                            key={`hotspot-${index}`}
                                        />
                                    );
                                
                                    if (hotspot.action && hotspot.name) {
                                        hotspotElements.push(
                                            <Pannellum.Hotspot
                                                // @ts-ignore
                                                type="info"
                                                pitch={(hotspot.pitch || 0) - 5}
                                                yaw={hotspot.yaw || 0}
                                                text={hotspot.name}
                                                key={`hotspot-info-${index}`}
                                            />
                                        );
                                    }
                                
                                    return hotspotElements;
                                })}

                        </Pannellum>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default VirtualTourModal;
