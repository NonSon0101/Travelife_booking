import { ITour } from "interfaces/tour"

export interface IRevenues {
 metadata: IRevenue[]
} 

export interface IRevenue {
  date: string
  revenue: number
}

export interface ITopBookedTours {
  metadata: ITopBookedTour[]
}

export interface ITopBookedTour {
  _id: string
  total: number
  tour: ITour
}