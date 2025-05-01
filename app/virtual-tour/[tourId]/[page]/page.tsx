'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

const VirtualTourPage = dynamic(() => import('pages/VirtualTourPage'), {
  ssr: false,
});

const VirtualTour = ({
    params,
  }: {
    params: { tourId: string; page: string }
  }) => {
    const {tourId, page} = params
    const searchParams = useSearchParams();

    return (
      <VirtualTourPage
        tourId={tourId}
        page={page}
      />
    );
}

export default VirtualTour