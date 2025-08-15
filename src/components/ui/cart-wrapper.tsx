'use client'
import React, { ReactNode } from 'react'
import { Sheet } from './sheet'

const CartWrappper = ({children}:{children:ReactNode}) => {
  return (
    <Sheet>
        {children}
    </Sheet>
  )
}

export default CartWrappper