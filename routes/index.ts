import VirtualTour from 'app/virtual-tour/[tourCode]/[page]/page'
import cmsRoutes from './cms'

const routes = {
  home: {
    value: '/'
  },
  about: {
    value: '/about'
  },
  notfoundpage: {
    value: '/404'
  },
  detail: {
    value: (tourId: string) => `/tour-detail/${tourId}`,
  },
  myProfile: {
    value: '/my-profile'
  },
  cart: {
    value: '/cart'
  },
  booking: {
    activity: "/booking/activity",
    contact: "/booking/contact",
    payment: "/booking/payment",
    view:  "/booking/view",
    detail: (bookingId: string) => `/booking/${bookingId}`
  },
  listtour: {
    value: (locId: string) => `/list-tour/${locId}`,
  },
  allActivities: {
    value: "/all-activities"
  },
  virtualTour: {
    value: (tourCode: string, page: string) => `/virtual-tour/${tourCode}/${page}`,
  },
  ...cmsRoutes
}

export default routes
