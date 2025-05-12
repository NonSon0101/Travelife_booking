import { Box, IconButton, Image, Skeleton, HStack, useBreakpointValue } from "@chakra-ui/react";
import { useState } from "react";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import Slider from "react-slick";

interface ISliderImages {
  images?: string[];
}

const SliderComponent = (props: ISliderImages) => {
  const {images} = props;
  const [slider, setSlider] = useState<Slider | null>(null)
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const settings = {
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      pauseOnHover: true
    };
    const top = typeof window !== 'undefined' ? useBreakpointValue({ base: '90%', md: '50%' }) : ''
    const side = typeof window !== 'undefined' ? useBreakpointValue({ base: '30%', md: '10px' }) : ''

  return (
    <Box position={'relative'} height={{ base: '300px', lg: '600px' }} width={'full'} overflow={'hidden'}>
      <IconButton
        aria-label="left-arrow"
        colorScheme="messenger"
        borderRadius="full"
        position="absolute"
        left={side}
        top={top}
        transform={'translate(0%, -50%)'}
        zIndex={2}
        onClick={() => slider?.slickPrev()}
      >
        <BiLeftArrowAlt />
      </IconButton>
      
      {/* Right Icon */}
      <IconButton
        aria-label="right-arrow"
        colorScheme="messenger"
        borderRadius="full"
        position="absolute"
        right={side}
        top={top}
        transform={'translate(0%, -50%)'}
        zIndex={2}
        onClick={() => slider?.slickNext()}
      >
        <BiRightArrowAlt />
      </IconButton>

      <Slider {...settings} ref={(slider) => setSlider(slider)}>
        {images?.map((url, index) => (
          <div key={index}>
            {isLoading && (
              <Skeleton height={{ base: '300px', lg: '600px' }} width="full" borderRadius="12px" />
            )}
            <Image
              onLoad={handleImageLoad}
              height={{ base: '300px', lg: '600px' }}
              position="relative"
              backgroundPosition="center"
              backgroundRepeat="no-repeat"
              backgroundSize="cover"
              borderRadius="12px"
              backgroundImage={`url(${url})`}
            />
          </div>
        ))}
      </Slider>
    </Box>
  );
};

export default SliderComponent;
