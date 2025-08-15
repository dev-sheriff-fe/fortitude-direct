'use client'

import axiosInstance from '@/utils/fetch-function'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export const useCategories = () => {
    const {data,isLoading,error} = useQuery({
        queryKey: ['categories'],
        queryFn: ()=>axiosInstance.request({
           url: '/ecommerce/products/categories',
            params: {
            name: "",
            entityCode: "H2P",
            category: '',
            tag: '',
            pageNumber: 1,
            pageSize: 200
        }
        })
    })

    return {data:data?.data, isLoading, error}
}

