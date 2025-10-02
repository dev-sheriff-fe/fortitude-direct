'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Wallet, Bot, CheckCircle, Copy,AlertCircle, TrendingUp, ArrowLeft } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import { useCart } from '@/store/cart';
import { useForm } from 'react-hook-form';
import CartView from '@/components/checkout/cart-view';
import UsdtPayment from '@/components/checkout/usdt-payment';
import CardPayment from '@/components/checkout/card-payment';
import BNPL from '@/components/checkout/bnpl';
import BNPLApproved from '@/components/checkout/bnpl-approved';
import BankPayment from '@/components/checkout/bank-payment';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import EscrowCheckout from '@/components/checkout/tron-payment';
import axiosCustomer from '@/utils/fetch-function-customer';
import BnplManager from '@/components/checkout/bnpl_checkout/bnpl-manager';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export type PaymentMethod = 'card' | 'crypto_token' | 'bnpl' | 'bank_transfer' | 'tron' | null;
export type CheckoutStep = 'cart' | 'payment' | 'processing' | 'success' | 'info';
export type BNPLStep = 'registration' | 'scoring' | 'approved' | 'rejected'

export interface CreditScoreData {
  incomeStability: number;
  digitalPaymentHistory: number;
  ecommerceHistory: number;
  creatorIncome: number;
  identityConsistency: number;
  onchainWallet: number;
  behavioralScoring: number;
  socialPresence: number;
  employerVerification: number;
  totalScore: number;
  tier: 'A' | 'B' | 'C';
  limit: number;
  installments: number;
}

const formSchema = z.object({
  shippingMethod: z.enum(["delivery", "pickup"]).default("delivery")?.optional(),
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
  country: z.string().min(1, "Please select a country"),
  addressType: z.string().min(1, "Please select address type").optional(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  street: z.string().optional(),
  selectedAddressId: z.number(),
  landmark: z.string().optional(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

export type FormData = z.infer<typeof formSchema>;


const CheckoutContent = () => {
  const { getCartTotal, usdTotal } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('info');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [usdtPaid, setUsdtPaid] = useState(false);
  const [checkoutData,setCheckoutData] = useState(null)
  const form = useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        shippingMethod: "delivery",
        fullName: "",
        country: "",
        city: "",
        state: "",
        zipCode: "",
        agreeTerms: false,
      },
    });

   const searchParams = useSearchParams()
      const storeCode = searchParams.get('storeCode') || ''
      console.log(storeCode);
      
  
  const { toast } = useToast();


  useEffect(() => {
    const stored = sessionStorage.getItem('checkout');
    if (stored) {
      setCheckoutData(JSON.parse(stored));
    }
  }, []);

  console.log(checkoutData);
  

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
    setCurrentStep('payment');
  };



  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    });
  };


  const PaymentView = () => {
    if (selectedPayment == 'crypto_token') {
      return (
        <Suspense>
          <UsdtPayment
        copyToClipboard={copyToClipboard}
        setCurrentStep={setCurrentStep}
        currentStep={currentStep}
        />
        </Suspense>
      );
    }

    // if (selectedPayment === 'card') {
    //   return (
    //     <CardPayment
    //       setCurrentStep={setCurrentStep}
    //       setSelectedPayment={setSelectedPayment}
    //     />
    //   );
    // }

    console.log(selectedPayment);
    
    // if (selectedPayment === 'bnpl') {
    //   return (
    //     <div className='h-screen'>
    //       {/* <button className='' onClick={()=>setCurrentStep('cart')}>
    //         <ArrowLeft/>
    //       </button> */}
    //       <BnplManager
    //         setCurrentStep= {setCurrentStep}
    //         form = {form}
    //       />
    //   </div>
    //   )     
    // }


    if (selectedPayment == 'bank_transfer') {
      return (
        <BankPayment
          setCurrentStep={setCurrentStep}
          copyToClipboard={copyToClipboard}
        />
      );
    }

    return null;
  };

  const ProcessingView = () => (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="animate-spin text-6xl">⚡</div>
      <div>
        <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
        <p className="text-muted-foreground">Waiting for blockchain confirmation...</p>
      </div>
      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm">Expected confirmation: ~3 seconds</p>
      </div>
    </div>
  );

  

  return (
    
      <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto py-8">
        {currentStep === 'info' && <BnplManager setCurrentStep={setCurrentStep} form={form}/>}
        {currentStep === 'cart' && <CartView 
        handlePaymentSelect={handlePaymentSelect} 
        setCurrentStep = {setCurrentStep}
        paymentMethod = {selectedPayment}
        setSelectedPayment = {setSelectedPayment}
        form = {form}
        />}
        {currentStep === 'payment' && <PaymentView />}
        {currentStep === 'processing' && <ProcessingView />}
        
      </div>
    </div>
    
  );
};

export default CheckoutContent;

