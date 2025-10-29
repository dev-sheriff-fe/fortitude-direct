// 'use client';
// import React, { Suspense, useEffect, useState } from 'react';

// import { useToast } from '@/app/hooks/use-toast';
// import { useCart } from '@/store/cart';
// import { useForm } from 'react-hook-form';
// import CartView from '@/components/checkout/cart-view';
// import UsdtPayment from '@/components/checkout/usdt-payment';

// import BankPayment from '@/components/checkout/bank-payment';
// import { useSearchParams } from 'next/navigation';
// import BnplManager from '@/components/checkout/bnpl_checkout/bnpl-manager';
// import z from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import RexpayPayment from '@/components/checkout/rexpay-payment';
// import SolanaPay from '@/components/checkout/solana/solana-pay';
// import WalletPayment from '@/components/checkout/wallet-payment';

// export type PaymentMethod = 'card' | 'card2' | 'crypto_token' | 'bnpl' | 'bank_transfer' | 'tron' | 'rexpay' | 'solana_pay' | 'wallet' | null;
// export type CheckoutStep = 'cart' | 'payment' | 'processing' | 'success' | 'info';
// export type BNPLStep = 'registration' | 'scoring' | 'approved' | 'rejected'

// export interface CreditScoreData {
//   incomeStability: number;
//   digitalPaymentHistory: number;
//   ecommerceHistory: number;
//   creatorIncome: number;
//   identityConsistency: number;
//   onchainWallet: number;
//   behavioralScoring: number;
//   socialPresence: number;
//   employerVerification: number;
//   totalScore: number;
//   tier: 'A' | 'B' | 'C';
//   limit: number;
//   installments: number;
// }

// const formSchema = z.object({
//   shippingMethod: z.enum(["delivery", "pickup"]).default("delivery")?.optional(),
//   shippingOption: z.string().optional(),
//   pickupStore: z.string().optional(),
//   fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
//   country: z.string().min(1, "Please select a country"),
//   addressType: z.string().min(1, "Please select address type").optional(),
//   city: z.string(),
//   state: z.string(),
//   zipCode: z.string(),
//   street: z.string().optional(),
//   selectedAddressId: z.number(),
//   landmark: z.string().optional(),
//   agreeTerms: z.boolean().refine((val) => val === true, {
//     message: "You must agree to the terms and conditions",
//   }),
// });

// export type FormData = z.infer<typeof formSchema>;


// const CheckoutContent = () => {
//   const [currentStep, setCurrentStep] = useState<CheckoutStep>('info');
//   const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
//   const [wallets, setWallets] = useState<any | null>(null)
//   const [checkoutData, setCheckoutData] = useState(null)
//   const form = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       shippingMethod: "delivery",
//       fullName: "",
//       country: "",
//       city: "",
//       state: "",
//       zipCode: "",
//       agreeTerms: false,
//     },
//   });

//   const searchParams = useSearchParams()
//   const storeCode = searchParams.get('storeCode') || ''
//   console.log(storeCode);

//   const { toast } = useToast();

//   useEffect(() => {
//     const stored = sessionStorage.getItem('checkout');
//     if (stored) {
//       setCheckoutData(JSON.parse(stored));
//     }
//   }, []);

//   console.log(checkoutData);

//   const handlePaymentSelect = (method: PaymentMethod) => {
//     setSelectedPayment(method);
//     setCurrentStep('payment');
//   };

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text);
//     toast({
//       title: "Copied",
//       description: "Address copied to clipboard",
//     });
//   };

//   const PaymentView = () => {
//     if (selectedPayment == 'crypto_token') {
//       return (
//         <Suspense>
//           <UsdtPayment
//             setCurrentStep={setCurrentStep}
//             currentStep={currentStep}
//             wallets={wallets}
//             form={form}
//           />
//         </Suspense>
//       );
//     }

//     // if (selectedPayment === 'card') {
//     //   return (
//     //     <CardPayment
//     //       setCurrentStep={setCurrentStep}
//     //       setSelectedPayment={setSelectedPayment}
//     //     />
//     //   );
//     // }

//     if (selectedPayment === 'rexpay') {
//       return (
//         <RexpayPayment
//           setCurrentStep={setCurrentStep}
//           setSelectedPayment={setSelectedPayment}
//           // form={form}
//         />
//       );
//     }

//     if (selectedPayment === 'wallet') {
//       return (
//         <WalletPayment
//           setCurrentStep={setCurrentStep}
//           setSelectedPayment={setSelectedPayment}
//         />
//       );
//     }

//     if (selectedPayment === 'card2') {
//       return (
//         <RexpayPayment
//           setCurrentStep={setCurrentStep}
//           setSelectedPayment={setSelectedPayment}
//           // form={form}
//         />
//       );
//     }


//     if (selectedPayment === 'solana_pay') {
//       return (
//         <SolanaPay
//           setCurrentStep={setCurrentStep}
//         />
//       );
//     }

//     console.log('Selected payment:', selectedPayment);

//     // if (selectedPayment === 'bnpl') {
//     //   return (
//     //     <div className='h-screen'>
//     //       {/* <button className='' onClick={()=>setCurrentStep('cart')}>
//     //         <ArrowLeft/>
//     //       </button> */}
//     //       <BnplManager
//     //         setCurrentStep= {setCurrentStep}
//     //         form = {form}
//     //       />
//     //   </div>
//     //   )     
//     // }


//     if (selectedPayment == 'bank_transfer') {
//       return (
//         <BankPayment
//           setCurrentStep={setCurrentStep}
//           copyToClipboard={copyToClipboard}
//         />
//       );
//     }

//     return null;
//   };

//   const ProcessingView = () => (
//     <div className="max-w-md mx-auto text-center space-y-6">
//       <div className="animate-spin text-6xl">⚡</div>
//       <div>
//         <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
//         <p className="text-muted-foreground">Waiting for blockchain confirmation...</p>
//       </div>
//       <div className="bg-muted p-4 rounded-lg">
//         <p className="text-sm">Expected confirmation: ~3 seconds</p>
//       </div>
//     </div>
//   );



//   return (

//     <div className="min-h-screen p-2">
//       <div className="max-w-6xl mx-auto py-8">
//         {currentStep === 'info' && <BnplManager setCurrentStep={setCurrentStep} form={form} />}
//         {currentStep === 'cart' && <CartView
//           handlePaymentSelect={handlePaymentSelect}
//           setCurrentStep={setCurrentStep}
//           paymentMethod={selectedPayment}
//           setSelectedPayment={setSelectedPayment}
//           setWallets={setWallets}
//           form={form}
//         />}

//         {currentStep === 'payment' && <PaymentView />}
//         {currentStep === 'processing' && <ProcessingView />}

//       </div>
//     </div>

//   );
// };

// export default CheckoutContent;


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
  pickupStore: z.string().optional(),
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
  const [checkoutData, setCheckoutData] = useState(null)
  const [isRexpayCallback, setIsRexpayCallback] = useState(false);
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

  useEffect(() => {
    const stored = sessionStorage.getItem('checkout');
    if (stored) {
        setCheckoutData(JSON.parse(stored));
    }

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
        />
      );
    }

    if (selectedPayment === 'wallet') {
      return (
        <WalletPayment
          setCurrentStep={setCurrentStep}
          setSelectedPayment={setSelectedPayment}
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
        />
      );
    }

    if (selectedPayment === 'solana_pay') {
      return (
        <SolanaPay
          setCurrentStep={setCurrentStep}
        />
      );
    }

    console.log('Selected payment:', selectedPayment);

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
        {currentStep === 'info' && <BnplManager setCurrentStep={setCurrentStep} form={form} />}
        {currentStep === 'cart' && <CartView
          handlePaymentSelect={handlePaymentSelect}
          setCurrentStep={setCurrentStep}
          paymentMethod={selectedPayment}
          setSelectedPayment={setSelectedPayment}
          setWallets={setWallets}
          form={form}
        />}

        {currentStep === 'payment' && <PaymentView />}
        {currentStep === 'processing' && <ProcessingView />}
        {currentStep === 'success' && <SuccessView />}
      </div>
    </div>
  );
};

export default CheckoutContent;
