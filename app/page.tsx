'use client';

import HomePage from 'pages/HomePage'
import { Suspense } from 'react'

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <HomePage />
      </Suspense>
    </main>
  )
}
