'use client'
import React, { useState } from 'react'
import TransactionsFilter from './transactions-filter'
import { useQuery } from '@tanstack/react-query'
import axiosCustomer from '@/utils/fetch-function-customer'
import TransactionsList from './transactions-list'

const TransactionsManager = () => {
   
  const { data, isLoading, error } = useQuery({
      queryKey: ['customer-recent-trans'],
      queryFn: () => axiosCustomer.request({
        url: '/customer-dashboard/fetchRecentTrans',
        method: 'GET',
        // params: {
        //   storeCode: "STO445",
        //   entityCode: customer?.entityCode
        // }
      })
    });
  return (
    <main className='space-y-5'>
        <div>
            <h1 className='font-bold text-xl md:text-2xl'>Transactions</h1>
            <p className='text-sm text-gray-600'>Accurate tracking for your transactions</p>
        </div>

        <TransactionsFilter/>

        <TransactionsList
         data={data?.data?.transactions}
        />
    </main>
  )
}

export default TransactionsManager