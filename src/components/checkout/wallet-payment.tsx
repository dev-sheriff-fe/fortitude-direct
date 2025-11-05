// 'use client';
// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { useToast } from '@/app/hooks/use-toast';
// import { useCart } from '@/store/cart';
// import { CheckoutStep, PaymentMethod, FormData } from '@/app/checkout/checkoutContent';
// import { ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react';
// import { useQuery, useMutation } from '@tanstack/react-query';
// import axiosCustomer from '@/utils/fetch-function-customer';
// import useCustomer from '@/store/customerStore';
// import { useLocationStore } from '@/store/locationStore';
// import { Button } from '@/components/ui/button';
// import { CurrencyCode, formatPrice, getCurrentDate } from '@/utils/helperfns';
// import { UseFormReturn } from 'react-hook-form';
// import { useRouter } from 'next/navigation';

// interface WalletPaymentProps {
//     setCurrentStep: (step: CheckoutStep) => void;
//     setSelectedPayment: (method: PaymentMethod) => void;
//     orderTotal: number;
//     form: UseFormReturn<FormData>;
//     onSuccess?: () => void;
// }

// interface WalletBalance {
//     id: number;
//     accountNo: string;
//     accountType: string;
//     symbol: string;
//     balance: number;
//     lcyBalance: number;
//     lcyCcy: string;
//     label: string;
//     logo: string;
//     primaryWallet: boolean;
//     name: string;
// }

// const WalletPayment: React.FC<WalletPaymentProps> = ({
//     setCurrentStep,
//     setSelectedPayment,
//     orderTotal,
//     form,
//     onSuccess
// }) => {
//     const [processing, setProcessing] = useState(false);
//     const [verificationStatus, setVerificationStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
//     const { toast } = useToast();
//     const { cart, clearCart, mainCcy } = useCart();
//     const { customer } = useCustomer();
//     const { location } = useLocationStore();
//     const ccy = mainCcy();
//     const router = useRouter();
//     const currentDate = getCurrentDate();

//     const hasSubmittedOrder = useRef(false);
//     const isSubmittingRef = useRef(false);

//     const { data: balanceData, isLoading, error } = useQuery({
//         queryKey: ['wallet-balance'],
//         queryFn: () => axiosCustomer.request({
//             method: 'GET',
//             url: '/customer-dashboard/balance',
//             params: {
//                 storeCode: process.env.NEXT_PUBLIC_STORE_CODE || '',
//                 username: customer?.username || '',
//                 entityCode: customer?.entityCode || '',
//             }
//         }),
//         enabled: !!customer?.username,
//     });

//     const walletBalance = balanceData?.data?.wallets?.[0] as WalletBalance | undefined;

//     const handleSubmitOrder = useCallback(() => {
//         if (hasSubmittedOrder.current || isSubmittingRef.current) {
//             console.log('Order submission already in progress or completed, skipping');
//             return;
//         }

//         if (!customer) {
//             console.error('Customer information not available');
//             toast({
//                 title: "Error",
//                 description: "Customer information not found. Please login again.",
//                 variant: "destructive",
//             });
//             setVerificationStatus('failed');
//             return;
//         }

//         const orderItems = cart.map(item => ({
//             itemCode: item?.code,
//             itemName: item?.name,
//             price: item?.salePrice,
//             quantity: item?.quantity,
//             amount: item?.subTotal,
//             discount: 0,
//             picture: item?.picture,
//         }));

//         const currentFormData = form.getValues();
//         console.log('Using form data for wallet order:', currentFormData);

//         const payload = {
//             channel: "WEB",
//             cartId: sessionStorage.getItem('orderNumber') || `ORD-${Date.now()}`,
//             orderDate: currentDate,
//             totalAmount: orderTotal,
//             totalDiscount: 0,
//             deliveryOption: currentFormData.shippingMethod || "delivery",
//             paymentMethod: 'WALLET',
//             couponCode: "",
//             ccy: ccy,
//             deliveryFee: 0,
//             geolocation: location ? `${location?.latitude}, ${location?.longitude}` : '',
//             deviceId: customer?.deviceID,
//             orderSatus: "COMPLETED",
//             paymentStatus: "PAID",
//             storeCode: customer?.storeCode || process.env.NEXT_PUBLIC_STORE_CODE,
//             customerName: customer?.fullname,
//             username: customer?.username,
//             deliveryAddress: {
//                 id: currentFormData.selectedAddressId || 0,
//                 street: currentFormData.street || "",
//                 landmark: currentFormData.landmark || "",
//                 postCode: currentFormData.zipCode || "",
//                 city: currentFormData.city || "",
//                 state: currentFormData.state || "",
//                 country: currentFormData.country || "",
//                 addressType: currentFormData.addressType || "WAREHOUSE"
//             },
//             cartItems: orderItems
//         };

//         console.log('Submitting wallet order payload:', payload);
//         hasSubmittedOrder.current = true;
//         isSubmittingRef.current = true;
//         submitOrder(payload);
//     }, [cart, customer, form, orderTotal, ccy, location, currentDate, toast]);

//     const { mutate: submitOrder, isPending: isSubmitting } = useMutation({
//         mutationFn: (data: any) => axiosCustomer({
//             url: '/ecommerce/submit-order',
//             method: 'POST',
//             data
//         }),
//         onSuccess: (data) => {
//             console.log('Submit wallet order response:', data);
//             isSubmittingRef.current = false;
            
//             if (data?.data?.responseCode !== '000') {
//                 toast({
//                     title: "Order Failed",
//                     description: data?.data?.responseMessage || 'Failed to save order',
//                     variant: "destructive",
//                 });
//                 setVerificationStatus('failed');
//                 hasSubmittedOrder.current = false;
//                 return;
//             }

//             toast({
//                 title: "Payment Successful",
//                 description: "Your order has been placed successfully!",
//             });

//             clearCart();
//             sessionStorage.removeItem('orderNumber');

//             setVerificationStatus('success');

//             if (onSuccess) {
//                 onSuccess();
//             } else {
//                 const successOrderNo = data?.data?.orderNo || sessionStorage.getItem('orderNumber');
//                 setTimeout(() => {
//                     setCurrentStep('success');
//                 }, 1500);
//             }
//         },
//         onError: (error) => {
//             console.error('Submit wallet order error:', error);
//             isSubmittingRef.current = false;
//             toast({
//                 title: "Order Failed",
//                 description: "Failed to save order!",
//                 variant: "destructive",
//             });
//             setVerificationStatus('failed');
//             hasSubmittedOrder.current = false;
//         }
//     });

//     const handlePayment = async () => {
//         if (!walletBalance || !isBalanceSufficient) return;

//         setProcessing(true);
//         setVerificationStatus('processing');

//         try {
//             let orderNo = sessionStorage.getItem('orderNumber');
//             if (!orderNo) {
//                 orderNo = `ORD-${Date.now()}`;
//                 sessionStorage.setItem('orderNumber', orderNo);
//             }

//             console.log('Initiating wallet payment for order:', orderNo);
            
//             handleSubmitOrder();

//         } catch (error: any) {
//             console.error('Wallet payment error:', error);
//             setVerificationStatus('failed');
//             toast({
//                 title: "Payment Failed",
//                 description: error?.message || "Please try again",
//                 variant: "destructive",
//             });
//             setProcessing(false);
//         }
//     };

//     const isBalanceSufficient = walletBalance && walletBalance.balance >= orderTotal;

//     if (isLoading) {
//         return (
//             <div className="max-w-md mx-auto space-y-6 text-center">
//                 <Loader2 className="w-12 h-12 animate-spin mx-auto" />
//                 <h2 className="text-2xl font-bold">Loading Wallet</h2>
//                 <p>Please wait while we load your wallet information...</p>
//             </div>
//         );
//     }

//     if (verificationStatus === 'processing') {
//         return (
//             <div className="max-w-md mx-auto space-y-6 text-center">
//                 {isSubmitting ? (
//                     <>
//                         <Loader2 className="w-12 h-12 animate-spin mx-auto" />
//                         <h2 className="text-2xl font-bold">Processing Payment</h2>
//                         <p>Please wait while we process your payment...</p>
//                     </>
//                 ) : (
//                     <>
//                         <Loader2 className="w-12 h-12 animate-spin mx-auto" />
//                         <h2 className="text-2xl font-bold">Initiating Payment</h2>
//                         <p>Setting up your wallet payment...</p>
//                     </>
//                 )}
//             </div>
//         );
//     }

//     if (verificationStatus === 'success') {
//         return (
//             <div className="max-w-md mx-auto space-y-6 text-center">
//                 <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
//                 <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
//                 <p className="text-muted-foreground">Your order has been placed successfully.</p>
//                 <Button onClick={() => setCurrentStep('success')}>
//                     Continue
//                 </Button>
//             </div>
//         );
//     }

//     if (verificationStatus === 'failed') {
//         return (
//             <div className="max-w-md mx-auto space-y-6 text-center">
//                 <XCircle className="w-12 h-12 text-red-500 mx-auto" />
//                 <h2 className="text-2xl font-bold text-red-600">Payment Failed</h2>
//                 <p className="text-muted-foreground">Please try another payment method.</p>
//                 <Button onClick={() => setSelectedPayment(null)} variant="outline">
//                     Try Another Payment Method
//                 </Button>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="max-w-md mx-auto space-y-6 text-center">
//                 <XCircle className="w-12 h-12 text-red-500 mx-auto" />
//                 <h2 className="text-2xl font-bold text-red-600">Failed to Load Wallet</h2>
//                 <p className="text-muted-foreground">Unable to load your wallet information.</p>
//                 <Button onClick={() => setSelectedPayment(null)} variant="outline">
//                     Choose Another Payment Method
//                 </Button>
//             </div>
//         );
//     }

//     if (!walletBalance) {
//         return (
//             <div className="max-w-md mx-auto space-y-6 text-center">
//                 <XCircle className="w-12 h-12 text-red-500 mx-auto" />
//                 <h2 className="text-2xl font-bold text-red-600">No Wallet Found</h2>
//                 <p className="text-muted-foreground">You don't have a wallet set up.</p>
//                 <Button onClick={() => setSelectedPayment(null)} variant="outline">
//                     Choose Another Payment Method
//                 </Button>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-md mx-auto space-y-6">
//             <div className="flex items-center gap-2">
//                 <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => setCurrentStep('cart')}
//                 >
//                     <ArrowLeft className="w-4 h-4" />
//                 </Button>
//                 <h2 className="text-xl font-semibold">Wallet Payment</h2>
//             </div>

//             <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
//                 <div className="p-4 bg-muted rounded-lg">
//                     <div className="flex items-center gap-3 mb-4">
//                         {walletBalance.logo && (
//                             <img
//                                 src={walletBalance.logo}
//                                 alt={walletBalance.symbol}
//                                 className="w-10 h-10 rounded-lg object-cover"
//                             />
//                         )}
//                         <div>
//                             <h3 className="font-semibold">{walletBalance.name}</h3>
//                             <p className="text-sm text-muted-foreground">{walletBalance.label}</p>
//                         </div>
//                     </div>

//                     <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                             <span className="text-muted-foreground">Available Balance:</span>
//                             <span className="font-semibold text-lg">
//                                 {formatPrice(walletBalance.balance, walletBalance.symbol as CurrencyCode)}
//                             </span>
//                         </div>
//                         <div className="flex items-center justify-between text-sm text-muted-foreground">
//                             <span>Account Number:</span>
//                             <span>{walletBalance.accountNo}</span>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="p-4 border rounded-lg">
//                     <div className="flex justify-between items-center">
//                         <span className="text-muted-foreground">Order Total:</span>
//                         <span className="font-bold text-lg">
//                             {formatPrice(orderTotal, ccy as CurrencyCode)}
//                         </span>
//                     </div>
//                 </div>

//                 {!isBalanceSufficient && (
//                     <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                         <div className="flex items-start gap-3">
//                             <div className="text-yellow-600 mt-0.5">
//                                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                                     <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                 </svg>
//                             </div>
//                             <div className="flex-1">
//                                 <p className="text-sm text-yellow-700 font-medium">
//                                     Insufficient Balance
//                                 </p>
//                                 <p className="text-sm text-yellow-600 mt-1">
//                                     You need {formatPrice(orderTotal - walletBalance.balance, walletBalance.symbol as CurrencyCode)} more to complete this payment.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 <Button
//                     onClick={handlePayment}
//                     disabled={!isBalanceSufficient || processing}
//                     className="w-full bg-accent hover:bg-accent-foreground text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
//                 >
//                     {processing ? (
//                         <>
//                             <Loader2 className="w-4 h-4 animate-spin mr-2" />
//                             Processing Payment...
//                         </>
//                     ) : (
//                         `Pay ${formatPrice(orderTotal, ccy as CurrencyCode)}`
//                     )}
//                 </Button>

//                 <Button
//                     onClick={() => setSelectedPayment(null)}
//                     variant="outline"
//                     className="w-full"
//                 >
//                     Choose Another Payment Method
//                 </Button>
//             </div>
//         </div>
//     );
// };

// export default WalletPayment;

'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useToast } from '@/app/hooks/use-toast';
import { useCart } from '@/store/cart';
import { CheckoutStep, PaymentMethod, FormData } from '@/app/checkout/checkoutContent';
import { ArrowLeft, Loader2, CheckCircle, XCircle, Settings } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import useCustomer from '@/store/customerStore';
import { useLocationStore } from '@/store/locationStore';
import { Button } from '@/components/ui/button';
import { CurrencyCode, formatPrice, getCurrentDate } from '@/utils/helperfns';
import { UseFormReturn } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { PinInput } from '@/components/ui/pin-input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface WalletPaymentProps {
    setCurrentStep: (step: CheckoutStep) => void;
    setSelectedPayment: (method: PaymentMethod) => void;
    orderTotal: number;
    form: UseFormReturn<FormData>;
    onSuccess?: () => void;
}

interface WalletBalance {
    id: number;
    accountNo: string;
    accountType: string;
    symbol: string;
    balance: number;
    lcyBalance: number;
    lcyCcy: string;
    label: string;
    logo: string;
    primaryWallet: boolean;
    name: string;
}

const WalletPayment: React.FC<WalletPaymentProps> = ({
    setCurrentStep,
    setSelectedPayment,
    orderTotal,
    form,
    onSuccess
}) => {
    const [processing, setProcessing] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
    const [showPinModal, setShowPinModal] = useState(false);
    const [showSetupPinModal, setShowSetupPinModal] = useState(false);
    const [pin, setPin] = useState('');
    const { toast } = useToast();
    const { cart, clearCart, mainCcy } = useCart();
    const { customer } = useCustomer();
    const { location } = useLocationStore();
    const ccy = mainCcy();
    const router = useRouter();
    const currentDate = getCurrentDate();

    const hasSubmittedOrder = useRef(false);
    const isSubmittingRef = useRef(false);

    const { data: balanceData, isLoading, error } = useQuery({
        queryKey: ['wallet-balance'],
        queryFn: () => axiosCustomer.request({
            method: 'GET',
            url: '/customer-dashboard/balance',
            params: {
                storeCode: process.env.NEXT_PUBLIC_STORE_CODE || '',
                username: customer?.username || '',
                entityCode: customer?.entityCode || '',
            }
        }),
        enabled: !!customer?.username,
    });

    const walletBalance = balanceData?.data?.wallets?.[0] as WalletBalance | undefined;

    const handleSubmitOrder = useCallback((transactionPin: string) => {
        if (hasSubmittedOrder.current || isSubmittingRef.current) {
            console.log('Order submission already in progress or completed, skipping');
            return;
        }

        if (!customer) {
            console.error('Customer information not available');
            toast({
                title: "Error",
                description: "Customer information not found. Please login again.",
                variant: "destructive",
            });
            setVerificationStatus('failed');
            return;
        }

        const orderItems = cart.map(item => ({
            itemCode: item?.code,
            itemName: item?.name,
            price: item?.salePrice,
            quantity: item?.quantity,
            amount: item?.subTotal,
            discount: 0,
            picture: item?.picture,
        }));

        const currentFormData = form.getValues();
        console.log('Using form data for wallet order:', currentFormData);

        const payload = {
            channel: "WEB",
            cartId: sessionStorage.getItem('orderNumber') || `ORD-${Date.now()}`,
            orderDate: currentDate,
            totalAmount: orderTotal,
            totalDiscount: 0,
            deliveryOption: currentFormData.shippingMethod || "delivery",
            paymentMethod: 'WALLET',
            couponCode: "",
            ccy: ccy,
            deliveryFee: 0,
            geolocation: location ? `${location?.latitude}, ${location?.longitude}` : '',
            deviceId: customer?.deviceID,
            orderSatus: "COMPLETED",
            paymentStatus: "PAID",
            storeCode: customer?.storeCode || process.env.NEXT_PUBLIC_STORE_CODE,
            customerName: customer?.fullname,
            username: customer?.username,
            deliveryAddress: {
                id: currentFormData.selectedAddressId || 0,
                street: currentFormData.street || "",
                landmark: currentFormData.landmark || "",
                postCode: currentFormData.zipCode || "",
                city: currentFormData.city || "",
                state: currentFormData.state || "",
                country: currentFormData.country || "",
                addressType: currentFormData.addressType || "WAREHOUSE"
            },
            cartItems: orderItems
        };

        console.log('Submitting wallet order payload:', payload);
        hasSubmittedOrder.current = true;
        isSubmittingRef.current = true;
        submitOrder({ payload, transactionPin });
    }, [cart, customer, form, orderTotal, ccy, location, currentDate, toast]);

    const { mutate: submitOrder, isPending: isSubmitting } = useMutation({
        mutationFn: ({ payload, transactionPin }: { payload: any; transactionPin: string }) => 
            axiosCustomer({
                url: '/ecommerce/submit-order',
                method: 'POST',
                data: payload,
                headers: {
                    'x-enc-pwd': transactionPin
                }
            }),
        onSuccess: (data) => {
            console.log('Submit wallet order response:', data);
            isSubmittingRef.current = false;
            
            if (data?.data?.responseCode !== '000') {
                toast({
                    title: "Order Failed",
                    description: data?.data?.responseMessage || 'Failed to save order',
                    variant: "destructive",
                });
                setVerificationStatus('failed');
                hasSubmittedOrder.current = false;
                return;
            }

            toast({
                title: "Payment Successful",
                description: "Your order has been placed successfully!",
            });

            clearCart();
            sessionStorage.removeItem('orderNumber');

            setVerificationStatus('success');

            if (onSuccess) {
                onSuccess();
            } else {
                const successOrderNo = data?.data?.orderNo || sessionStorage.getItem('orderNumber');
                setTimeout(() => {
                    setCurrentStep('success');
                }, 1500);
            }
        },
        onError: (error) => {
            console.error('Submit wallet order error:', error);
            isSubmittingRef.current = false;
            toast({
                title: "Order Failed",
                description: "Failed to save order!",
                variant: "destructive",
            });
            setVerificationStatus('failed');
            hasSubmittedOrder.current = false;
        }
    });

    const handlePayment = async () => {
        if (!walletBalance || !isBalanceSufficient) return;

        if (!customer?.pinSet) {
            setShowSetupPinModal(true);
            return;
        }

        setShowPinModal(true);
    };

    const handlePinSubmit = () => {
        if (pin.length !== 4) {
            toast({
                title: "Invalid PIN",
                description: "Please enter a 4-digit PIN",
                variant: "destructive",
            });
            return;
        }

        setShowPinModal(false);
        setProcessing(true);
        setVerificationStatus('processing');

        try {
            let orderNo = sessionStorage.getItem('orderNumber');
            if (!orderNo) {
                orderNo = `ORD-${Date.now()}`;
                sessionStorage.setItem('orderNumber', orderNo);
            }

            console.log('Initiating wallet payment for order:', orderNo);
            
            handleSubmitOrder(pin);
            setPin('');

        } catch (error: any) {
            console.error('Wallet payment error:', error);
            setVerificationStatus('failed');
            toast({
                title: "Payment Failed",
                description: error?.message || "Please try again",
                variant: "destructive",
            });
            setProcessing(false);
        }
    };

    const handleNavigateToSettings = () => {
        setShowSetupPinModal(false);
        router.push('/settings');
    };

    const isBalanceSufficient = walletBalance && walletBalance.balance >= orderTotal;

    if (isLoading) {
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto" />
                <h2 className="text-2xl font-bold">Loading Wallet</h2>
                <p>Please wait while we load your wallet information...</p>
            </div>
        );
    }

    if (verificationStatus === 'processing') {
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-12 h-12 animate-spin mx-auto" />
                        <h2 className="text-2xl font-bold">Processing Payment</h2>
                        <p>Please wait while we process your payment...</p>
                    </>
                ) : (
                    <>
                        <Loader2 className="w-12 h-12 animate-spin mx-auto" />
                        <h2 className="text-2xl font-bold">Initiating Payment</h2>
                        <p>Setting up your wallet payment...</p>
                    </>
                )}
            </div>
        );
    }

    if (verificationStatus === 'success') {
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
                <p className="text-muted-foreground">Your order has been placed successfully.</p>
                <Button onClick={() => setCurrentStep('success')}>
                    Continue
                </Button>
            </div>
        );
    }

    if (verificationStatus === 'failed') {
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h2 className="text-2xl font-bold text-red-600">Payment Failed</h2>
                <p className="text-muted-foreground">Please try another payment method.</p>
                <Button onClick={() => setSelectedPayment(null)} variant="outline">
                    Try Another Payment Method
                </Button>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h2 className="text-2xl font-bold text-red-600">Failed to Load Wallet</h2>
                <p className="text-muted-foreground">Unable to load your wallet information.</p>
                <Button onClick={() => setSelectedPayment(null)} variant="outline">
                    Choose Another Payment Method
                </Button>
            </div>
        );
    }

    if (!walletBalance) {
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h2 className="text-2xl font-bold text-red-600">No Wallet Found</h2>
                <p className="text-muted-foreground">You don't have a wallet set up.</p>
                <Button onClick={() => setSelectedPayment(null)} variant="outline">
                    Choose Another Payment Method
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-md mx-auto space-y-6">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep('cart')}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h2 className="text-xl font-semibold">Wallet Payment</h2>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                    <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3 mb-4">
                            {walletBalance.logo && (
                                <img
                                    src={walletBalance.logo}
                                    alt={walletBalance.symbol}
                                    className="w-10 h-10 rounded-lg object-cover"
                                />
                            )}
                            <div>
                                <h3 className="font-semibold">{walletBalance.name}</h3>
                                <p className="text-sm text-muted-foreground">{walletBalance.label}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Available Balance:</span>
                                <span className="font-semibold text-lg">
                                    {formatPrice(walletBalance.balance, walletBalance.symbol as CurrencyCode)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Account Number:</span>
                                <span>{walletBalance.accountNo}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Order Total:</span>
                            <span className="font-bold text-lg">
                                {formatPrice(orderTotal, ccy as CurrencyCode)}
                            </span>
                        </div>
                    </div>

                    {!isBalanceSufficient && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="text-yellow-600 mt-0.5">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-yellow-700 font-medium">
                                        Insufficient Balance
                                    </p>
                                    <p className="text-sm text-yellow-600 mt-1">
                                        You need {formatPrice(orderTotal - walletBalance.balance, walletBalance.symbol as CurrencyCode)} more to complete this payment.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <Button
                        onClick={handlePayment}
                        disabled={!isBalanceSufficient || processing}
                        className="w-full bg-accent hover:bg-accent-foreground text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Processing Payment...
                            </>
                        ) : (
                            `Pay ${formatPrice(orderTotal, ccy as CurrencyCode)}`
                        )}
                    </Button>

                    <Button
                        onClick={() => setSelectedPayment(null)}
                        variant="outline"
                        className="w-full"
                    >
                        Choose Another Payment Method
                    </Button>
                </div>
            </div>

            <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className='flex flex-col'>
                        <DialogTitle className="text-center">Enter Transaction PIN</DialogTitle>
                        <DialogDescription className="text-center">
                            Please enter your 4-digit transaction PIN to complete the payment
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex justify-center py-4">
                        <PinInput
                            length={4}
                            value={pin}
                            onChange={setPin}
                            type="password"
                            className="gap-2"
                            inputClassName="w-12 h-12 text-lg font-semibold bg-accent/10 border-accent focus:border-accent focus:ring-accent"
                            autoFocus
                        />
                    </div>

                    <DialogFooter className="flex gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowPinModal(false);
                                setPin('');
                            }}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePinSubmit}
                            disabled={pin.length !== 4}
                            className="flex-1 bg-accent hover:bg-accent-foreground"
                        >
                            Confirm Payment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showSetupPinModal} onOpenChange={setShowSetupPinModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="flex flex-col">
                        <DialogTitle className="text-center flex items-center justify-center gap-2">
                            <Settings className="w-5 h-5" />
                            Transaction PIN Required
                        </DialogTitle>
                        <DialogDescription className="text-center text-accent-foreground font-medium">
                            You need to set up a transaction PIN before you can make purchases with your wallet.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4 text-center space-y-3">
                        <p className="text-sm text-accent-foreground font-medium">
                            For security reasons, a transaction PIN is required for wallet payments.
                        </p>
                        <p className="text-sm text-accent-foreground font-medium">
                            You can set up your PIN in the mobile app or through your account settings.
                        </p>
                    </div>

                    <DialogFooter className="flex gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowSetupPinModal(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleNavigateToSettings}
                            className="flex-1 bg-accent hover:bg-accent-foreground"
                        >
                            Go to Settings
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default WalletPayment;