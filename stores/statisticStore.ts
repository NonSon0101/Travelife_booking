
import { getRevenue} from 'API/statistic'
import { IRevenue } from 'interfaces/statistics'
import { makeAutoObservable } from 'mobx'
import RootStore from 'stores'

class StatisticsStore {
  rootStore: RootStore
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  revenues: IRevenue[] = []

  async fetchRevenue(filter = ''): Promise<void> {
    const {metadata} = await getRevenue(filter)
    this.revenues = metadata
  }
}

export default StatisticsStore