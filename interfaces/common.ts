export interface IPriceOption {
  title?: string
  value?: number
  currency?: string
  participantsCategoryIdentifier?: string
}

export interface IApplyFilter {
  priceMin?: {
    name: string
    value: number
  };
  priceMax?: {
    name: string
    value: number
  };
  duration?: {
    name: string
    value: number
  };
  star?: {
    name: string
    value: number
  };
  sort?: {
    name: string
    value: string
  }
}
