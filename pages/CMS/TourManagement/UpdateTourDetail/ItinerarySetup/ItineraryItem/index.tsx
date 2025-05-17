import { Box, Button, HStack, Icon, Img, SimpleGrid, Text, VStack } from "@chakra-ui/react"
import { EditIcon, DeleteIcon } from "@chakra-ui/icons"
import { IItineraryItem } from "interfaces/tour"

interface IItineraryItemProps {
    item: IItineraryItem
    index: number
    onEdit: () => void
    onDelete: () => void
}

const ItineraryItem = ({ item, index, onEdit, onDelete }: IItineraryItemProps) => {
    if (!item) return null;

    return (
        <VStack
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
            <HStack position="absolute" top={2} right={2} spacing={2}>
                <Button
                    boxSize={8}
                    padding={0}
                    borderRadius="30%"
                    background="white"
                    onClick={onEdit}
                >
                    <EditIcon boxSize={4} />
                </Button>
                <Button
                    boxSize={8}
                    padding={0}
                    borderRadius="30%"
                    background="white"
                    onClick={onDelete}
                >
                    <DeleteIcon boxSize={4} />
                </Button>
            </HStack>
            <Text color="gray.700" fontSize="md" fontWeight={500}>
                Item {index + 1}
            </Text>
            <SimpleGrid width="full" columns={2} gap={4}>
                <Text><strong>Activity:</strong> {item?.activity || ''}</Text>
                <Text><strong>Description:</strong> {item?.description || ''}</Text>
                <Text><strong>Duration:</strong> {item?.duration || 0} minutes</Text>
                <Text><strong>Timeline:</strong> {item?.timeline || ''}</Text>
                <Text><strong>Address:</strong> {item?.address || ''}</Text>
                {item?.image && (
                    <Box gridColumn="span 2">
                        <Text mb={2}><strong>Image:</strong></Text>
                        <Img 
                            src={item.image} 
                            alt={item.activity || 'Activity image'}
                            maxH="200px"
                            objectFit="cover"
                            borderRadius="md"
                        />
                    </Box>
                )}
            </SimpleGrid>
        </VStack>
    )
}

export default ItineraryItem