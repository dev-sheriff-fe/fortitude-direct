'use client'
import TransactionHistory from '@/components/Admin/dashboard/recent-transactions'
import OrderHistory from '@/components/Admin/dashboard/recent-orders'
import { WalletOverview } from '@/components/Admin/dashboard/wallet-overview'
import React from 'react'

// const WalletOverview = dynamic(() => import('@/components/Admin/dashboard/wallet-overview' as any),{
//   ssr: true
// })
const AdminDashboard = () => {

  
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

export default AdminDashboard