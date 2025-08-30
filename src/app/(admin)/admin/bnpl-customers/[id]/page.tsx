import CustomerDetailScreen from '@/components/Admin/dashboard/bnpl-customers/customer-details'
import React, { Suspense } from 'react'

const CustomerDetails = () => {
  return (
    <Suspense>
      <CustomerDetailScreen/>
    </Suspense>
  )
}

export default CustomerDetails