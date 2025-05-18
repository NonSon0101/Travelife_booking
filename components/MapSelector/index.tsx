import { Box, Input, List, ListItem, InputGroup, InputRightElement } from '@chakra-ui/react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'
import { SearchIcon } from '@chakra-ui/icons'

interface ISearchResult {
  place_name: string
  center: [number, number]
}

interface MapSelectorProps {
  onLocationSelect: (address: string, coordinates: [number, number]) => void
  initialLocation?: {
    address: string
    coordinates: [number, number]
  }
}

const MapSelector = ({ onLocationSelect, initialLocation }: MapSelectorProps) => {
  const [searchResults, setSearchResults] = useState<ISearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(initialLocation?.address || '')
  
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const marker = useRef<maplibregl.Marker | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

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
    setSelectedAddress(result.place_name)
    setSearchResults([])
    onLocationSelect(result.place_name, [lng, lat])

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
        center: initialLocation ? initialLocation.coordinates : [center.lng, center.lat],
        zoom: 13
      })

      // Add initial marker if initialLocation is provided
      if (initialLocation) {
        marker.current = new maplibregl.Marker()
          .setLngLat(initialLocation.coordinates)
          .addTo(map.current)
      }

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

        // Reverse geocode to get address
        fetch(`https://api.maptiler.com/geocoding/${lng},${lat}.json?key=PAckuW1Q20LwrRJCIs0n`)
          .then(response => response.json())
          .then(data => {
            if (data.features && data.features.length > 0) {
              const address = data.features[0].place_name
              setSelectedAddress(address)
              onLocationSelect(address, [lng, lat])
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
    initializeMap()
    return () => {
      cleanupMap()
    }
  }, [])

  return (
    <Box width="full" height="full" display="flex" flexDirection="column">
      <Box position="relative">
        <InputGroup>
          <Input
            ref={searchInputRef}
            placeholder="Search for a location"
            value={selectedAddress}
            onChange={(e) => {
              setSelectedAddress(e.target.value)
              searchLocation(e.target.value)
            }}
          />
          <InputRightElement>
            <SearchIcon color="gray.500" />
          </InputRightElement>
        </InputGroup>
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
        flex={1}
        width="100%" 
        borderRadius="md"
        overflow="hidden"
      />
    </Box>
  )
}

export default MapSelector