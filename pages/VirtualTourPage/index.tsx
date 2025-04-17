'use client'

import { Text, VStack } from "@chakra-ui/react";
import { Pannellum } from "pannellum-react";
import { useEffect, useRef, useState } from "react";
import { IHotSpot, IVirtualTour } from "interfaces/tour";
import { useStores } from "hooks";

interface IVirtualTourPageProps {
    tourId: string
    page: string
}

const VirtualTourPage = (props: IVirtualTourPageProps) => {
    const [yaw, setYaw] = useState<number>(0);
    const [pitch, setPitch] = useState<number>(0);
    const [image, setImage] = useState<string>("https://pannellum.org/images/alma.jpg");
    const panImage = useRef<any>(null);

    const { tourStore } = useStores();
    const { virtualTour } = tourStore;

    useEffect(() => {
        // tourStore.fetchVirtualTourPage(props.tourId, props.page)
    }, [props.tourId, props.page]);

    // if (!virtualTour) {
    //     return null
    // }

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
                <Text
                    fontSize='xl'
                    color='white'
                >
                    Pitch: {pitch}
                </Text>
                <Text
                    fontSize='xl'
                    color='white'
                >
                    Yaw: {yaw}
                </Text>
            </VStack>
            <Pannellum
                width='100%'
                height='100vh'
                image={image}
                title='360 Virtual Tour'
                previewTitle ="360 Virtual Tour"
                author="Vo Minh Dat"
                previewAuthor="Vo Minh Dat"
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
                {(virtualTour?.hotspots || []).map((hotspot: IHotSpot, index: number) => (
                    <Pannellum.Hotspot
                        name={hotspot.name}
                        // @ts-ignore
                        type={hotspot.type}
                        pitch={hotspot.pitch}
                        yaw={hotspot.yaw}
                        text={hotspot.name}
                        handleClick={() => {}}
                        key={index}
                    />
                ))}
            </Pannellum>
        </VStack>
    )
};

export default VirtualTourPage;