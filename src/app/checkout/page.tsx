import React, { Suspense } from 'react'
import CheckoutContent from './checkoutContent'

const Checkout = () => {
  return (
    <>
      <Suspense>
        <CheckoutContent/>
      </Suspense>
    </>
  )
}

export default Checkout