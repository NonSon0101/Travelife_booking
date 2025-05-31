import { Box, Button, FormControl, FormLabel, HStack, Input, Text, VStack, SimpleGrid, List, ListItem, Center, Image, Img } from '@chakra-ui/react'
import { useForm, Controller, useWatch, Control, UseFormSetValue, UseFormGetValues } from 'react-hook-form'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-toastify'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { debounce } from 'lodash'
import Icon from 'components/Icon'
import ItineraryItem from './ItineraryItem'
import { exportItinerary } from 'API/export'
import { usePathname } from 'next/navigation'

export interface IItineraryItem {
  activity: string
  description: string
  address: string
  duration: number
  timeline: string
  location: {
    type: string
    coordinates: number[]
  }
  image: string
}

interface IItinerarySetupProps {
  methods: any
}

interface ISearchResult {
  place_name: string
  center: [number, number]
}

const initialItem: IItineraryItem = {
  activity: '',
  description: '',
  address: '',
  duration: 0,
  timeline: '',
  location: {
    type: 'Point',
    coordinates: []
  },
  image: ''
}

const ItinerarySetup = ({ methods }: IItinerarySetupProps) => {
  if (!methods) return null;

  const { control, setValue, getValues } = methods
  const itineraryItems = useWatch({
    control,
    name: 'itinerary',
    defaultValue: []
  })
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [searchResults, setSearchResults] = useState<ISearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const marker = useRef<maplibregl.Marker | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [currentItem, setCurrentItem] = useState<IItineraryItem>(initialItem)
  const imagesRef = useRef<any>(null)
  const pathname = usePathname()
  const tourId = pathname?.split('/').pop() ?? ''

  const center = {
    lat: 10.762622,
    lng: 106.660172
  }

  const searchLocation = debounce(async (query: string) => {
    if (!query) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=PAckuW1Q20LwrRJCIs0n`
      )
      const data = await response.json()
      setSearchResults(data.features || [])
    } catch (error) {
      console.error('Error searching location:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, 300)

  const handleLocationSelect = (result: ISearchResult) => {
    const [lng, lat] = result.center
    setCurrentItem(prev => ({
      ...prev,
      address: result.place_name,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    }))
    setSelectedLocation({ lat, lng })
    setSearchResults([])

    // Update marker position
    if (marker.current) {
      marker.current.setLngLat([lng, lat])
    } else {
      marker.current = new maplibregl.Marker()
        .setLngLat([lng, lat])
        .addTo(map.current!)
    }

    // Pan map to selected location
    map.current?.flyTo({
      center: [lng, lat],
      zoom: 15,
      essential: true
    })
  }

  const initializeMap = () => {
    if (mapContainer.current && !map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/streets/style.json?key=PAckuW1Q20LwrRJCIs0n`,
        center: [center.lng, center.lat],
        zoom: 13
      })

      map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat
        
        // Update marker position
        if (marker.current) {
          marker.current.setLngLat([lng, lat])
        } else {
          marker.current = new maplibregl.Marker()
            .setLngLat([lng, lat])
            .addTo(map.current!)
        }

        setSelectedLocation({ lat, lng })
        setCurrentItem(prev => ({
          ...prev,
          location: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        }))

        // Reverse geocode to get address
        fetch(`https://api.maptiler.com/geocoding/${lng},${lat}.json?key=PAckuW1Q20LwrRJCIs0n`)
          .then(response => response.json())
          .then(data => {
            if (data.features && data.features.length > 0) {
              setCurrentItem(prev => ({
                ...prev,
                address: data.features[0].place_name
              }))
            }
          })
      })
    }
  }

  const cleanupMap = () => {
    if (map.current) {
      map.current.remove()
      map.current = null
    }
    if (marker.current) {
      marker.current.remove()
      marker.current = null
    }
  }

  useEffect(() => {
    if (isAdding) {
      // Initialize map when form is shown
      initializeMap()
    } else {
      // Cleanup map when form is hidden
      cleanupMap()
    }

    return () => {
      cleanupMap()
    }
  }, [isAdding])

  const handleAddItem = () => {
    if (!currentItem.activity || !currentItem.description || !currentItem.address || !currentItem.location.coordinates.length) {
      toast.error('Please fill in all required fields')
      return
    }

    const newItems = [...(itineraryItems || []), currentItem]
    setValue('itinerary', newItems)
    setCurrentItem(initialItem)
    setSelectedLocation(null)
    cleanupMap()
    setIsAdding(false)
    toast.success('Added itinerary item successfully')
  }

  const handleDeleteItem = (index: number) => {
    if (!itineraryItems) return;
    const newItems = itineraryItems.filter((_, i) => i !== index)
    setValue('itinerary', newItems)
    toast.success('Deleted itinerary item successfully')
  }

  const handleEditItem = (index: number) => {
    if (!itineraryItems) return;
    const itemToEdit = itineraryItems[index]
    if (!itemToEdit) return;
    
    setCurrentItem(itemToEdit)
    setSelectedLocation({
      lat: itemToEdit.location.coordinates[1],
      lng: itemToEdit.location.coordinates[0]
    })
    setEditingIndex(index)
    setIsAdding(true)

    // Add marker to map after map is initialized
    setTimeout(() => {
      if (map.current && itemToEdit.location.coordinates.length === 2) {
        const [lng, lat] = itemToEdit.location.coordinates
        if (marker.current) {
          marker.current.setLngLat([lng, lat])
        } else {
          marker.current = new maplibregl.Marker()
            .setLngLat([lng, lat])
            .addTo(map.current)
        }
        
        // Pan map to marker location
        map.current.flyTo({
          center: [lng, lat],
          zoom: 15,
          essential: true
        })
      }
    }, 100) // Small delay to ensure map is initialized
  }

  const handleUpdateItem = () => {
    if (!currentItem.activity || !currentItem.description || !currentItem.address || !currentItem.location.coordinates.length) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!itineraryItems || editingIndex === null) return;
    const newItems = [...itineraryItems]
    newItems[editingIndex] = currentItem
    setValue('itinerary', newItems)
    setCurrentItem(initialItem)
    setSelectedLocation(null)
    setEditingIndex(null)
    cleanupMap()
    setIsAdding(false)
    toast.success('Updated itinerary item successfully')
  }

  const handleCancel = () => {
    setCurrentItem(initialItem)
    setSelectedLocation(null)
    setEditingIndex(null)
    cleanupMap()
    setIsAdding(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return
    }

    const file = event.target.files[0]
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    
    // Check file type
    if (!imageTypes.includes(file.type)) {
      toast.error('Only image files (JPEG, PNG, GIF, WEBP) are allowed')
      return
    }

    // Check file size
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size should be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setCurrentItem(prev => ({
        ...prev,
        image: reader.result as string
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleExportPDF = async () => {
    try {
      setIsExporting(true)
      await exportItinerary(tourId)
      toast.success('PDF exported successfully')
    } catch (error) {
      toast.error('Failed to export PDF')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <VStack width="full" align="flex-start" spacing={8}>
      <HStack width="full" justify="space-between">
        <Text color="teal.500" fontSize="lg" fontWeight={600} lineHeight={8}>
          Set Up Itinerary
        </Text>
        <Button
          leftIcon={<Icon iconName="pdf.svg" size={20} />}
          colorScheme="teal"
          variant="outline"
          isDisabled={!itineraryItems || itineraryItems.length === 0 || isExporting}
          isLoading={isExporting}
          loadingText="Exporting..."
          onClick={handleExportPDF}
        >
          Export PDF
        </Button>
      </HStack>

      {/* Display existing items */}
      {itineraryItems && itineraryItems.length > 0 && (
        <VStack width="full" spacing={4}>
          {itineraryItems.map((item, index) => (
            <ItineraryItem
                key={index}
                item={item}
                index={index}
                onEdit={() => handleEditItem(index)}
                onDelete={() => handleDeleteItem(index)}
            />
          ))}
        </VStack>
      )}

      {/* Add Itinerary Button or Form */}
      {!isAdding ? (
        <Button
          leftIcon={<Icon iconName="plus.svg" size={20} />}
          colorScheme="teal"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          Add Itinerary
        </Button>
      ) : (
        <VStack width="full" align="flex-start" background="white" padding={6} borderRadius={8} borderWidth={1} boxShadow="sm">
          <Text color="gray.700" fontSize="md" fontWeight={500} marginBottom={4}>
            {editingIndex !== null ? `Edit Item ${editingIndex + 1}` : 'Add New Item'}
          </Text>
          <SimpleGrid width="full" columns={2} gap={6} templateColumns="1fr 1fr">
            <VStack spacing={4} align="stretch" width="full" flex={1}>
              <FormControl isRequired>
                <FormLabel>Activity</FormLabel>
                <Input
                  value={currentItem.activity}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, activity: e.target.value }))}
                  placeholder="Enter activity name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Input
                  value={currentItem.description}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter activity description"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Duration (minutes)</FormLabel>
                <Input
                  type="number"
                  value={currentItem.duration}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  placeholder="Enter duration in minutes"
                  min={0}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Timeline</FormLabel>
                <Input
                  value={currentItem.timeline}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, timeline: e.target.value }))}
                  placeholder="Enter timeline (e.g., Day 1, Morning)"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Image</FormLabel>
                <HStack spacing={4}>
                  {!currentItem.image ? (
                    <>
                      <Button
                        background="gray.300"
                        onClick={() => imagesRef.current?.click()}
                      >
                        Upload Image
                      </Button>
                      <input 
                        type="file" 
                        ref={imagesRef}
                        onChange={handleImageUpload} 
                        style={{ display: 'none' }} 
                        accept="image/*"
                      />
                    </>
                  ) : (
                    <Button
                      leftIcon={<Icon iconName="delete.svg" size={20} />}
                      onClick={() => setCurrentItem(prev => ({ ...prev, image: '' }))}
                      variant="outline"
                      colorScheme="red"
                    >
                      Remove Image
                    </Button>
                  )}
                </HStack>
                {currentItem.image && (
                  <Box mt={4}>
                    <Img
                      src={currentItem.image}
                      alt="Preview"
                      maxH="200px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  </Box>
                )}
              </FormControl>
            </VStack>

            <VStack spacing={4} align="stretch" width="full" flex={1}>
              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Box position="relative">
                  <Input
                    ref={searchInputRef}
                    placeholder="Search for a location"
                    value={currentItem.address}
                    onChange={(e) => {
                      setCurrentItem(prev => ({ ...prev, address: e.target.value }))
                      searchLocation(e.target.value)
                    }}
                  />
                  {searchResults.length > 0 && (
                    <List
                      position="absolute"
                      top="100%"
                      left={0}
                      right={0}
                      bg="white"
                      boxShadow="md"
                      borderRadius="md"
                      zIndex={1}
                      maxH="200px"
                      overflowY="auto"
                    >
                      {searchResults.map((result, index) => (
                        <ListItem
                          key={index}
                          p={2}
                          cursor="pointer"
                          _hover={{ bg: 'gray.100' }}
                          onClick={() => handleLocationSelect(result)}
                        >
                          {result.place_name}
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
                <Box 
                  ref={mapContainer} 
                  mt={4} 
                  height="400px" 
                  width="100%" 
                  borderRadius="md"
                  overflow="hidden"
                />
              </FormControl>
            </VStack>
          </SimpleGrid>

          <HStack justify="flex-end" spacing={4} mt={6}>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              colorScheme="teal" 
              onClick={editingIndex !== null ? handleUpdateItem : handleAddItem}
            >
              {editingIndex !== null ? 'Update Item' : 'Add Itinerary Item'}
            </Button>
          </HStack>
        </VStack>
      )}
    </VStack>
  )
}

export default ItinerarySetup