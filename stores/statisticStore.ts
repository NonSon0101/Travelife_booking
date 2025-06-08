
import { getRevenue, getTopBookedTour, getTotalRevenue, getCurrentProfit, getTotalUsers} from 'API/statistic'
import { ICurrentProfit, IRevenue, ITopBookedTour } from 'interfaces/statistics'
import { makeAutoObservable } from 'mobx'
import RootStore from 'stores'

class StatisticsStore {
  rootStore: RootStore
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  revenues: IRevenue[] = []
  bookedTour: ITopBookedTour[] = []
  currentProfit: ICurrentProfit = {
    currentRevenue: 0,
    previousRevenue: 0,
    profitPercentage: 0
  }
  totalRevenue: number = 0
  totalUsers: number = 0

  async fetchRevenue(startDate = '', endDate = ''): Promise<void> {
    const {metadata} = await getRevenue(startDate, endDate)
    this.revenues = metadata
  }

  async fetchBookedTour(numOfTours = 5): Promise<void> {
    const {metadata} = await getTopBookedTour(numOfTours)
    this.bookedTour = metadata
  }

  async fetchTotalRevenue(): Promise<void> {
    const {metadata} = await getTotalRevenue()
    this.totalRevenue = metadata.total
  }

  async fetchCurrentProfit(month: string): Promise<void> {
    const {metadata} = await getCurrentProfit(month)
    this.currentProfit = {
      currentRevenue: metadata.currentRevenue,
      previousRevenue: metadata.previousRevenue,
      profitPercentage: metadata.profitPercentage
    }
  }

  async fetchTotalUsers(): Promise<void> {
    const {metadata} = await getTotalUsers()
    this.totalUsers = metadata.total
  }
}

export default StatisticsStore