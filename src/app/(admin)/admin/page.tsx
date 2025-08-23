'use client'
import TransactionHistory from '@/components/Admin/dashboard/recent-transaction'
import { WalletOverview } from '@/components/Admin/dashboard/wallet-overview'
import useUser from '@/store/userStore'
import dynamic from 'next/dynamic'
import React from 'react'

// const WalletOverview = dynamic(() => import('@/components/Admin/dashboard/wallet-overview' as any),{
//   ssr: true
// })
const AdminDashboard = () => {
  const {user} = useUser()
  console.log(user);
  
  return (
    <>
        <WalletOverview/>
        <TransactionHistory/>
    </>
  )
}

export default AdminDashboard