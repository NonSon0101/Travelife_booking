
import { getRevenue, getTopBookedTour} from 'API/statistic'
import { IRevenue, ITopBookedTour } from 'interfaces/statistics'
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

  async fetchRevenue(startDate = '', endDate = ''): Promise<void> {
    const {metadata} = await getRevenue(startDate, endDate)
    this.revenues = metadata
  }

  async fetchBookedTour(numOfTours = 5): Promise<void> {
    const {metadata} = await getTopBookedTour(numOfTours)
    this.bookedTour = metadata
  }
}

export default StatisticsStore