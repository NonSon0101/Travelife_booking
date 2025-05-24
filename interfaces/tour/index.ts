import { File } from 'buffer'
import { IOption } from 'components/Dropdown'
import { ICategory } from 'interfaces/category'
import { IPriceOption } from 'interfaces/common'
import { IHotel } from 'interfaces/hotel'
import { ITransportation } from 'interfaces/transportation'

export interface ITour {
  _id?: string
  code?: string
  title?: string
  highlights?: string[]
  type?: string
  summary?: string
  description?: string
  thumbnail?: string
  images?: string[]
  category?: string
  interest?: string
  startLocation?: IStartLocation
  details?: {
    title?: string
    description?: string
  }[]
  inclusions?: string[]
  exclusions?: string[]
  itinerary?: IItineraryItem[]
  duration?: number
  discountPrice?: number
  discountPercentage?: number
  ratingAverage?: number
  numOfRating?: number
  priceOptions?: IPriceOption[]
  regularPrice?: number
  currency?: string
  isActive?: boolean
  hotels?: IHotel[] | string[]
  location?: string
  transports?: ITransportation[] | string[]
  virtualTours?: IVirtualTour[],
  isPrivate?: boolean
}

export interface ITourPagination {
  total: number
  docs: ITour[]
}

export interface IAllTourPagination {
  total: number
  tours: ITour[]
}

export interface IStartLocation {
  type?: string
  coordinates: number[]
  description: string
  address: string
}

export interface ITourItinerary {
  activity: string
  description: string
  address: string
  duration: number
  icon: string
  location: IStartLocation
}

export interface ISuggesttion {
  _id?: string
  title?: string
  type?: string
  thumbnail?: string 
  loc?: {
    type?: string
    coordinates?: [number, number]
  }
  startLocation?: {
    type?: string,
    coordinates?: [
        number,
        number
    ],
    description?: string
    address?: string
  }
}

export interface ISearch {
  suggestions: ISuggesttion[]
  result: number
}

export interface IUploadTourImage {
  thumbnailURL: string
  imagesURL: string[]
}

export interface IHotSpot {
  _id?: string
  id: string
  pitch: number | null
  yaw: number | null
  name: string
  action: string
}

export interface IVirtualTour {
  _id?: string
  id: string
  name: string
  images: string[]
  files?: any[]
  hotspots: IHotSpot[]
  processedImage?: string | null
}
export type IUpdateTour = Omit<ITour, 'category' | 'hotels' | 'transports'> & {
  category?: string;
  hotels?: string[];
  transports?: string[];
  typeValue: IOption
  locationValue: IOption
  categoryValue: IOption
  currencyValue: IOption
};

export interface IItineraryItem {
  activity: string
  description: string
  address: string
  duration: number
  timeline: string
  location: {
    type: string | null
    coordinates: number[]
  }
  image: string | null
}