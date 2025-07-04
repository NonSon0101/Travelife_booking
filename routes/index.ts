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
    payment: (bookingId: string) =>  `/booking/payment/${bookingId}`,
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
    value: (tourId: string, page: string) => `/virtual-tour/${tourId}/${page}`,
  },
  ...cmsRoutes
}

export default routes
