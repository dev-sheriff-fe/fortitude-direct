'use client'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, Clock } from 'lucide-react'
import { useCart } from '@/store/cart'
import { CheckoutStep, FormData } from '@/app/checkout/checkoutContent'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import axiosCustomer from '@/utils/fetch-function-customer'
import PaymentHeader from './usdt-payment/payment-header'
import NetworkSelector from './usdt-payment/network-selector'
import PaymentMethodSelector from './usdt-payment/payment-method-selector'
import DirectTransferFlow from './usdt-payment/directTransferFlow'
import MetaMaskFlow from './usdt-payment/metamask-flow'
import { UseFormReturn } from 'react-hook-form'
import AlgorandTransfer from './usdt-payment/algorandTransfer'

type UsdtPaymentProps = {
  setCurrentStep: (step: CheckoutStep) => void;
  currentStep: CheckoutStep,
  wallets?: any[];
  form?: UseFormReturn<FormData>;
  orderTotal: number;
  checkoutData: any
}

export type PaymentStatus = "pending" | "checking" | "confirmed" | "failed" | 'idle'

const UsdtPayment = ({ setCurrentStep, currentStep, wallets, form, orderTotal,checkoutData }: UsdtPaymentProps) => {
  const { getCartTotal, mainCcy, cart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<"direct" | "metamask" | "algorand">("direct")
  const [selectedNetwork, setSelectedNetwork] = useState<any | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle")
  const { data } = useQuery({
    queryKey: ['chain-list'],
    queryFn: () => axiosCustomer.request({
      url: `/coinwallet/chains`,
      method: 'GET'
    })
  })

  console.log(data?.data);

  const payingAmount = orderTotal || checkoutData?.payingAmount || getCartTotal();

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
    <div className="min-h-screen w-full">
      <div className='flex items-center gap-x-3'>
        <button onClick={() => setCurrentStep('cart')}><ArrowLeft /></button>
        <h1 className='text-2xl lg:text-3xl font-bold'>Pay with crypto</h1>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-12 lg:py-16">
        <PaymentHeader
          amount={payingAmount?.toFixed(2) || null}
          orderNo={checkoutData?.orderNo}
          currency= {checkoutData?.payingCurrency}
        />
        <div className={`${paymentStatus === 'pending' || paymentMethod === 'algorand' && ('pointer-events-none opacity-15')}`}>
          <NetworkSelector
            selectedNetwork={selectedNetwork}
            onNetworkChange={setSelectedNetwork}
            networks={data?.data?.list}
            wallets={wallets}
          />
        </div>

        <div className={`${paymentStatus === 'pending' && 'pointer-events-none opacity-15'}`}>
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onMethodChange={setPaymentMethod}
          />
        </div>

        {/* Payment flows */}
        <div className="mt-8">
          {paymentMethod === "direct" ? (
            <DirectTransferFlow
              amount={payingAmount}
              selectedNetwork={selectedNetwork}
              orderNo={checkoutData?.orderNo}
              form={form}
              paymentStatus={paymentStatus}
              setPaymentStatus={setPaymentStatus}
            />
          )
            : paymentMethod === 'metamask'
              ?
              (
                <MetaMaskFlow
                  amount={payingAmount}
                  recipientAddress={selectedNetwork?.publicAddress}
                  orderNo={checkoutData?.orderNo}
                  network={selectedNetwork?.chain}
                  form={form}
                  paymentStatus={paymentStatus}
                  setPaymentStatus={setPaymentStatus}
                />
              )
              :
              <AlgorandTransfer
                amount={payingAmount}
                orderNo={checkoutData?.orderNo}
              />
          }
        </div>
      </div>
    </div>
  )
}

export default UsdtPayment