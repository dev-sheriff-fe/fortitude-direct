'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { useToast } from '@/app/hooks/use-toast';
import { useCart } from '@/store/cart';
import { useForm } from 'react-hook-form';
import CartView from '@/components/checkout/cart-view';
import UsdtPayment from '@/components/checkout/usdt-payment';
import BankPayment from '@/components/checkout/bank-payment';
import { useSearchParams, useRouter } from 'next/navigation';
import BnplManager from '@/components/checkout/bnpl_checkout/bnpl-manager';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import RexpayPayment from '@/components/checkout/rexpay-payment';
import SolanaPay from '@/components/checkout/solana/solana-pay';
import WalletPayment from '@/components/checkout/wallet-payment';
import { Button } from '@/components/ui/button';

export type PaymentMethod = 'card' | 'card2' | 'crypto_token' | 'bnpl' | 'bank_transfer' | 'tron' | 'rexpay' | 'solana_pay' | 'wallet' | null;
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
  shippingOption: z.string().optional(),
  pickupStore: z.number().optional(),
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
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('info');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [wallets, setWallets] = useState<any | null>(null)
  const [checkoutData, setCheckoutData] = useState<any>(null)
  const [isRexpayCallback, setIsRexpayCallback] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);

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
  const router = useRouter();
  const storeCode = searchParams.get('storeCode') || ''
  const { toast } = useToast();
  const { getCartTotal } = useCart();

  // Load checkout data and calculate initial order total
  useEffect(() => {
    const stored = sessionStorage.getItem('checkout');
    if (stored) {
      const parsedData = JSON.parse(stored);
      setCheckoutData(parsedData);

      const subtotal = parsedData.subtotal || getCartTotal();
      const shipping = parsedData.shippingFee || 0;
      setShippingFee(shipping);
      
      // Set initial order total (non-crypto by default)
      setOrderTotal(subtotal + shipping);
    }
  }, []);

  // Update order total when payment method changes
  useEffect(() => {
    if (!checkoutData) return;

    const subtotal = checkoutData.subtotal || getCartTotal();
    const shipping = checkoutData.shippingFee || 0;

    if (selectedPayment === 'crypto_token') {
      // Use payingAmount for crypto payments
      const cryptoAmount = checkoutData.payingAmount || 0;
      setOrderTotal(cryptoAmount + shipping);
    } else {
      // Use subtotal for non-crypto payments
      setOrderTotal(subtotal + shipping);
    }
  }, [selectedPayment, checkoutData, getCartTotal]);

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'rexpay_callback') {
      console.log('RexPay callback detected in parent component');
      console.log('StoreCode:', storeCode, 'OrderNo:', searchParams.get('orderNo'));
      setIsRexpayCallback(true);
      setSelectedPayment('rexpay');
      setCurrentStep('payment');

      const url = new URL(window.location.href);
      url.searchParams.delete('status');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  useEffect(() => {
    const savedFormData = sessionStorage.getItem('checkoutFormData');
    if (savedFormData) {
      try {
        const formData = JSON.parse(savedFormData);
        form.reset(formData);
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }

    const subscription = form.watch((value) => {
      sessionStorage.setItem('checkoutFormData', JSON.stringify(value));
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const updateCheckoutData = (shippingCost: number) => {
    const subtotal = checkoutData?.subtotal || getCartTotal();
    
    setShippingFee(shippingCost);

    if (checkoutData) {
      const updatedData = {
        ...checkoutData,
        shippingFee: shippingCost,
        totalAmount: subtotal + shippingCost
      };
      setCheckoutData(updatedData);
      sessionStorage.setItem('checkout', JSON.stringify(updatedData));
      
      // Update order total based on current payment method
      if (selectedPayment === 'crypto_token') {
        setOrderTotal((checkoutData.payingAmount || 0) + shippingCost);
      } else {
        setOrderTotal(subtotal + shippingCost);
      }
    }
  };

  console.log('Updated checkoutData:', checkoutData);
  console.log('Order Total:', orderTotal);
  console.log('Shipping Fee:', shippingFee);
  console.log('Selected Payment:', selectedPayment);

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

  const handleRexpaySuccess = () => {
    console.log('RexPay success handled in parent');
    setCurrentStep('success');
    setIsRexpayCallback(false);
  };

  const PaymentView = () => {
    if (selectedPayment == 'crypto_token') {
      return (
        <Suspense>
          <UsdtPayment
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
            wallets={wallets}
            form={form}
            orderTotal={orderTotal}
            checkoutData={checkoutData}
          />
        </Suspense>
      );
    }

    if (selectedPayment === 'rexpay') {
      return (
        <RexpayPayment
          setCurrentStep={setCurrentStep}
          setSelectedPayment={setSelectedPayment}
          isCallback={isRexpayCallback}
          onSuccess={handleRexpaySuccess}
          form={form}
          orderTotal={orderTotal}
        />
      );
    }

    if (selectedPayment === 'wallet') {
      return (
        <WalletPayment
          setCurrentStep={setCurrentStep}
          setSelectedPayment={setSelectedPayment}
          orderTotal={orderTotal}
          form={form}
        />
      );
    }

    if (selectedPayment === 'card2') {
      return (
        <RexpayPayment
          setCurrentStep={setCurrentStep}
          setSelectedPayment={setSelectedPayment}
          isCallback={isRexpayCallback}
          onSuccess={handleRexpaySuccess}
          form={form}
          orderTotal={orderTotal}
        />
      );
    }

    if (selectedPayment === 'solana_pay') {
      return (
        <SolanaPay
          setCurrentStep={setCurrentStep}
          orderTotal={orderTotal}
        />
      );
    }

    console.log('Selected payment:', selectedPayment);

    if (selectedPayment == 'bank_transfer') {
      return (
        <BankPayment
          setCurrentStep={setCurrentStep}
          copyToClipboard={copyToClipboard}
          orderTotal={orderTotal}
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
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
      <p className="text-muted-foreground">Your order has been placed successfully.</p>
      <Button onClick={() => router.push('/orders')} className="w-full">
        View Orders
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-6xl mx-auto py-8">
        {currentStep === 'info' && (
          <BnplManager
            setCurrentStep={setCurrentStep}
            form={form}
            onShippingUpdate={updateCheckoutData}
          />
        )}
        {currentStep === 'cart' && (
          <CartView
            handlePaymentSelect={handlePaymentSelect}
            setCurrentStep={setCurrentStep}
            paymentMethod={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            setWallets={setWallets}
            form={form}
            orderTotal={orderTotal}
            shippingFee={shippingFee}
          />
        )}

        {currentStep === 'payment' && <PaymentView />}
        {currentStep === 'processing' && <ProcessingView />}
        {currentStep === 'success' && <SuccessView />}
      </div>
    </div>
  );
};

export default CheckoutContent;