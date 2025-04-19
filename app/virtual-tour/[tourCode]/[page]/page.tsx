'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

const VirtualTourPage = dynamic(() => import('pages/VirtualTourPage'), {
  ssr: false,
});

const VirtualTour = ({
    params,
  }: {
    params: { tourCode: string; page: string }
  }) => {
    const {tourCode, page} = params
    const searchParams = useSearchParams();
    const url_image = searchParams ? searchParams.get('url_image') || null : null;

    return (
      <VirtualTourPage
        tourCode={tourCode}
        page={page}
        processedImage={url_image}
      />
    );
}

export default VirtualTour