import React, { Suspense } from 'react'
import CheckoutContent from './checkoutContent'
import PrivateRoute from '@/utils/private-route-customer'

const Checkout = () => {
  return (
    <>
      <Suspense>
        <PrivateRoute requiredPermissions={['CUSTOMER']} fallbackPath='/'>
          <CheckoutContent/>
        </PrivateRoute>
      </Suspense>
    </>
  )
}

export default Checkout