'use client'
import dynamic from 'next/dynamic'

const Home = dynamic(() => import('./page-content'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

const HomePage = () => {
  return <Home />
}

export default HomePage