'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ArrowLeft, Copy, Wallet, CheckCircle, ExternalLink, Clock, X, RefreshCw, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { useCart } from '@/store/cart'
import { CurrencyCode, formatPrice } from '@/utils/helperfns'
import { CheckoutStep } from '@/app/checkout/checkoutContent'
import { toast } from 'sonner'
import Image from 'next/image'
import PayToAddress from './usdt-payment/pay-to-address'
import SelectPaymentMode from './usdt-payment/select-mode'
import MetamaskPayment from './usdt-payment/metmask-payment'

type UsdtPaymentProps = {
  setCurrentStep: (step: CheckoutStep) => void;
  copyToClipboard: (text: string) => void;
  currentStep: CheckoutStep
}

export type stepProps = 'selectMode'|'metamask'|'pay-to-address'
const logoWhite = process.env.NEXT_PUBLIC_LOGO_URL!;

const UsdtPayment = ({setCurrentStep, copyToClipboard, currentStep}: UsdtPaymentProps) => {
    const {getCartTotal, mainCcy, cart} = useCart()    
    const ccy = mainCcy()
    const cartTotal = getCartTotal();
    const [selectedChain, setSelectedChain] = useState<any | null>(null);
    const [checkoutData, setCheckoutData] = useState<any>(null);
    const [step,setStep] = useState<stepProps>('selectMode')
    // Load checkout data from sessionStorage
    useEffect(() => {
      const stored = sessionStorage.getItem('checkout');
      if (stored) {
        try {
          setCheckoutData(JSON.parse(stored));
        } catch (error) {
          console.error('Error parsing checkout data:', error);
          toast.error('Error loading checkout data');
        }
      }
    }, []);

    
   
    // Show loading if checkout data is not ready
    if (!checkoutData) {
      return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col lg:grid lg:grid-cols-2">
          <div className='bg-accent w-full flex-1 lg:h-screen p-4 text-white flex items-center justify-center'>
            <div className="text-center">
              <Clock className="w-8 h-8 mx-auto mb-4 animate-spin" />
              <p>Loading checkout data...</p>
            </div>
          </div>
          <div className='w-full flex-1 lg:h-screen p-4 flex items-center justify-center'>
            <p>Please wait...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen w-full bg-gray-50 flex flex-col lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:bottom-0 lg:w-screen lg:grid lg:grid-cols-2">
        {/* Left Panel - Payment Summary - Mobile: Show at top, Desktop: Left side */}
        <div className='relative bg-accent w-full p-4 text-white lg:h-screen'>
          <div className="absolute inset-0 bg-black/30 pointer-events-none lg:block hidden"></div>
          
          {/* Header with back button and logo */}
          <div className="flex items-center justify-between mb-4 relative z-10">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setCurrentStep('cart')}
              className="text-white hover:bg-white/10 p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <div className='flex items-center gap-2 bg-white/20 p-2 rounded-md'>
              <Image
                src={logoWhite}
                alt="Logo"
                width={100}
                height={100}
                unoptimized
                className="object-contain"
              />
              {/* <h2 className='text-lg lg:text-xl font-semibold'>Help2Pay</h2> */}
            </div>
          </div>

          {/* Payment info */}
          <div className='space-y-3 lg:space-y-4 relative z-10'>
            <p className="text-sm lg:text-lg text-white/70">Pay with Crypto</p>
            <p className='font-semibold text-xl lg:text-3xl'>
              {checkoutData?.payingAmount?.toFixed(2) || cartTotal.toFixed(2)} USDT
            </p>
          </div>

          {/* Cart items - Hide on mobile when chain is selected to save space */}
          <div className={`mt-4 lg:mt-8 relative z-10 ${selectedChain ? 'hidden lg:block' : ''}`}>
            <div className='space-y-2 lg:space-y-4 border-b border-white/20 pb-3 lg:pb-4'>
              {cart?.map((item) => (
                <div className='flex items-center justify-between text-sm lg:text-base' key={item.id}>
                  <p className="text-white/70 truncate pr-2">{item.name}</p>
                  <p className='font-semibold flex-shrink-0'>
                    {formatPrice(item?.salePrice, item?.ccy as CurrencyCode)}
                  </p>
                </div>
              ))}
            </div>

            <div className='flex items-center justify-between mt-3 lg:mt-4 pt-3 lg:pt-4'>
              <p className="text-sm lg:text-lg text-white/70">Total</p>
              <p className='font-semibold text-sm lg:text-lg'>
                {formatPrice(cartTotal, ccy as CurrencyCode)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Chain Selection or Payment Details */}
        <div className='flex-1 w-full p-4 lg:h-screen overflow-y-auto'>
              {step === 'selectMode' && <SelectPaymentMode
                setStep = {setStep}
              />}
              {step === 'pay-to-address' && <PayToAddress
                checkoutData={checkoutData}
                selectedChain={selectedChain}
                setSelectedChain={setSelectedChain}
                setStep= {setStep}
              />}
              {step === 'metamask' && <MetamaskPayment
                setStep = {setStep}
                checkoutData={checkoutData}
              />}
        </div>
      </div>
    )
}

export default UsdtPayment