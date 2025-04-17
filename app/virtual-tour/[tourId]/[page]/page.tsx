import VirtualTourPage from 'pages/VirtualTourPage'

const VirtualTour = ({
    params,
  }: {
    params: { tourId: string; page: string }
  }) => {
    const {tourId, page} = params
    return (
        <VirtualTourPage
            tourId={tourId}
            page={page}
        />
    )
}

export default VirtualTour