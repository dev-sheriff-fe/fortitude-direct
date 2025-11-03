'use client'
import React, { useState } from 'react'
import TransactionsFilter from './transactions-filter'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/utils/fetch-function';
import TransactionsList from './transactions-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useUser from '@/store/userStore';

const TransactionsManager = () => {
  const { user } = useUser();
  const { data, isLoading, error } = useQuery({
    queryKey: ['fetch-trans'],
    queryFn: () => axiosInstance.request({
      url: '/store-dashboard/fetchRecentTrans',
      method: 'GET',
      params: {
        storeCode: user?.storeCode,
        entityCode: user?.entityCode
      }
    })
  });

  const transactions = data?.data?.transactions || [];

  return (
    <main className='space-y-5'>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Transactions
            </h1>
            <p className="text-muted-foreground">
              Accurate tracking for your transactions
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
          <p className="text-sm text-muted-foreground">Total Transactions</p>
        </div>
      </div>

      <TransactionsFilter />

      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base lg:text-lg font-semibold text-gray-900">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-red-500">Error loading transactions</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">No transactions found</p>
            </div>
          ) : (
            <TransactionsList data={transactions} />
          )}
        </CardContent>
      </Card>
    </main>
  )
}

export default TransactionsManager