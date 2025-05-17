import { Box, VStack, Icon, Text, Stack, useDisclosure } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { MdLocationOn } from 'react-icons/md';
import { IItineraryItem } from 'interfaces/tour';
import { useState, useRef, useEffect } from 'react';

// Define the props type for TimelineItem
interface TimelineItemProps {
  item: IItineraryItem;
  isFirst?: boolean;
  isLast?: boolean;
  onMarkerClick?: (item: IItineraryItem) => void;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ item, isFirst, isLast, onMarkerClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (descriptionRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(descriptionRef.current).lineHeight);
      const height = descriptionRef.current.scrollHeight;
      setIsOverflowing(height > lineHeight * 2);
    }
  }, [item.description]);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMarkerClick = () => {
    onMarkerClick?.(item);
  };

  return (
    <Stack direction="row" align="flex-start" spacing={4} position="relative" marginTop='16px' zIndex={1}
      {...({
        _before: {
          content: '""',
          zIndex: '-1',
          position: "absolute",
          background: "orange",
          height: "calc(100% + 16px)",
          left: "10.2px",
          top: "25px",
          width: "12px",
          display: isLast ? "none" : "block"
        },
      })}
    >
      <VStack align="center" spacing={0}>
        <Icon 
          as={MdLocationOn} 
          color="red.500" 
          boxSize={6} 
          background='teal' 
          borderRadius='full' 
          width='30px' 
          height='30px'
          cursor="pointer"
          onClick={handleMarkerClick}
          _hover={{ transform: 'scale(1.1)' }}
          transition="transform 0.2s"
        />
        {!isFirst && !isLast && (
          <Box width="1px" bg="gray.300" flex="1" />
        )}
      </VStack>
      <Box>
        <Text fontSize="md" fontWeight="medium">{item.activity}</Text>
        <Text fontSize="sm" color="gray.800">{item.address}</Text>
        <Box position="relative">
          <Text 
            ref={descriptionRef}
            fontSize="sm" 
            color="gray.600"
            noOfLines={isExpanded ? undefined : 2}
            transition="all 0.3s"
          >
            {item.description}
          </Text>
          {isOverflowing && (
            <Text
              as="span"
              fontSize="sm"
              color="blue.500"
              cursor="pointer"
              textDecoration="underline"
              onClick={toggleDescription}
              ml={1}
            >
              {isExpanded ? 'See less' : 'See more'}
            </Text>
          )}
        </Box>
        <Text fontSize="sm" color="gray.500">{item.duration} minutes</Text>
      </Box>
    </Stack>
  );
};

// Main Timeline component
interface TimelineProps {
  itinerary: IItineraryItem[];
  onMarkerClick?: (item: IItineraryItem) => void;
}

const Timeline: React.FC<TimelineProps> = ({ itinerary, onMarkerClick }) => {
  if (!itinerary || itinerary.length === 0) {
    return null;
  }

  return (
    <Box pl={6}>
      {itinerary.map((item, index) => (
        <TimelineItem
          key={index}
          item={item}
          isFirst={index === 0}
          isLast={index === itinerary.length - 1}
          onMarkerClick={onMarkerClick}
        />
      ))}
    </Box>
  );
};

export default Timeline;
