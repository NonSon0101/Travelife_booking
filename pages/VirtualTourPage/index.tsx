// 'use client'

import { Text, VStack, HStack } from "@chakra-ui/react";
// import { Pannellum } from "pannellum-react";
import { useEffect, useRef, useState } from "react";
import { IHotSpot, IVirtualTour } from "interfaces/tour";
import { useStores } from "hooks";
import Clipboard from "components/Clipboard";
import { observer } from 'mobx-react';


import dynamic from 'next/dynamic';

const Pannellum = dynamic(
  () => import('pannellum-react').then((mod) => {
    const Pannellum = mod.Pannellum;
    Pannellum.Hotspot = mod.Pannellum.Hotspot;
    return Pannellum;
}),
{ 
    ssr: false,
    loading: () => <div>Loading 360 viewer...</div>
});

const Hotspot = dynamic(
    () => import('pannellum-react').then((mod) => {
      const Pannellum = mod.Pannellum;
      return Pannellum.Hotspot;
}),
{ 
    ssr: false,
    loading: () => <div>Loading 360 viewer...</div>
});

interface IVirtualTourPageProps {
    tourId: string
    page: string
}

const VirtualTourPage = (props: IVirtualTourPageProps) => {
    const [yaw, setYaw] = useState<number>(0);
    const [pitch, setPitch] = useState<number>(0);
    const panImage = useRef<any>(null);

    const { tourStore } = useStores();
    const { virtualTour } = tourStore;

    function handleClickHotspot(hotspot: IHotSpot): void {
        if (hotspot.action && hotspot.action !== 'info') {
            const page = parseInt(hotspot.action);
            if (page) {
                window.location.href = `/virtual-tour/${props.tourId}/${page}`;
            }
        }
    }

    useEffect(() => {
        tourStore.fetchVirtualTourPage(props.tourId, props.page)
    }, []);

    if (!virtualTour) { return null; }

    return (
        <VStack width='full' height='full' position='relative'>
            <VStack
                position='absolute'
                top={10}
                right={10}
                zIndex={9}
                padding={3}
                backgroundColor='rgba(0, 0, 0, 0.5)'
                borderRadius='md'
                spacing={3}
            >
                <HStack spacing={2}>
                    <Text fontSize="xl" color="white">
                    Pitch: {pitch}
                    </Text>
                    <Clipboard value={String(pitch)} ariaLabel="Copy pitch" />
                </HStack>

                <HStack spacing={2} mt={2}>
                    <Text fontSize="xl" color="white">
                    Yaw: {yaw}
                    </Text>
                    <Clipboard value={String(yaw)} ariaLabel="Copy yaw" />
                </HStack>
            </VStack>
            <Pannellum
                width='100%'
                height='100vh'
                image={virtualTour?.processedImage || ''}
                title='360 Virtual Tour'
                previewTitle ="360 Virtual Tour"
                author="Vo Minh Dat"
                previewAuthor="Vo Minh Dat"
                pitch={10}
                yaw={180}
                hfov={110}
                autoRotate={2}
                // @ts-ignore
                authorURL="https://github.com/vmdt"
                autoLoad
                compass
                disableKeyboardCtrl
                ref={panImage}
                onMouseup = {(event: any) => {
                    setPitch(panImage.current.getViewer().mouseEventToCoords(event)[0]);
                    setYaw(panImage.current.getViewer().mouseEventToCoords(event)[1]);
                }}
            >
                {(virtualTour?.hotspots || [])
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
                            <Hotspot
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
                                <Hotspot
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
    )
};

export default observer(VirtualTourPage);