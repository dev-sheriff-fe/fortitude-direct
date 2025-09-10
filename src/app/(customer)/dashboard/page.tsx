'use client'

import OrderHistory from '@/components/Customer/dashboard/recent-orders'
import TransactionHistory from '@/components/Customer/dashboard/recent-transactions'
import { WalletOverview } from '@/components/Customer/dashboard/wallet-overview'
import React from 'react'

// const WalletOverview = dynamic(() => import('@/components/Admin/dashboard/wallet-overview' as any),{
//   ssr: true
// })
const CustomerDashboard = () => {

  return (
    <>
      <WalletOverview />
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6'>
        <TransactionHistory />
        <OrderHistory />
      </div>
    </>
  )
}

export default CustomerDashboard