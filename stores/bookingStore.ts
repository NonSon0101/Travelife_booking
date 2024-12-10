import { createBooking, getAllBookings, getBookingDetail, createBookNow, deleteBooking, getListBooking } from 'API/booking'
import { ICreateBooking, ICreateBookingForm, ICreateBookingRespone, IBookingInfoBody, IBookingDetail, IBooking } from 'interfaces/booking'
import { IAddToCart } from 'interfaces/cart'
import { IRequsetCheckoutReview } from 'interfaces/checkout'
import { makeAutoObservable } from 'mobx'
import RootStore from 'stores'

class BookingStore {
  rootStore: RootStore
  bookings: IBooking[] = []
  bookingList: IBookingInfoBody[] = []
  totalCount: number = 0
  totalResult: number = 0
  bookingDetail: IBookingDetail | null = null
  discountCode: string = ''
  listBooking: ICreateBooking | null = null
  bookingId: string = ''
  responeBookNow: IRequsetCheckoutReview | null = null
  currentCurrency: string =''
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  applyDiscount(discountCode: string) {
    this.discountCode = discountCode
  }

  setBookingId(bookingId: string) {
    this.bookingId = bookingId
  }

  async fetchAllBookings(page = 1): Promise<void> {
    const { bookings, total } = await getAllBookings(`?page=${page}&limit=10`)
    this.bookings = bookings
    this.totalCount = total
  }

  async fetchListBooking(page = 1): Promise<void> {
    const { bookings, total } = await getListBooking(`list?page=${page}&limit=4`)
    this.bookingList = bookings
    this.totalResult = total
  }


  async fetchBookingDetail(bookingId = ''): Promise<void> {
    const booking = await getBookingDetail(bookingId)
    this.bookingDetail = booking
    this.currentCurrency = booking.bookingItems[0].participants[0].currency ?? ''
  }

  async createBooking(data: ICreateBookingForm): Promise<void> {
    const { booking } = await createBooking(data);
    this.listBooking = booking
  }

  async createBookNow(data: IAddToCart): Promise<void> {
    const bookNow = await createBookNow(data)
    this.responeBookNow = bookNow
  }

  async deleteBooking(bookingId: string): Promise<void> {
    await deleteBooking(bookingId)
  }
}

export default BookingStore
