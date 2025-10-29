// import React, { useEffect, useState } from 'react';
// import { Button } from '../ui/button';
// import { ArrowLeft, Building2, CheckCircle, Loader2, XCircle } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { useCart } from '@/store/cart';
// import { CurrencyCode, formatPrice, getCurrentDate } from '@/utils/helperfns';
// import { CheckoutStep, PaymentMethod } from '@/app/checkout/checkoutContent';
// import { toast } from 'sonner';
// import RexPayClient from '@/lib/rexpay-client';
// import rexpay from '@/components/images/rexpay.png'
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import useCustomer from '@/store/customerStore';
// import { useLocationStore } from '@/store/locationStore';
// import { useMutation } from '@tanstack/react-query';
// import axiosCustomer from '@/utils/fetch-function-customer';

// type RexpayPaymentProps = {
//     setCurrentStep: (step: CheckoutStep) => void;
//     setSelectedPayment: (method: PaymentMethod) => void;
//     form: any; // Add form prop to get form data
// }

// const RexpayPayment = ({ setCurrentStep, setSelectedPayment, form }: RexpayPaymentProps) => {
//     const { cart } = useCart();
//     const { getCartTotal, mainCcy } = useCart();
//     const currency = mainCcy();
//     const total = getCartTotal();
//     const { customer } = useCustomer();
//     const { location } = useLocationStore();
//     const { getValues } = form;
//     const router = useRouter();

//     const [isProcessing, setIsProcessing] = useState(false);
//     const [checkoutData, setCheckoutData] = useState<any>(null);
//     const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');

//     // Submit order mutation (similar to your CardAlert component)
//     const { mutate: submitOrder, isPending: isSubmittingOrder } = useMutation({
//         mutationFn: (data: any) => axiosCustomer({
//             url: '/ecommerce/submit-order',
//             method: 'POST',
//             data
//         }),
//         onSuccess: (data) => {
//             if (data?.data?.responseCode !== '000') {
//                 toast?.error(data?.data?.responseMessage)
//                 return;
//             }

//             toast?.success(data?.data?.responseMessage);

//             // Clear session storage
//             sessionStorage.removeItem('rexpay_tranId');
//             sessionStorage.removeItem('rexpay_reference');
//             sessionStorage.removeItem('rexpay_clientId');

//             // Redirect to success page
//             router.push('/rexpay-success');
//         },
//         onError: (error) => {
//             toast.error('Something went wrong submitting order!');
//             console.error('Order submission error:', error);
//         }
//     });

//     useEffect(() => {
//         const stored = sessionStorage.getItem('checkout');
//         if (stored) {
//             setCheckoutData(JSON.parse(stored));
//         }

//         const urlParams = new URLSearchParams(window.location.search);
//         if (urlParams.get('status') === 'rexpay_callback') {
//             handleRexpayCallback();
//         }
//     }, []);

//     const handleRexpayCallback = async () => {
//         setVerificationStatus('verifying');
//         await verifyRexpayPayment();
//     };

//     const verifyRexpayPayment = async () => {
//         try {
//             const tranId = sessionStorage.getItem('rexpay_tranId');
//             if (!tranId) {
//                 setVerificationStatus('failed');
//                 return;
//             }

//             const mode = process.env.NEXT_PUBLIC_REXPAY_MODE === 'PROD' ? 'live' : 'test';
//             const rexpayClient = new RexPayClient(mode);
//             const verificationResponse = await rexpayClient.verifyPayment(tranId);

//             if (verificationResponse?.responseCode === '00') {
//                 setVerificationStatus('success');
//                 toast.success('Payment verified successfully!');

//                 // Submit order after successful payment verification
//                 submitOrderAfterPayment();
//             } else {
//                 setVerificationStatus('failed');
//                 toast.error('Payment verification failed or is pending.');
//             }
//         } catch (error) {
//             setVerificationStatus('failed');
//             console.error('Payment verification error:', error);
//             toast.error('Payment verification failed.');
//         }
//     };

//     const submitOrderAfterPayment = () => {
//         if (!checkoutData) {
//             toast.error('Checkout data not found');
//             return;
//         }

//         const currentDate = getCurrentDate();
//         const orderItems = cart.map(item => ({
//             itemCode: item?.code,
//             itemName: item?.name,
//             price: item?.salePrice,
//             quantity: item?.quantity,
//             amount: item?.subTotal,
//             discount: 0,
//             picture: item?.picture,
//         }));

//         const payload = {
//             channel: "WEB",
//             cartId: checkoutData?.orderNo,
//             orderDate: currentDate,
//             totalAmount: checkoutData?.totalAmount,
//             totalDiscount: 0,
//             deliveryOption: getValues('shippingMethod'),
//             paymentMethod: 'REXPAY', // Set payment method as REXPAY
//             couponCode: "",
//             ccy: checkoutData?.ccy,
//             deliveryFee: 0,
//             geolocation: location ? `${location?.latitude}, ${location?.longitude}` : '',
//             deviceId: customer?.deviceID,
//             orderSatus: "PAID", // Set status as PAID since payment is successful
//             paymentStatus: "SUCCESS",
//             storeCode: customer?.storeCode || process.env.NEXT_PUBLIC_STORE_CODE,
//             customerName: customer?.fullname,
//             username: customer?.username,
//             deliveryAddress: {
//                 id: getValues('selectedAddressId') || 0,
//                 street: getValues('street'),
//                 landmark: getValues('landmark'),
//                 postCode: getValues('zipCode'),
//                 city: getValues('city'),
//                 state: getValues('state'),
//                 country: getValues('country'),
//                 addressType: getValues('addressType') || 'WAREHOUSE'
//             },
//             cartItems: orderItems,
//             // Add RexPay transaction reference
//             paymentReference: sessionStorage.getItem('rexpay_tranId')
//         };

//         submitOrder(payload);
//     };

//     const clearRexpaySession = () => {
//         try {
//             sessionStorage.removeItem('rexpay_tranId');
//             sessionStorage.removeItem('rexpay_reference');
//             sessionStorage.removeItem('rexpay_clientId');
//             const url = new URL(window.location.href);
//             url.searchParams.delete('status');
//             window.history.replaceState({}, '', url.toString());
//         } catch (e) {
//             console.warn('Failed to clear RexPay session:', e);
//         }
//     };

//     const initializeRexpayPayment = async () => {
//         if (!checkoutData) {
//             toast.error('Checkout data not found');
//             return;
//         }

//         setIsProcessing(true);

//         try {
//             const mode = process.env.NEXT_PUBLIC_REXPAY_MODE === 'PROD' ? 'live' : 'test';
//             const rexpayClient = new RexPayClient(mode);
//             const transactionId = `REX${Date.now()}${Math.floor(Math.random() * 1000)}`;

//             const paymentData = {
//                 reference: transactionId,
//                 amount: Math.round(total),
//                 currency: currency === 'USD' ? 'USD' : 'NGN',
//                 userId: checkoutData.customerEmail || 'customer@example.com',
//                 mode: "Debug",
//                 callbackUrl: `${window.location.origin}/checkout?status=rexpay_callback`,
//                 metadata: {
//                     email: checkoutData.customerEmail || '',
//                     customerName: checkoutData.customerName || 'Customer',
//                     orderNo: checkoutData.orderNo,
//                     storeCode: checkoutData.storeCode,
//                 },
//                 paymentChannel: 'DEFAULT',
//                 country: 'NGA',
//                 feeBearer: 'Merchant',
//                 isV2: false,
//             };

//             console.log('RexPay Payment Data:', paymentData);

//             const response = await rexpayClient.initializePayment(paymentData);

//             if (response.status === 'CREATED' && response.paymentUrl) {
//                 sessionStorage.setItem('rexpay_tranId', transactionId);
//                 sessionStorage.setItem('rexpay_reference', response.paymentUrlReference);
//                 sessionStorage.setItem('rexpay_clientId', response.clientId);

//                 window.location.href = response.paymentUrl;
//             } else {
//                 const errorMessage = response.responseMessage ||
//                     response.responseDescription ||
//                     'Failed to initialize payment';
//                 toast.error(errorMessage);
//                 console.error('RexPay API Error:', response);
//             }
//         } catch (error) {
//             console.error('RexPay payment error:', error);
//             toast.error('Payment initialization failed. Please try again.');
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     // Update your CheckoutContent to pass the form prop
//     if (verificationStatus === 'verifying' || isSubmittingOrder) {
//         return (
//             <div className="max-w-md mx-auto space-y-6 text-center">
//                 <Loader2 className="w-12 h-12 animate-spin mx-auto" />
//                 <h2 className="text-2xl font-bold">
//                     {isSubmittingOrder ? 'Submitting Order...' : 'Verifying Payment'}
//                 </h2>
//                 <p>
//                     {isSubmittingOrder 
//                         ? 'Please wait while we save your order...' 
//                         : 'Please wait while we confirm your payment...'
//                     }
//                 </p>
//             </div>
//         );
//     }

//     if (verificationStatus === 'success') {
//         return (
//             <div className="max-w-md mx-auto space-y-6 text-center">
//                 <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
//                 <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
//                 <p className="text-muted-foreground">Your order has been submitted successfully.</p>
//                 <Button onClick={() => router.push('/rexpay-success')}>
//                     View Order Details
//                 </Button>
//             </div>
//         );
//     }

//     if (verificationStatus === 'failed') {
//         return (
//             <div className="max-w-md mx-auto space-y-6 text-center">
//                 <XCircle className="w-12 h-12 text-red-500 mx-auto" />
//                 <h2 className="text-2xl font-bold text-red-600">Payment Verification Failed</h2>
//                 <Button onClick={() => setSelectedPayment(null)} variant="outline">
//                     Try Another Payment Method
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
//                 <h2 className="text-2xl font-bold">RexPay Payment</h2>
//             </div>

//             <Card>
//                 <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                         <Image src={rexpay} alt="RexPay Logo" className="w-[30%] h-[30%]" />
//                         Payment Gateway
//                     </CardTitle>
//                 </CardHeader>

//                 <CardContent className="space-y-6">
//                     {/* Payment Summary */}
//                     <div className="bg-muted p-4 rounded-lg">
//                         <div className="flex justify-between items-center mb-2">
//                             <span className="font-medium">Total Amount:</span>
//                             <span className="font-bold text-lg">
//                                 {formatPrice(total, currency as CurrencyCode)}
//                             </span>
//                         </div>
//                         <div className="text-sm text-muted-foreground space-y-1">
//                             <p>• Secure bank transfer</p>
//                             <p>• Real-time payment confirmation</p>
//                         </div>
//                     </div>

//                     {/* Payment Instructions */}
//                     <div className="text-sm space-y-3">
//                         <h4 className="font-semibold">How to pay with RexPay:</h4>
//                         <ol className="list-decimal list-inside space-y-2">
//                             <li>Click "Proceed to RexPay" below</li>
//                             <li>You'll be redirected to RexPay secure page</li>
//                             <li>Choose your preferred payment method</li>
//                             <li>Complete the payment</li>
//                             <li>You'll be redirected back automatically</li>
//                         </ol>
//                     </div>

//                     {/* Action Button */}
//                     <Button
//                         onClick={initializeRexpayPayment}
//                         disabled={isProcessing}
//                         className="w-full bg-purple-600 hover:bg-purple-700"
//                     >
//                         {isProcessing ? (
//                             <>
//                                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                 Initializing Payment...
//                             </>
//                         ) : (
//                             <>
//                                 Proceed to RexPay
//                                 <Building2 className="ml-2 w-4 h-4" />
//                             </>
//                         )}
//                     </Button>

//                     {/* Security Notice */}
//                     <div className="text-xs text-muted-foreground text-center">
//                         <p>🔒 Secure payment processed by RexPay</p>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };

// export default RexpayPayment;

import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, Building2, CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice, getCurrentDate } from '@/utils/helperfns';
import { CheckoutStep, PaymentMethod, FormData } from '@/app/checkout/checkoutContent';
import { toast } from 'sonner';
import RexPayClient from '@/lib/rexpay-client';
import rexpay from '@/components/images/rexpay.png'
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import useCustomer from '@/store/customerStore';
import { useLocationStore } from '@/store/locationStore';
import { UseFormReturn } from 'react-hook-form';

type RexpayPaymentProps = {
    setCurrentStep: (step: CheckoutStep) => void;
    setSelectedPayment: (method: PaymentMethod) => void;
    isCallback?: boolean;
    onSuccess?: () => void;
    form: UseFormReturn<FormData>;
}

const RexpayPayment = ({
    setCurrentStep,
    setSelectedPayment,
    isCallback = false,
    onSuccess,
    form
}: RexpayPaymentProps) => {
    const { cart, getCartTotal, mainCcy } = useCart();
    const { customer } = useCustomer();
    const { location } = useLocationStore();
    const currency = mainCcy();
    const total = getCartTotal();
    const [isProcessing, setIsProcessing] = useState(false);
    const [checkoutData, setCheckoutData] = useState<any>(null);
    const [formData, setFormData] = useState<FormData | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentDate = getCurrentDate();

    const storeCode = searchParams.get('storeCode') || '';
    const orderNo = searchParams.get('orderNo') || '';

    useEffect(() => {
        const stored = sessionStorage.getItem('checkout');
        if (stored) {
            setCheckoutData(JSON.parse(stored));
        }

        const savedFormData = sessionStorage.getItem('checkoutFormData');
        if (savedFormData) {
            try {
                const parsedFormData = JSON.parse(savedFormData);
                setFormData(parsedFormData);
                console.log('Loaded form data from sessionStorage:', parsedFormData);
            } catch (error) {
                console.error('Error loading form data:', error);
            }
        }

        if (isCallback) {
            console.log('RexPay callback detected in component, starting verification...');
            console.log('Current URL params - storeCode:', storeCode, 'orderNo:', orderNo);
            handleRexpayCallback();
        }
    }, [isCallback, storeCode, orderNo]);

    const { mutate: submitOrder, isPending: isSubmitting } = useMutation({
        mutationFn: (data: any) => axiosCustomer({
            url: '/ecommerce/submit-order',
            method: 'POST',
            data
        }),
        onSuccess: (data) => {
            console.log('Submit order response:', data);
            if (data?.data?.responseCode !== '000') {
                toast.error(data?.data?.responseMessage || 'Failed to save order');
                setVerificationStatus('failed');
                return;
            }
            toast.success('Order submitted successfully!');
            clearRexpaySession();

            sessionStorage.removeItem('checkoutFormData');

            if (onSuccess) {
                onSuccess();
            } else {
                const successOrderNo = data?.data?.orderNo || checkoutData?.orderNo || orderNo;
                router.push(`/rexpay-success?storeCode=${storeCode}&orderNo=${successOrderNo}&status=success`);
            }
        },
        onError: (error) => {
            console.error('Submit order error:', error);
            toast.error('Failed to save order!');
            setVerificationStatus('failed');
        }
    });

    const handleSubmitOrder = () => {
        if (!checkoutData && !orderNo) {
            console.error('Missing checkout data and order number');
            toast.error('Missing order information. Please try again.');
            setVerificationStatus('failed');
            return;
        }

        if (!customer) {
            console.error('Customer information not available');
            toast.error('Customer information not found. Please login again.');
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

        const currentFormData = formData || form.getValues();
        console.log('Using form data for order:', currentFormData);

        const payload = {
            channel: "WEB",
            cartId: checkoutData?.orderNo || orderNo,
            orderDate: currentDate,
            totalAmount: total,
            totalDiscount: 0,
            deliveryOption: currentFormData.shippingMethod || "delivery",
            paymentMethod: 'REXPAY',
            couponCode: "",
            ccy: currency,
            deliveryFee: 0,
            geolocation: location ? `${location?.latitude}, ${location?.longitude}` : '',
            deviceId: customer?.deviceID,
            orderSatus: "COMPLETED",
            paymentStatus: "PAID",
            storeCode: storeCode || customer?.storeCode || process.env.NEXT_PUBLIC_STORE_CODE,
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

        console.log('Submitting order payload:', payload);
        submitOrder(payload);
    };

    const handleRexpayCallback = async () => {
        console.log('Starting RexPay verification...');
        console.log('Available data - storeCode:', storeCode, 'orderNo:', orderNo, 'checkoutData:', checkoutData);
        console.log('Form data available:', formData);
        setVerificationStatus('verifying');
        await verifyRexpayPayment();
    };

    const verifyRexpayPayment = async () => {
        try {
            const tranId = sessionStorage.getItem('rexpay_tranId');
            console.log('Verifying payment with transaction ID:', tranId);

            if (!tranId) {
                console.error('No transaction ID found in session storage');
                setVerificationStatus('failed');
                toast.error('Payment verification failed: No transaction reference');
                return;
            }

            const mode = process.env.NEXT_PUBLIC_REXPAY_MODE === 'PROD' ? 'live' : 'test';
            const rexpayClient = new RexPayClient(mode);
            const verificationResponse = await rexpayClient.verifyPayment(tranId);

            console.log('RexPay verification response:', verificationResponse);

            if (verificationResponse?.responseCode === '00') {
                console.log('Payment verification successful, submitting order...');
                setVerificationStatus('success');
                toast.success('Payment verified successfully!');

                handleSubmitOrder();
            } else {
                console.error('Payment verification failed:', verificationResponse);
                setVerificationStatus('failed');
                toast.error('Payment verification failed or is pending.');
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            setVerificationStatus('failed');
            toast.error('Payment verification failed. Please contact support.');
        }
    };

    const clearRexpaySession = () => {
        try {
            sessionStorage.removeItem('rexpay_tranId');
            sessionStorage.removeItem('rexpay_reference');
            sessionStorage.removeItem('rexpay_clientId');
        } catch (e) {
            console.warn('Failed to clear RexPay session:', e);
        }
    };

    const initializeRexpayPayment = async () => {
        if (!checkoutData && !orderNo) {
            toast.error('Checkout data not found. Please restart checkout process.');
            return;
        }

        const currentFormData = form.getValues();
        sessionStorage.setItem('checkoutFormData', JSON.stringify(currentFormData));
        console.log('Saved form data before redirect:', currentFormData);

        setIsProcessing(true);

        try {
            const mode = process.env.NEXT_PUBLIC_REXPAY_MODE === 'PROD' ? 'live' : 'test';
            const rexpayClient = new RexPayClient(mode);
            const transactionId = `REX${Date.now()}${Math.floor(Math.random() * 1000)}`;

            const currentOrderNo = checkoutData?.orderNo || orderNo;
            const currentStoreCode = storeCode || customer?.storeCode || process.env.NEXT_PUBLIC_STORE_CODE;

            const callbackUrl = new URL(`${window.location.origin}/checkout`);
            callbackUrl.searchParams.set('status', 'rexpay_callback');
            callbackUrl.searchParams.set('storeCode', currentStoreCode);
            callbackUrl.searchParams.set('orderNo', currentOrderNo);

            const paymentData = {
                reference: transactionId,
                amount: Math.round(total),
                currency: currency === 'USD' ? 'USD' : 'NGN',
                userId: customer?.email || checkoutData?.customerEmail || 'customer@example.com',
                mode: "Debug",
                callbackUrl: callbackUrl.toString(),
                metadata: {
                    email: customer?.email || checkoutData?.customerEmail || '',
                    customerName: customer?.fullname || checkoutData?.customerName || 'Customer',
                    orderNo: currentOrderNo,
                    storeCode: currentStoreCode,
                },
                paymentChannel: 'DEFAULT',
                country: 'NGA',
                feeBearer: 'Merchant',
                isV2: false,
            };

            console.log('RexPay Payment Data:', paymentData);
            console.log('Callback URL:', callbackUrl.toString());

            const response = await rexpayClient.initializePayment(paymentData);

            if (response.status === 'CREATED' && response.paymentUrl) {
                console.log('RexPay initialization successful, redirecting to:', response.paymentUrl);
                sessionStorage.setItem('rexpay_tranId', transactionId);
                sessionStorage.setItem('rexpay_reference', response.paymentUrlReference);
                sessionStorage.setItem('rexpay_clientId', response.clientId);

                window.location.href = response.paymentUrl;
            } else {
                const errorMessage = response.responseMessage ||
                    response.responseDescription ||
                    'Failed to initialize payment';
                console.error('RexPay API Error:', response);
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('RexPay payment error:', error);
            toast.error('Payment initialization failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        console.log('Form data state updated:', formData);
    }, [formData]);

    if (isCallback && verificationStatus === 'verifying') {
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto" />
                <h2 className="text-2xl font-bold">Verifying Payment</h2>
                <p>Please wait while we confirm your payment...</p>
                <div className="text-xs text-muted-foreground">
                    <p>Store: {storeCode}</p>
                    <p>Order: {orderNo}</p>
                    <p>Form Data: {formData ? 'Loaded' : 'Not loaded'}</p>
                </div>
            </div>
        );
    }

    if (verificationStatus === 'verifying') {
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto" />
                <h2 className="text-2xl font-bold">Verifying Payment</h2>
                <p>Please wait while we confirm your payment...</p>
            </div>
        );
    }

    if (verificationStatus === 'success') {
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-12 h-12 animate-spin mx-auto" />
                        <h2 className="text-2xl font-bold">Saving Your Order</h2>
                        <p>Please wait while we save your order details...</p>
                    </>
                ) : (
                    <>
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                        <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
                        <p className="text-muted-foreground">Your order has been placed successfully.</p>
                        <Button onClick={() => setCurrentStep('success')}>
                            Continue
                        </Button>
                    </>
                )}
            </div>
        );
    }

    if (verificationStatus === 'failed') {
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h2 className="text-2xl font-bold text-red-600">Payment Verification Failed</h2>
                <p className="text-muted-foreground">Please try another payment method.</p>
                <div className="text-xs text-muted-foreground p-2 bg-red-50 rounded">
                    <p>Debug Info:</p>
                    <p>Store: {storeCode || 'Not found'}</p>
                    <p>Order: {orderNo || 'Not found'}</p>
                    <p>Customer: {customer ? 'Available' : 'Not available'}</p>
                    <p>Form Data: {formData ? JSON.stringify(formData) : 'Not available'}</p>
                </div>
                <Button onClick={() => setSelectedPayment(null)} variant="outline">
                    Try Another Payment Method
                </Button>
            </div>
        );
    }

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
                {/* <h2 className="text-2xl font-bold">RexPay Payment</h2> */}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <Image src={rexpay} alt="RexPay Logo" className="w-[30%] h-[30%]" />
                        Payment Gateway
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="bg-muted p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Total Amount:</span>
                            <span className="font-bold text-lg">
                                {formatPrice(total, currency as CurrencyCode)}
                            </span>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                            <p>• Secure bank transfer</p>
                            <p>• Real-time payment confirmation</p>
                        </div>
                    </div>

                    <div className="text-sm space-y-3">
                        <h4 className="font-semibold">How to pay with RexPay:</h4>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>Click "Proceed to RexPay" below</li>
                            <li>You'll be redirected to RexPay secure page</li>
                            <li>Choose your preferred payment method</li>
                            <li>Complete the payment</li>
                            <li>You'll be redirected back automatically</li>
                        </ol>
                    </div>

                    {/* <div className="text-xs text-muted-foreground p-2 bg-blue-50 rounded">
                        <p><strong>Current Parameters:</strong></p>
                        <p>Store Code: {storeCode || 'Not set'}</p>
                        <p>Order No: {orderNo || 'Not set'}</p>
                        <p>Is Callback: {isCallback ? 'Yes' : 'No'}</p>
                        <p>Form Data: {formData ? 'Loaded' : 'Not loaded'}</p>
                    </div> */}

                    <Button
                        onClick={initializeRexpayPayment}
                        disabled={isProcessing}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Initializing Payment...
                            </>
                        ) : (
                            <>
                                Proceed to RexPay
                                <Building2 className="ml-2 w-4 h-4" />
                            </>
                        )}
                    </Button>

                    <div className="text-xs text-muted-foreground text-center">
                        <p>🔒 Secure payment processed by RexPay</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RexpayPayment;