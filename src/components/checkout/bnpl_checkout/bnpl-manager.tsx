import React from 'react'
import { ShippingForm } from './shipping-form'
import { CartReview } from './cart-review'
import { CheckoutStep } from '@/app/checkout/checkoutContent'

const BnplManager = ({setCurrentStep}: {setCurrentStep:(currentStep:CheckoutStep)=>void}) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Left Column - Shipping Form */}
          <div className="lg:pr-8">
            <ShippingForm 
                setCurrentStep = {setCurrentStep}
            />
          </div>
          
          {/* Right Column - Cart Review */}
          <div className="lg:pl-8 lg:border-l border-border">
            <CartReview />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BnplManager