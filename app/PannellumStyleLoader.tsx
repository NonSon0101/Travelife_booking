'use client';

import { useEffect } from 'react';

export default function PannellumStyleLoader() {
  useEffect(() => {
    require('pannellum-react/lib/pannellum/css/pannellum.css');
  }, []);

  return null;
}
