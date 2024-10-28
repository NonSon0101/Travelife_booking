import { IHotel } from "interfaces/hotel";
import { ITransportation } from "interfaces/transportation";

export interface IListCart {
  _id: string;
  status: string;
  user: string;
  __v: number;
  tourCount: number;
  tours: ITourCart[];
}

export interface IAddToCart {
  user: string;
  tour: {
    tour: string;
    startDate: string;
    startTime: string;
    participants: IParticipants[];
    isPrivate?: boolean;
    transports?: [string];
    hotels?: [string];
  };
}

export interface IUpdateToCart {
  user: string;
  tour: {
    itemId: string;
    startDate: string;
    startTime: string;
    participants: IParticipants[];
    isPrivate?: boolean;
    transports?: [string];
    hotels?: [string];
  };
}

export interface IDeleteCart {
  cart: string;
  itemId: string;
}

export interface ITourCart {
  tour: {
    _id: string;
    code: string;
    title: string;
    thumbnail: string;
    numOfRating: number,
    ratingAverage: number
  };
  isPrivate: boolean;
  startDate: string;
  startTime: string;
  participants: IParticipants[];
  transports: ITransportation[];
  hotels: IHotel[];
  _id: string;
}

export interface IParticipants {
  title: string;
  quantity: number;
  price: number;
  currency?: string;
  _id?: string;
}

export interface ICart {
  cart: IListCart;
}

export interface IUpdatedCart {
  updatedCart: IListCart;
}
