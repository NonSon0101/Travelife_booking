import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import * as maptilersdk from '@maptiler/sdk'
import '@maptiler/sdk/dist/maptiler-sdk.css'
import './map.css'
import { Box } from '@chakra-ui/react'
import { IItineraryItem } from 'interfaces/tour'

interface IItineraryMapProps {
  itinerary: IItineraryItem[]
}

export interface ItineraryMapRef {
  flyToMarker: (coordinates: number[]) => void
}

const ItineraryMap = forwardRef<ItineraryMapRef, IItineraryMapProps>(({ itinerary }, ref) => {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<maptilersdk.Map | null>(null)
  const [mapKey, setMapKey] = useState(0)
  const markers = useRef<maptilersdk.Marker[]>([])
  const [zoom] = useState(14)
  maptilersdk.config.apiKey = "PAckuW1Q20LwrRJCIs0n"

  useImperativeHandle(ref, () => ({
    flyToMarker: (coordinates: number[]) => {
      if (map.current && coordinates.length >= 2) {
        map.current.flyTo({
          center: coordinates as [number, number],
          zoom: 15,
          duration: 2000
        })
      }
    }
  }))

  const calculateCenter = () => {
    if (!itinerary || itinerary.length === 0) {
      return { lat: 10.762622, lng: 106.660172 } // Default center (Ho Chi Minh City)
    }

    const [lng, lat] = itinerary[0].location.coordinates
    return { lat, lng }
  }

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const center = calculateCenter()

    const mapInstance = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [center.lng, center.lat],
      zoom: zoom,
    })

    map.current = mapInstance

    const canvas = mapInstance.getCanvas()
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault()
      console.warn('WebGL context lost — rebuilding map...')

      if (mapContainer.current) {
        mapContainer.current.innerHTML = ''
      }

      map.current = null

      setMapKey(prev => prev + 1)

    })

    itinerary.forEach((item, index) => {
      const [lng, lat] = item.location.coordinates

      const popup = new maptilersdk.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false
      }).setHTML(`
      <div style="
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        font-weight: 500;
      ">
        ${item.activity}
      </div>
    `)

      const marker = new maptilersdk.Marker({
        color: index != 0 && index % 2 == 1 ? '#4A90E2' : '#FF0000'
      })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(mapInstance)

      markers.current.push(marker)
    })

    mapInstance.on('load', () => {
      markers.current.forEach(marker => {
        marker.togglePopup()
      })
    })

    return () => {
      markers.current.forEach(marker => marker.remove())
      markers.current = []

      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [itinerary, zoom])


  return (
    <Box className="map-wrap">
      <Box key={mapKey} ref={mapContainer} className="map" />
    </Box>
  )
})

export default ItineraryMap