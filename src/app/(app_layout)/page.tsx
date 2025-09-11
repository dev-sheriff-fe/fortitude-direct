'use client'
import Loader from '@/components/ui/loader'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import HomePageH2P from '../../../h2p-app/page'
import HomePageFortitiude from '../../../fortitude-app/homepage'
// import HomeFortitude from '../../../fortitude-app/page'
import { useLocationStore } from '@/store/locationStore'

const Home = dynamic(() => import('./page-content'), {
  ssr: false,
  loading: () => <Loader text='Loading home page...' />
})

const HomePage = () => {
  const {location} = useLocationStore()
  console.log(location);
  
  if (process?.env?.NEXT_PUBLIC_STORE_FRONT === 'h2p'){
    return <HomePageH2P/>
  }

  if (process?.env?.NEXT_PUBLIC_STORE_FRONT === 'fortitude'){
    return <HomePageFortitiude/>
  }

}

export default HomePage