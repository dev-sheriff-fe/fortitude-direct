import React, { Suspense } from 'react'
import Home from './page-content'

const page = () => {
  return (
    <Suspense>
      <Home/>
    </Suspense>
  )
}

export default page