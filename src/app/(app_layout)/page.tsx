'use client'
import Loader from '@/components/ui/loader'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import HomePageH2P from '../../../h2p-app/page'
import HomePageFortitiude from '../../../fortitude-app/homepage'
import { useLocationStore } from '@/store/locationStore'

const HomePage = () => {
  const { location } = useLocationStore()
  console.log(location);

  if (process?.env?.NEXT_PUBLIC_STORE_FRONT === 'fortitude') {
    return <Suspense><HomePageFortitiude /></Suspense>
  }

  if (process?.env?.NEXT_PUBLIC_STORE_FRONT === 'h2p') {
    return <Suspense><HomePageH2P /></Suspense>
  }

  return <Suspense><HomePageFortitiude /></Suspense>

}

export default HomePage