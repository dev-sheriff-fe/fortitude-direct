import React, { Suspense } from 'react'
import LivenessCheckPage from './liveness-content'

const Liveness = () => {
  return (
    <>
    <Suspense>
      <LivenessCheckPage/>
    </Suspense>
    </>
  )
}

export default Liveness