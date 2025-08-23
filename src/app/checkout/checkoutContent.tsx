'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Wallet, Bot, CheckCircle, Copy,AlertCircle, TrendingUp } from 'lucide-react';
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

export type PaymentMethod = 'card' | 'usdt' | 'bnpl' | 'bank' | 'tron' | null;
export type CheckoutStep = 'cart' | 'payment' | 'processing' | 'success';
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

interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  employer: string;
  jobTitle: string;
  monthlyIncome: string;
  linkedinUrl: string;
  employerEmail: string;
  hasExistingCredit: string;
  nationality: string;
  bvn?: string;
  nin?: string;
  payslip?: File | null;
  bankStatement?: File | null;
  utilityBill?: File | null;
  livenessCompleted?: boolean;
}

const CheckoutContent = () => {
  const { getCartTotal, usdTotal } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [usdtPaid, setUsdtPaid] = useState(false);
  const [bnplStep, setBnplStep] = useState<BNPLStep>('registration');
  const [creditScore, setCreditScore] = useState<CreditScoreData | null>(null);
  const [score,setScore] = useState(null)
  const [checkoutData,setCheckoutData] = useState(null)

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
  
  // Calculate values based on cart
  const cartTotal = getCartTotal();
  const usdtEquivalent = cartTotal; // 1:1 for simplicity
  const estimatedSavings = cartTotal * 0.018; // 1.8% savings
  const txHash = "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890";

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
    setCurrentStep('payment');
  };


  const {data} = useQuery({
    queryKey: ['fetch-details'],
    queryFn: () =>axiosInstance.request({
      url:'/payment-methods/fetch',
      method:'GET'
    })
  })

console.log(data);

// console.log(usdTotal());



  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    });
  };


  const PaymentView = () => {
    if (selectedPayment === 'usdt') {
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

    if (selectedPayment === 'card') {
      return (
        <CardPayment
          setCurrentStep={setCurrentStep}
          setSelectedPayment={setSelectedPayment}
        />
      );
    }

     if (selectedPayment === 'tron') {
      return (
        <Suspense>
          <EscrowCheckout/>
        </Suspense>
      );
    }

    if (selectedPayment === 'bnpl') {
      if (bnplStep === 'registration') {
        return (
          <Suspense>
            <BNPL
            setBnplStep={setBnplStep}
            setCreditScore={setCreditScore}
            setCurrentStep={setCurrentStep}
            setScore= {setScore}
          />
          </Suspense>
        );
      }


      if (bnplStep === 'scoring') {
        return (
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="animate-pulse">
              <TrendingUp className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Credit Assessment in Progress</h2>
              <p className="text-muted-foreground">Analyzing your credit profile...</p>
            </div>
            <div className="space-y-2 text-sm text-left bg-muted p-4 rounded">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Verifying income stability...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Checking digital payment history...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Analyzing social/professional signals...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Calculating credit score...</span>
              </div>
            </div>
          </div>
        );
      }

      if (bnplStep === 'approved' || score || creditScore) {
        return (
          <Suspense>
            <BNPLApproved
            setBnplStep={setBnplStep}
            setCurrentStep={setCurrentStep}
            score={score}
            setSelectedPayment = {setSelectedPayment}
          />
          </Suspense>
        );
      }

      if (bnplStep === 'rejected') {
        return (
          <div className="max-w-md mx-auto text-center space-y-6">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
            <div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">Credit Application Declined</h2>
              <p className="text-muted-foreground">We're unable to approve your BNPL application at this time.</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-left">
              <h4 className="font-semibold text-red-800 mb-2">Why was I declined?</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Insufficient credit history</li>
                <li>• Income verification required</li>
                <li>• Try again in 30 days</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={() => setSelectedPayment('card')}
                className="w-full"
                variant="outline"
              >
                Pay with Card Instead
              </Button>
              <Button 
                onClick={() => setSelectedPayment('usdt')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Try USDT for Instant Approval
              </Button>
            </div>
          </div>
        );
      }
    }


    if (selectedPayment === 'bank') {
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

  const SuccessView = () => (
    <div className="max-w-md mx-auto text-center space-y-6">
      <CheckCircle className="w-20 h-20 text-accent mx-auto" />
      
      <div>
        <h2 className="text-2xl font-bold text-accent mb-2">Payment Successful!</h2>
        <p className="text-muted-foreground">Your order is being processed</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between">
            <span>Amount Paid:</span>
            <span className="font-semibold">{usdtEquivalent} USDT</span>
          </div>
          <div className="flex justify-between">
            <span>You Saved:</span>
            <span className="font-semibold text-accent">${estimatedSavings.toFixed(2)}</span>
          </div>
          <Separator />
          <div>
            <Label className="text-xs text-muted-foreground">TRANSACTION HASH</Label>
            <div className="flex items-center gap-2 p-2 bg-muted rounded mt-1">
              <code className="text-xs flex-1 break-all">
                {txHash.slice(0, 20)}...{txHash.slice(-20)}
              </code>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => copyToClipboard(txHash)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Click to view on TRONScan
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="bg-accent/10 p-4 rounded-lg">
        <p className="text-sm text-accent">
          🎉 You earned 1% cashback in USDT for using our AI recommendation!
        </p>
      </div>

      <Button 
        onClick={() => {
          setCurrentStep('cart');
          setSelectedPayment(null);
          setUsdtPaid(false);
        }}
        variant="outline"
        className="w-full"
      >
        Continue Shopping
      </Button>
    </div>
  );

  return (
    
      <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto py-8">
        {currentStep === 'cart' && <CartView handlePaymentSelect={handlePaymentSelect} />}
        {currentStep === 'payment' && <PaymentView />}
        {currentStep === 'processing' && <ProcessingView />}
        {currentStep === 'success' && <SuccessView />}
      </div>
    </div>
    
  );
};

export default CheckoutContent;

