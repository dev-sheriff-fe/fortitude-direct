import React, { useEffect, useState } from 'react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import useCustomer from '@/store/customerStore'
import { useCart } from '@/store/cart'
import { UseFormReturn } from 'react-hook-form'
import { FormData, PaymentMethod } from '@/app/checkout/checkoutContent'
import { useLocationStore } from '@/store/locationStore'
import { getCurrentDate } from '@/utils/helperfns'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import axiosCustomer from '@/utils/fetch-function-customer'
import BnplChainSelector from './bnpl-chain-selector'


interface CardAlertProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  form: UseFormReturn<FormData>;
  paymentMethod: PaymentMethod;
  networks?: any[];
  wallets?: any[];
}

const CardAlert = ({
  modalOpen,
  setModalOpen,
  form,
  paymentMethod,
  networks = [],
  wallets = []
}: CardAlertProps) => {
  const { cart } = useCart()
  const { customer } = useCustomer()
  const { getValues } = form
  const { location } = useLocationStore()
  const currentDate = getCurrentDate()
  const [checkoutData, setCheckoutData] = useState<any>(null)
  const [showBnplSelector, setShowBnplSelector] = useState(false)
  const [bnplPaymentData, setBnplPaymentData] = useState<any>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('checkout');
    if (stored) {
      setCheckoutData(JSON.parse(stored));
    }
  }, []);

  // Show BNPL selector when modal opens and payment method is BNPL
  useEffect(() => {
    if (modalOpen && paymentMethod === 'bnpl') {
      setShowBnplSelector(true);
    }
  }, [modalOpen, paymentMethod]);

  const { isPending, mutate, data } = useMutation({
    mutationFn: (data: any) => axiosCustomer({
      url: '/ecommerce/submit-order',
      method: 'POST',
      data
    }),
    onSuccess: (data) => {
      if (data?.data?.responseCode !== '000') {
        toast?.error(data?.data?.responseMessage)
        return
      }
      toast?.success(data?.data?.responseMessage)
      setModalOpen(false)
      setShowBnplSelector(false)
      setBnplPaymentData(null)
      
      if (paymentMethod === 'card' && data?.data?.paymentLinkUrl) {
        window.open(data?.data?.paymentLinkUrl, '_blank')
        return
      }
    },
    onError: (error) => {
      toast.error('Something went wrong!')
    }
  })

  const buildOrderPayload = (bnplData?: any) => {
    const orderItems = cart.map(item => ({
      itemCode: item?.code,
      itemName: item?.name,
      price: item?.salePrice,
      quantity: item?.quantity,
      amount: item?.subTotal,
      discount: 0,
      picture: item?.picture,
    }))

    const payload = {
      channel: "WEB",
      cartId: checkoutData?.orderNo,
      orderDate: currentDate,
      totalAmount: paymentMethod === 'bnpl' || paymentMethod === 'crypto_token' 
        ? checkoutData?.payingAmount 
        : checkoutData?.totalAmount,
      totalDiscount: 0,
      deliveryOption: getValues('shippingMethod'),
      paymentMethod: paymentMethod?.toUpperCase(),
      couponCode: "",
      ccy: paymentMethod === 'bnpl' || paymentMethod === 'crypto_token' 
        ? checkoutData?.payingCurrency 
        : checkoutData?.ccy,
      deliveryFee: 0,
      geolocation: location ? `${location?.latitude}, ${location?.longitude}` : '',
      deviceId: customer?.deviceID,
      orderSatus: "",
      paymentStatus: "",
      storeCode: customer?.storeCode || process.env.NEXT_PUBLIC_STORE_CODE,
      customerName: customer?.fullname,
      username: customer?.username,
      deliveryAddress: {
        id: getValues('selectedAddressId') || 0,
        street: getValues('street'),
        landmark: getValues('landmark'),
        postCode: getValues('zipCode'),
        city: getValues('city'),
        state: getValues('state'),
        country: getValues('country'),
        addressType: getValues('addressType') || 'WAREHOUSE'
      },
      cartItems: orderItems
    }

    // Add BNPL-specific fields if provided
    if (bnplData && paymentMethod === 'bnpl') {
      return {
        ...payload,
        networkChain: bnplData.networkChain,
        publicAddress: bnplData.publicAddress,
        tokenSymbol: bnplData.tokenSymbol
      }
    }

    // if (paymentMethod === 'crypto_token') {
    //   return {
    //     ...payload,
    //     networkChain: 'TRON',
    //     publicAddress: 'TZGTKTChA62a1wWNa3DrZ4U8wSUaYVv3y9',
    //     tokenSymbol: 'USDT'
    //   }
    // }

    return payload
  }

  const onSubmit = () => {
    const payload = buildOrderPayload()
    mutate(payload)
  }

  const onBnplConfirm = (bnplData: any) => {
    setBnplPaymentData(bnplData)
    const payload = buildOrderPayload(bnplData)
    mutate(payload)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setShowBnplSelector(false)
    setBnplPaymentData(null)
  }

  // Render BNPL selector for BNPL payment method
  if (paymentMethod === 'bnpl') {
    return (
      <BnplChainSelector
        modalOpen={showBnplSelector}
        setModalOpen={handleModalClose}
        networks={networks}
        wallets={wallets}
        onConfirm={onBnplConfirm}
        isPending={isPending}
      />
    )
  }

  // Render simple confirmation for card payment
  return (
    <AlertDialog onOpenChange={handleModalClose} open={modalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
          <AlertDialogDescription>
            Proceed with card payment?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            className='bg-accent text-white p-2 text-sm rounded-md'
            onClick={onSubmit}
            disabled={isPending}
          >
            {isPending ? 'Please wait..' : 'Make Payment'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CardAlert