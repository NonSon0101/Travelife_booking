import api, { auth, handleError } from 'API'
import { PLATFORM } from 'enums/common'
import { ITourPagination, ISearch, ITour, IAllTourPagination, IVirtualTour } from 'interfaces/tour'
import get from 'lodash/get'

const TOUR_URL = '/api/v1/tours'
const VIRTUAL_TOUR_URL = '/api/v1/virtual-tours'

export async function getAllTours(filter = ''): Promise<IAllTourPagination> {
  try {
    const response = await api.get(`${TOUR_URL}/all${filter}`)
    return response.data.metadata
  } catch (error) {
    handleError(error as Error, 'API/tour', 'getAllTours')
    const errorMessage: string = get(error, 'data.error.message', '') || JSON.stringify(error)
    throw new Error(errorMessage)
  }
}

export async function getActiveTours(filter = ''): Promise<ITourPagination> {
  try {
    const response = await api.get(`${TOUR_URL}/active-tours/all${filter}`)
    return response.data.metadata.tours
  } catch (error) {
    handleError(error as Error, 'API/tour', 'getActiveTours')
    const errorMessage: string = get(error, 'data.error.message', '') || JSON.stringify(error)
    throw new Error(errorMessage)
  }
}

export async function searchTour(inputValue: string): Promise<ISearch> {
  try {
    const response = await api.get(`/api/v1/search/${inputValue}?limit=5`)
    return response.data.metadata
  } catch (error) {
    handleError(error as Error, 'API/tour', 'getActiveTours')
    const errorMessage: string = get(error, 'data.error.message', '') || JSON.stringify(error)
    throw new Error(errorMessage)
  }
}

export async function getTourDetail(tourId: string): Promise<ITour> {
  try {
    const response = await api.get(`${TOUR_URL}/${tourId}`)
    return response.data.metadata
  } catch (error) {
    handleError(error as Error, 'API/tour', 'getTourDetail')
    const errorMessage: string = get(error, 'data.error.message', '') || JSON.stringify(error)
    throw new Error(errorMessage)
  }
}

export async function createTour(data: ITour): Promise<ITour> {
  try {
    const response = await api.post(TOUR_URL, data, {
      headers: auth(PLATFORM.CMS)
    })
    return response.data.metadata
  } catch (error) {
    handleError(error as Error, 'API/tour', 'createTour')
    const errorMessage: string = get(error, 'data.error.message', '') || JSON.stringify(error)
    throw new Error(errorMessage)
  }
}

export async function updateTourDetail(tourId: string, data: ITour): Promise<ITour> {
  try {
    const response = await api.post(`${TOUR_URL}/${tourId}`, data, {
      headers: auth(PLATFORM.CMS)
    })
    return response.data.metadata
  } catch (error) {
    handleError(error as Error, 'API/tour', 'updateTourDetail')
    const errorMessage: string = get(error, 'data.error.message', '') || JSON.stringify(error)
    throw new Error(errorMessage)
  }
}

export async function deleteTour(tourId: string): Promise<void> {
  try {
    await api.delete(`${TOUR_URL}/${tourId}`, {
      headers: auth(PLATFORM.CMS)
    })
  } catch (error) {
    handleError(error as Error, 'API/tour', 'deleteTour')
    const errorMessage: string = get(error, 'data.error.message', '') || JSON.stringify(error)
    throw new Error(errorMessage)
  }
}

export async function getVirtualTourPage(tourId: string, page: string): Promise<IVirtualTour> {
  try {
    const response = await api.get(`${TOUR_URL}/virtual-tour/${tourId}/${page}`)
    return response.data.metadata
  } catch (error) {
    handleError(error as Error, 'API/tour', 'getVirtualTourPage')
    const errorMessage: string = get(error, 'data.error.message', '') || JSON.stringify(error)
    throw new Error(errorMessage)
  }
}

export async function processVirtualTour(tourCode: string, page: string, data: {
  files: any[],
  images: string[]
}) {
  try {
    const formData = new FormData()
    data.files?.forEach((file: any) => {
      formData.append('files', file)
    });

    data.images?.forEach((image: string) => {
      formData.append('images', image)
    });

    const response = await api.post(`${VIRTUAL_TOUR_URL}/process/${tourCode}/${page}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.metadata
  } catch (error) {
    // handleError(error as Error, 'API/tour', 'processVirtualTour')
    const errorMessage: string = 'Data does not satify for process virtual tour'
    throw new Error(errorMessage)
  }
}