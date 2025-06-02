import api, { auth, handleError } from 'API'
import { PLATFORM } from 'enums/common'
import { IRevenues } from 'interfaces/statistics'
import get from 'lodash/get'

const STATISTIC_URL = '/api/v1/statistics'

export async function getRevenue(startDate = '', endDate = ''): Promise<IRevenues> {
  try {
    const response = await api.get(`${STATISTIC_URL}/revenue?startDate=${startDate}&endDate=${endDate}&period=month`, {
      headers: auth(PLATFORM.CMS)
    })
    return response.data
  } catch (error) {
    handleError(error as Error, 'API/statistic', 'getRevenue')
    const errorMessage: string = get(error, 'data.error.message', '') || JSON.stringify(error)
    throw new Error(errorMessage)
  }
}

export async function getTopBookedTour(numOfTours = 5) {
  try {
    const response = await api.get(`${STATISTIC_URL}/top-booked-tours?numOfTours=${numOfTours}`, {
      headers: auth(PLATFORM.CMS)
    })
    return response.data
  } catch (error) {
    handleError(error as Error, 'API/statistic', 'getTopBookedTour')
    const errorMessage: string = get(error, 'data.error.message', '') || JSON.stringify(error)
    throw new Error(errorMessage)
  }
}

export async function getTotalRevenue() {


}

