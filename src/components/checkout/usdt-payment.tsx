'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { ArrowLeft, Copy, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { useCart } from '@/store/cart'
import { CheckoutStep } from '@/app/checkout/page'
import { useToast } from '@/app/hooks/use-toast'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/utils/fetch-function'
import QrCode from 'react-qr-code'
import { useRouter, useSearchParams } from 'next/navigation'
import { CurrencyCode, formatPrice } from '@/utils/helperfns'

type UsdtPaymentProps = {
    setCurrentStep: (step: CheckoutStep) => void;
    copyToClipboard: (text: string) => void;
    currentStep: CheckoutStep
}
const UsdtPayment = ({setCurrentStep, copyToClipboard,currentStep}: UsdtPaymentProps) => {
    const {getCartTotal,mainCcy} = useCart()
    const searchParams = useSearchParams()
    const storeCode = searchParams.get('storeCode') || ''
    const ccy = mainCcy()
  const cartTotal = getCartTotal();
  const {toast} = useToast()
   const handleUSDTPayment = () => {
    setCurrentStep('processing');
    // Simulate blockchain confirmation
    setTimeout(() => {
      setCurrentStep('success');
      toast({
        title: "Payment Confirmed",
        description: "USDT payment successful on TRON network",
      });
    }, 3000);
  };

  const {data,error,isLoading} = useQuery({
    queryKey: ['usdtPayment',currentStep],
    queryFn: ()=>axiosInstance.request({
      url: '/store/wallet-details',
      method: 'GET',
      params: {
        storeCode,
        entityCode: 'H2P'
      },
    }).then(res => res.data),
  })



  const info = data?.coinAddresses[0]

  console.log(info);
  


  
  return (
    <div className="max-w-md mx-auto space-y-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setCurrentStep('cart')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-2xl font-bold">USDT Payment</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Send USDT (TRC-20)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* QR Code Placeholder */}
              <div className="bg-muted p-8 rounded-lg text-center flex flex-col items-center">
                {
                  isLoading ? (<div className="animate-pulse">Loading...</div>) : (
                    <QrCode
                      value={info?.publicAddress}
                      className='w-40 h-30'
                    />
                  )
                }
                <p className="text-sm text-muted-foreground">Scan QR Code with your wallet</p>
              </div>

              {/* Payment Details */}
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">AMOUNT</Label>
                  <p className="text-2xl font-bold">{isLoading?<div className='w-full bg-gray-100 h-6 rounded-sm animate-pulse'/>: `USDT ${data?.totalAmount}`}</p>
                  <p className="text-sm text-muted-foreground">≈ {formatPrice(cartTotal,ccy as CurrencyCode)}</p>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">USDT ADDRESS</Label>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <code className="text-xs flex-1 break-all">
                      {isLoading? <div className='animate-pulse'>loading..</div>:info?.publicAddress}
                    </code>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(info?.publicAddress || '')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                  <strong>Gas Fee:</strong> {info?.message}
                </div>
              </div>

              <Button 
                onClick={handleUSDTPayment}
                className="w-full bg-accent"
                size="lg"
              >
                I&apos;ve Sent the Payment
              </Button>
            </CardContent>
          </Card>
        </div>
  )
}

export default UsdtPayment