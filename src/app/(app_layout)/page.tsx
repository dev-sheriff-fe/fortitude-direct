'use client'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Home = dynamic(() => import('./page-content'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

const HomePage = () => {
  return <Suspense>
    <Home />
  </Suspense>
}

export default HomePage