'use client'

import axiosInstance from '@/utils/fetch-function'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export const useCategories = () => {
    const {data,isLoading,error} = useQuery({
        queryKey: ['categories'],
        queryFn: ()=>axiosInstance.request({
            url: `/categories`,
            method: 'GET',
            params: {
                searchJoin: 'and',
                limit: 1000,
                language: 'en',
                parent: null,
                search: 'type.slug:gadget'
            }
        })
    })

    return {data:data?.data, isLoading, error}
}

