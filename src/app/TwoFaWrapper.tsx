'use client'
import useCustomer from '@/store/customerStore'
import { useRouter } from 'next/navigation'
import React, { ReactNode, useEffect } from 'react'

const TwoFaWrapper = ({children}: {children:ReactNode}) => {
    const {customer} = useCustomer()
    const router = useRouter()
    
    useEffect(()=>{
      if (customer && customer?.twoFaSetupRequired === 'Y') {
     router?.replace('/twofa_setup')
  }
    return
    },[router])

    
    
  return children
}

export default TwoFaWrapper