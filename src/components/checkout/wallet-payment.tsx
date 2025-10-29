// components/checkout/wallet-payment.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useToast } from '@/app/hooks/use-toast';
import { useCart } from '@/store/cart';
import { CheckoutStep, PaymentMethod } from '@/app/checkout/checkoutContent';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import useCustomer from '@/store/customerStore';
import { Button } from '@/components/ui/button';

interface WalletPaymentProps {
    setCurrentStep: (step: CheckoutStep) => void;
    setSelectedPayment: (method: PaymentMethod) => void;
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
}) => {
    const [processing, setProcessing] = useState(false);
    const { toast } = useToast();
    const { clearCart, getCartTotal, mainCcy } = useCart();
    const { customer } = useCustomer();
    const ccy = mainCcy();

    // Fetch wallet balance using useQuery (matches your pattern)
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
        enabled: !!customer?.username, // Only fetch when customer data is available
    });

    const walletBalance = balanceData?.data?.wallets?.[0] as WalletBalance | undefined;

    const handlePayment = async () => {
        if (!walletBalance) return;

        setProcessing(true);
        try {
            const orderNo = sessionStorage.getItem('orderNumber') || `ORD-${Date.now()}`;
            const totalAmount = getCartTotal();

            const paymentData = {
                orderNo,
                channel: 'web',
                amount: totalAmount,
                device: 'web'
            };

            const response = await axiosCustomer.request({
                method: 'POST',
                url: '/payment-methods/pay-with-wallet',
                data: paymentData,
                params: {
                    storeCode: process.env.NEXT_PUBLIC_STORE_CODE || '',
                }
            });

            if (response.data.responseCode === '000') {
                // Payment successful
                clearCart();
                setCurrentStep('success');
                toast({
                    title: "Payment Successful",
                    description: "Your payment was processed successfully",
                });
            } else {
                throw new Error(response.data.responseMessage || 'Payment failed');
            }
        } catch (error: any) {
            console.error('Payment error:', error);
            toast({
                title: "Payment Failed",
                description: error?.response?.data?.responseMessage || error?.message || "Please try again",
                variant: "destructive",
            });
        } finally {
            setProcessing(false);
        }
    };

    const isBalanceSufficient = walletBalance && walletBalance.balance >= getCartTotal();

    if (isLoading) {
        return (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                    <span className="ml-2">Loading wallet...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="text-center py-8">
                    <div className="text-red-500 mb-4">Failed to load wallet</div>
                    <Button
                        onClick={() => setSelectedPayment(null)}
                        className="bg-accent hover:bg-accent-foreground"
                    >
                        Choose Another Payment Method
                    </Button>
                </div>
            </div>
        );
    }

    if (!walletBalance) {
        return (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="text-center py-8">
                    <div className="text-gray-500 mb-4">No wallet found</div>
                    <Button
                        onClick={() => setSelectedPayment(null)}
                        className="bg-accent hover:bg-accent-foreground"
                    >
                        Choose Another Payment Method
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => setSelectedPayment(null)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold">Wallet Payment</h2>
            </div>

            {/* Wallet Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
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
                        <p className="text-sm text-gray-600">{walletBalance.label}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Available Balance:</span>
                        <span className="font-semibold text-lg">
                            {walletBalance.balance.toFixed(2)} {walletBalance.symbol}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Local Currency:</span>
                        <span>{walletBalance.lcyBalance.toFixed(2)} {walletBalance.lcyCcy}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Account Number:</span>
                        <span>{walletBalance.accountNo}</span>
                    </div>
                </div>
            </div>

            {/* Order Total */}
            <div className="mb-6 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order Total:</span>
                    <span className="font-semibold text-lg">
                        {getCartTotal().toFixed(2)} {ccy}
                    </span>
                </div>
            </div>

            {/* Insufficient Balance Warning */}
            {!isBalanceSufficient && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
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
                                You need {(getCartTotal() - walletBalance.balance).toFixed(2)} {walletBalance.symbol} more to complete this payment.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Button */}
            <Button
                onClick={handlePayment}
                disabled={!isBalanceSufficient || processing}
                className="w-full bg-accent hover:bg-accent-foreground disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center mb-3"
            >
                {processing ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Processing Payment...
                    </>
                ) : (
                    `Pay ${getCartTotal().toFixed(2)} ${ccy}`
                )}
            </Button>

            {/* Back to Payment Methods */}
            <Button
                onClick={() => setSelectedPayment(null)}
                variant="outline"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
                Choose Another Payment Method
            </Button>
        </div>
    );
};

export default WalletPayment;