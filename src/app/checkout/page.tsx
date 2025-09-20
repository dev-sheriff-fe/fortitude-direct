import React, { Suspense } from 'react'
import CheckoutContent from './checkoutContent'
import PrivateRoute from '@/utils/private-route-customer'
import { Metadata } from 'next'

export const metadata: Metadata ={
  title: 'Checkout'
}

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