// import React, { useEffect, useState } from 'react';
// import { Button } from '../ui/button';
// import { ArrowLeft, Building2, Loader2 } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { useCart } from '@/store/cart';
// import { CurrencyCode, formatPrice } from '@/utils/helperfns';
// import { CheckoutStep, PaymentMethod } from '@/app/checkout/checkoutContent';
// import { toast } from 'sonner';
// import RexPay from 'rexpay';
// import Image from 'next/image';
// import rexpay from '@/components/images/rexpay.png'

// type RexpayPaymentProps = {
//     setCurrentStep: (step: CheckoutStep) => void;
//     setSelectedPayment: (method: PaymentMethod) => void;
// }

// const RexpayPayment = ({ setCurrentStep, setSelectedPayment }: RexpayPaymentProps) => {
//     const { getCartTotal, mainCcy, cart } = useCart();
//     const currency = mainCcy();
//     const total = getCartTotal();
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [checkoutData, setCheckoutData] = useState<any>(null);

//     useEffect(() => {
//         const stored = sessionStorage.getItem('checkout');
//         if (stored) {
//             setCheckoutData(JSON.parse(stored));
//         }
//     }, []);

//     const initializeRexpayPayment = async () => {
//         if (!checkoutData) {
//             toast.error('Checkout data not found');
//             return;
//         }

//         setIsProcessing(true);

//         try {
//             // Generate a unique transaction reference
//             const transactionId = `REX${Date.now()}${Math.floor(Math.random() * 1000)}`;

//             // Initialize RexPay
//             const rex = new RexPay();

//             const paymentData = {
//                 reference: transactionId,
//                 // amount: Math.round(total * 100), // Convert to kobo (smallest currency unit)
//                 amount: Math.round(total),
//                 currency: currency === 'USD' ? 'USD' : 'NGN', // RexPay supports USD and NGN
//                 userId: checkoutData.customerEmail || 'customer@example.com',
//                 callbackUrl: `${window.location.origin}/checkout?status=rexpay_callback`,
//                 mode: process.env.NODE_ENV === 'production' ? 'Live' : 'Debug',
//                 metadata: {
//                     email: checkoutData.customerEmail || '',
//                     customerName: checkoutData.customerName || 'Customer',
//                     orderNo: checkoutData.orderNo,
//                     storeCode: checkoutData.storeCode,
//                 }
//             };

//             const response = await rex.initializePayment(paymentData);

//             if (response.success) {
//                 // Save transaction references
//                 sessionStorage.setItem('rexpay_tranId', transactionId);
//                 sessionStorage.setItem('rexpay_reference', response.data?.reference);

//                 // Redirect to RexPay payment page
//                 window.location.href = response.data?.authorizeUrl || response.data?.paymentUrl;
//             } else {
//                 toast.error(response.message || 'Failed to initialize payment');
//             }
//         } catch (error) {
//             console.error('RexPay initialization error:', error);
//             toast.error('Payment initialization failed. Please try again.');
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     // Handle RexPay callback when returning to the page
//     useEffect(() => {
//         const urlParams = new URLSearchParams(window.location.search);
//         const status = urlParams.get('status');

//         if (status === 'rexpay_callback') {
//             verifyRexpayPayment();
//         }
//     }, []);

//     const verifyRexpayPayment = async () => {
//         try {
//             const tranId = sessionStorage.getItem('rexpay_tranId');
//             if (!tranId) return;

//             const rex = new RexPay();
//             const verificationResponse = await rex.verifyPayment({
//                 transactionReference: tranId,
//             });

//             if (verificationResponse?.data?.amount) {
//                 // Payment was successful
//                 toast.success('Payment verified successfully!');
//                 setCurrentStep('success');

//                 // Clear stored references
//                 sessionStorage.removeItem('rexpay_tranId');
//                 sessionStorage.removeItem('rexpay_reference');

//                 // Remove callback parameter from URL
//                 const newUrl = window.location.pathname;
//                 window.history.replaceState({}, '', newUrl);
//             }
//         } catch (error) {
//             console.error('Payment verification error:', error);
//         }
//     };

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
//                     <CardTitle className="flex items-center justify-between gap-2">
//                         <p>Payment Gateway</p>
//                         <Image src={rexpay} alt="RexPay Logo" className="w-[30%] h-[30%]" />
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
//                             {/* <p>• Instant virtual account generation</p> */}
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


// import React, { useEffect, useState } from 'react';
// import { Button } from '../ui/button';
// import { ArrowLeft, Building2, CheckCircle, Loader2, XCircle } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { useCart } from '@/store/cart';
// import { CurrencyCode, formatPrice } from '@/utils/helperfns';
// import { CheckoutStep, PaymentMethod } from '@/app/checkout/checkoutContent';
// import { toast } from 'sonner';
// import RexPayClient from '@/lib/rexpay-client';
// import rexpay from '@/components/images/rexpay.png'
// import Image from 'next/image';

// type RexpayPaymentProps = {
//     setCurrentStep: (step: CheckoutStep) => void;
//     setSelectedPayment: (method: PaymentMethod) => void;
// }

// const RexpayPayment = ({ setCurrentStep, setSelectedPayment }: RexpayPaymentProps) => {
//     const { getCartTotal, mainCcy, cart } = useCart();
//     const currency = mainCcy();
//     const total = getCartTotal();
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [checkoutData, setCheckoutData] = useState<any>(null);
//     const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');

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

//             const rexpayClient = new RexPayClient('test');
//             const verificationResponse = await rexpayClient.verifyPayment(tranId);

//             if (verificationResponse?.responseCode === '00') {
//                 setVerificationStatus('success');
//                 toast.success('Payment verified successfully!');
//                 setCurrentStep('success');
//                 clearRexpaySession();
//             } else {
//                 setVerificationStatus('failed');
//                 toast.error('Payment verification failed or is pending.');
//             }
//         } catch (error) {
//             setVerificationStatus('failed');
//             console.error('Payment verification error:', error);
//         }
//     };

//     const clearRexpaySession = () => {
//         sessionStorage.removeItem('rexpay_tranId');
//         sessionStorage.removeItem('rexpay_reference');
//         const url = new URL(window.location.href);
//         url.searchParams.delete('status');
//         window.history.replaceState({}, '', url.toString());
//     }; 

//     const initializeRexpayPayment = async () => {
//         if (!checkoutData) {
//             toast.error('Checkout data not found');
//             return;
//         }

//         setIsProcessing(true);

//         try {
//             const rexpayClient = new RexPayClient('test');
//             const transactionId = `REX${Date.now()}${Math.floor(Math.random() * 1000)}`;
//             const paymentData = {
//                 reference: transactionId,
//                 amount: Math.round(total),
//                 currency: currency === 'USD' ? 'USD' : 'NGN',
//                 userId: checkoutData.customerEmail || 'customer@example.com',
//                 mode: "Debug",

//                 callbackUrl: `${window.location.origin}/checkout?status=rexpay_callback`,
//                 clientId: process.env.REXPAY_CLIENT_ID || 'sheriffazeez333gmailcom',
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

//             // Check response based on the expected structure
//             if (response.status === 'CREATED' && response.paymentUrl) {
//                 // Success - save references and redirect
//                 sessionStorage.setItem('rexpay_tranId', transactionId);
//                 sessionStorage.setItem('rexpay_reference', response.paymentUrlReference);
//                 sessionStorage.setItem('rexpay_clientId', response.clientId);
                
//                 // Redirect to payment page
//                 window.location.href = response.paymentUrl;
//             } else {
//                 // Handle API error responses
//                 const errorMessage = response.responseMessage || 
//                                    response.responseDescription || 
//                                    'Failed to initialize payment';
//                 toast.error(errorMessage);
                
//                 // Log detailed error for debugging
//                 console.error('RexPay API Error:', response);
//             }
//         } catch (error) {
//             console.error('RexPay payment error:', error);
//             toast.error('Payment initialization failed. Please try again.');
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     if (verificationStatus === 'verifying') {
//         return (
//             <div className="max-w-md mx-auto space-y-6 text-center">
//                 <Loader2 className="w-12 h-12 animate-spin mx-auto" />
//                 <h2 className="text-2xl font-bold">Verifying Payment</h2>
//                 <p>Please wait while we confirm your payment...</p>
//             </div>
//         );
//     }

//     if (verificationStatus === 'success') {
//         return (
//             <div className="max-w-md mx-auto space-y-6 text-center">
//                 <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
//                 <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
//                 <Button onClick={() => setCurrentStep('success')}>
//                     Continue to Order Summary
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
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { CheckoutStep, PaymentMethod } from '@/app/checkout/checkoutContent';
import { toast } from 'sonner';
import RexPayClient from '@/lib/rexpay-client';
import rexpay from '@/components/images/rexpay.png'
import Image from 'next/image';

type RexpayPaymentProps = {
    setCurrentStep: (step: CheckoutStep) => void;
    setSelectedPayment: (method: PaymentMethod) => void;
}

const RexpayPayment = ({ setCurrentStep, setSelectedPayment }: RexpayPaymentProps) => {
    const { getCartTotal, mainCcy, cart } = useCart();
    const currency = mainCcy();
    const total = getCartTotal();
    const [isProcessing, setIsProcessing] = useState(false);
    const [checkoutData, setCheckoutData] = useState<any>(null);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');

    useEffect(() => {
        const stored = sessionStorage.getItem('checkout');
        if (stored) {
            setCheckoutData(JSON.parse(stored));
        }

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('status') === 'rexpay_callback') {
            handleRexpayCallback();
        }
    }, []);

    const handleRexpayCallback = async () => {
        setVerificationStatus('verifying');
        await verifyRexpayPayment();
    };

const verifyRexpayPayment = async () => {
    try {
        const tranId = sessionStorage.getItem('rexpay_tranId');
        if (!tranId) {
            setVerificationStatus('failed');
            return;
        }

        // Use environment variable to determine mode
        const mode = process.env.NEXT_PUBLIC_REXPAY_MODE === 'PROD' ? 'live' : 'test';
        const rexpayClient = new RexPayClient(mode);
        const verificationResponse = await rexpayClient.verifyPayment(tranId);

        if (verificationResponse?.responseCode === '00') {
            setVerificationStatus('success');
            toast.success('Payment verified successfully!');
            setCurrentStep('success');
            clearRexpaySession();
        } else {
            setVerificationStatus('failed');
            toast.error('Payment verification failed or is pending.');
        }
    } catch (error) {
        setVerificationStatus('failed');
        console.error('Payment verification error:', error);
    }
};

const clearRexpaySession = () => {
    try {
        sessionStorage.removeItem('rexpay_tranId');
        sessionStorage.removeItem('rexpay_reference');
        sessionStorage.removeItem('rexpay_clientId');
        const url = new URL(window.location.href);
        url.searchParams.delete('status');
        window.history.replaceState({}, '', url.toString());
    } catch (e) {
        // non-fatal: log and continue
        console.warn('Failed to clear RexPay session:', e);
    }
};

const initializeRexpayPayment = async () => {
    if (!checkoutData) {
        toast.error('Checkout data not found');
        return;
    }

    setIsProcessing(true);

    try {
        // Use environment variable to determine mode
        const mode = process.env.NEXT_PUBLIC_REXPAY_MODE === 'PROD' ? 'live' : 'test';
        const rexpayClient = new RexPayClient(mode);
        const transactionId = `REX${Date.now()}${Math.floor(Math.random() * 1000)}`;
        const paymentData = {
            reference: transactionId,
            amount: Math.round(total),
            currency: currency === 'USD' ? 'USD' : 'NGN',
            userId: checkoutData.customerEmail || 'customer@example.com',
            mode: "Debug",
            callbackUrl: `${window.location.origin}/checkout?status=rexpay_callback`,
            // Remove hardcoded clientId since it will be set automatically based on mode
            metadata: {
                email: checkoutData.customerEmail || '',
                customerName: checkoutData.customerName || 'Customer',
                orderNo: checkoutData.orderNo,
                storeCode: checkoutData.storeCode,
            },
            paymentChannel: 'DEFAULT',
            country: 'NGA',
            feeBearer: 'Merchant',
            isV2: false,
        };

        console.log('RexPay Payment Data:', paymentData);

        const response = await rexpayClient.initializePayment(paymentData);

        // Check response based on the expected structure
        if (response.status === 'CREATED' && response.paymentUrl) {
            // Success - save references and redirect
            sessionStorage.setItem('rexpay_tranId', transactionId);
            sessionStorage.setItem('rexpay_reference', response.paymentUrlReference);
            sessionStorage.setItem('rexpay_clientId', response.clientId);
            
            // Redirect to payment page
            window.location.href = response.paymentUrl;
        } else {
            // Handle API error responses
            const errorMessage = response.responseMessage || 
                               response.responseDescription || 
                               'Failed to initialize payment';
            toast.error(errorMessage);
            
            // Log detailed error for debugging
            console.error('RexPay API Error:', response);
        }
    } catch (error) {
        console.error('RexPay payment error:', error);
        toast.error('Payment initialization failed. Please try again.');
    } finally {
        setIsProcessing(false);
    }
};

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
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
                <Button onClick={() => setCurrentStep('success')}>
                    Continue to Order Summary
                </Button>
            </div>
        );
    }

    if (verificationStatus === 'failed') {
        return (
            <div className="max-w-md mx-auto space-y-6 text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h2 className="text-2xl font-bold text-red-600">Payment Verification Failed</h2>
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
                <h2 className="text-2xl font-bold">RexPay Payment</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Image src={rexpay} alt="RexPay Logo" className="w-[30%] h-[30%]" />
                        Payment Gateway
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Payment Summary */}
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

                    {/* Payment Instructions */}
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

                    {/* Action Button */}
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

                    {/* Security Notice */}
                    <div className="text-xs text-muted-foreground text-center">
                        <p>🔒 Secure payment processed by RexPay</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RexpayPayment;