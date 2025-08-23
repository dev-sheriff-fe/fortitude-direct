import React, { Suspense } from 'react'
import Home from './page-content'

const HomePage  = () => {
  return (
    <Suspense>
      <Home/>
    </Suspense>
  )
}

export default HomePage 