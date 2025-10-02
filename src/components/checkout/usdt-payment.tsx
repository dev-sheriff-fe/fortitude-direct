'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ArrowLeft, Copy, Wallet, CheckCircle, ExternalLink, Clock, X, RefreshCw, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { useCart } from '@/store/cart'
import { useToast } from '@/app/hooks/use-toast'
import { useMutation, useQuery } from '@tanstack/react-query'
import axiosInstance from '@/utils/fetch-function'
import QrCode from 'react-qr-code'
import { useRouter, useSearchParams } from 'next/navigation'
import { CurrencyCode, formatPrice } from '@/utils/helperfns'
import { CheckoutStep } from '@/app/checkout/checkoutContent'
import { toast } from 'sonner'
import Image from 'next/image'
import axiosCustomer from '@/utils/fetch-function-customer'
import useCustomer from '@/store/customerStore'
import { PaymentCheckingScreen, PaymentErrorScreen, PaymentPendingScreen, PaymentSuccessScreen } from './usdt-payment/payment-states'

type UsdtPaymentProps = {
  setCurrentStep: (step: CheckoutStep) => void;
  copyToClipboard: (text: string) => void;
  currentStep: CheckoutStep
}
type PaymentVerificationStatus = 'idle' | 'checking' | 'success' | 'pending' | 'error';
type TransactionDetails = {
  txId: string;
  contractAddress: string;
  merchantAddress: string;
  amount: number;
  symbol: string;
  status: string;
  orderNo: string;
  fromAddress: string;
  attestationRef: string;
  timestamp: number;
}


const logoWhite = process.env.NEXT_PUBLIC_LOGO_URL!;

const UsdtPayment = ({setCurrentStep, copyToClipboard, currentStep}: UsdtPaymentProps) => {
    const {getCartTotal, mainCcy, cart} = useCart()
    const searchParams = useSearchParams()
    const [paymentStep, setPaymentStep] = useState<'success'|'failed'|null>(null)
    const [countdown, setCountdown] = useState<number>(0)
    const storeCode = searchParams.get('storeCode') || ''
    const ccy = mainCcy()
    const {customer} = useCustomer()
    const cartTotal = getCartTotal();
    const [status, setStatus] = useState("");
    const [txId, setTxId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
    const [selectedChain, setSelectedChain] = useState<any | null>(null);
    const [chainDets, setChainDets] = useState<any>(null);
    const [checkoutData, setCheckoutData] = useState<any>(null);
    const [isGeneratingAddress, setIsGeneratingAddress] = useState(false);
    const [paymentVerificationStatus, setPaymentVerificationStatus] = useState<PaymentVerificationStatus>('idle');
    const [paymentResponse, setPaymentResponse] = useState<any>(null);


    // Local copy function to avoid external dependencies
    const handleCopyToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
      } catch (error) {
        console.error('Copy failed:', error);
        // Fallback for older browsers
        try {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          toast.success('Copied to clipboard!');
        } catch (fallbackError) {
          console.error('Fallback copy failed:', fallbackError);
          toast.error('Failed to copy to clipboard');
        }
      }
    };

    console.log(customer);
    
    // Load checkout data from sessionStorage
    useEffect(() => {
      const stored = sessionStorage.getItem('checkout');
      if (stored) {
        try {
          setCheckoutData(JSON.parse(stored));
        } catch (error) {
          console.error('Error parsing checkout data:', error);
          toast.error('Error loading checkout data');
        }
      }
    }, []);


    const {mutate: generateChain, isPending} = useMutation({
      mutationFn: (data: any) => axiosCustomer.request({
        url: '/store/generate-pay-address',
        method: 'POST',
        data
      }),
      onSuccess: (data) => {
        setIsGeneratingAddress(false);
        // if (data?.data?.code !== '000') {
        //   toast.error(data?.data?.desc || "An error occurred");
        //   return;
        // }
        setChainDets(data?.data || null);
      },
      onError: (error: any) => {
        setIsGeneratingAddress(false);
        console.error('Chain generation error:', error);
        toast.error(error?.message || "Failed to generate address");
      }
    });

    const {data:chainList} = useQuery({
      queryKey: ['chains'],
      queryFn: () => axiosCustomer.request({
        url: `/coinwallet/chains`,
        method: 'GET',
        params: {
          categoryCode: ''
        }
      }),
      refetchOnMount: false
    })

    console.log(chainList);
    

    // const {data, error, isLoading: loading} = useQuery({
    //   queryKey: ['usdtPayment', currentStep],
    //   queryFn: () => axiosCustomer.request({
    //     url: '/store/wallet-details',
    //     method: 'GET',
    //     params: {
    //       storeCode,
    //       entityCode: 'H2P'
    //     },
    //   }).then(res => res.data),
    //   refetchOnMount: false
    // });

    const generateAddress = useCallback((chain: any) => {
      console.log('generateAddress called with:', { chain, checkoutData });
      
      if (!chain) {
        console.log('No chain provided');
        return;
      }

      if (!checkoutData?.orderNo) {
        console.log('No orderNo in checkoutData');
        toast.error('Order information missing. Please try again.');
        return;
      }

      setIsGeneratingAddress(true);
      
      const payload = {
        symbol: chain.code === 'BASE-SEPOLIA' ? 'USDC' : 'USDT',
        chain: chain?.code,
        orderNo: checkoutData.orderNo,
        storeCode,
        entityCode: customer?.entityCode || ''
      };

      console.log('Generated payload:', payload);
      generateChain(payload);
    }, [checkoutData, storeCode, generateChain]);

    const handleChainSelection = (chain: any) => {
      console.log('Chain selected:', chain);
      setSelectedChain(chain);
      generateAddress(chain);
      setPaymentVerificationStatus('idle');
    };


    console.log(selectedChain);
    console.log(chainDets);
    
    
    const handleBackToChainSelection = () => {
      setSelectedChain(null);
      setChainDets(null);
       setPaymentVerificationStatus('idle');
    };

    const {mutate: checkPaymentStatus, isPending: checkingPaymentStatus} = useMutation({
      mutationFn: (data: any) => axiosCustomer.request({
        url: '/store/payment-status',
        method: 'POST',
        data
      }),
      onSuccess: (data) => {
        setPaymentResponse(data?.data);
        
        if (data?.data?.responseCode === '000') {
          setPaymentVerificationStatus('success');
          setTransactionDetails(data?.data)
          toast.success('Payment confirmed successfully!');
        }
          else if(data?.data?.responseCode === 'PP') {
            setPaymentVerificationStatus('pending')
            toast('Transaction is processing!')
          }
         else {
          setPaymentVerificationStatus('error');
          toast.error(data?.data?.responseMessage || 'Payment verification failed');
        }
      },
      onError: (error: any) => {
        setPaymentVerificationStatus('error');
        setPaymentResponse({
          responseCode: 'ERROR',
          responseMessage: error?.message || 'Network error occurred'
        });
        toast.error('Failed to check payment status');
      }
    });

    const checkPayment = ()=>{
      const payload = {
        symbol: chainDets?.chain === 'BASE-SEPOLIA' ? 'USDC' : 'USDT',
        chain: chainDets?.chain,
        orderNo: checkoutData.orderNo,
        storeCode,
        entityCode: customer?.entityCode || ''
      }

      checkPaymentStatus(payload);
    }

    console.log(chainList?.data?.list);

     const retryPaymentCheck = () => {
      checkPayment();
    };

    const startOver = () => {
      setPaymentVerificationStatus('idle');
      setPaymentResponse(null);
      handleBackToChainSelection();
    };

   
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
      <div className="min-h-screen w-full bg-gray-50 flex flex-col lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:bottom-0 lg:w-screen lg:grid lg:grid-cols-2">
        {/* Left Panel - Payment Summary - Mobile: Show at top, Desktop: Left side */}
        <div className='relative bg-accent w-full p-4 text-white lg:h-screen'>
          <div className="absolute inset-0 bg-black/30 pointer-events-none lg:block hidden"></div>
          
          {/* Header with back button and logo */}
          <div className="flex items-center justify-between mb-4 relative z-10">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setCurrentStep('cart')}
              className="text-white hover:bg-white/10 p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <div className='flex items-center gap-2 bg-white/20 p-2 rounded-md'>
              <Image
                src={logoWhite}
                alt="Logo"
                width={100}
                height={100}
                unoptimized
                className="object-contain"
              />
              {/* <h2 className='text-lg lg:text-xl font-semibold'>Help2Pay</h2> */}
            </div>
          </div>

          {/* Payment info */}
          <div className='space-y-3 lg:space-y-4 relative z-10'>
            <p className="text-sm lg:text-lg text-white/70">Pay with Crypto</p>
            <p className='font-semibold text-xl lg:text-3xl'>
              {checkoutData?.payingAmount?.toFixed(2) || cartTotal.toFixed(2)} USDT
            </p>
          </div>

          {/* Cart items - Hide on mobile when chain is selected to save space */}
          <div className={`mt-4 lg:mt-8 relative z-10 ${selectedChain ? 'hidden lg:block' : ''}`}>
            <div className='space-y-2 lg:space-y-4 border-b border-white/20 pb-3 lg:pb-4'>
              {cart?.map((item) => (
                <div className='flex items-center justify-between text-sm lg:text-base' key={item.id}>
                  <p className="text-white/70 truncate pr-2">{item.name}</p>
                  <p className='font-semibold flex-shrink-0'>
                    {formatPrice(item?.salePrice, item?.ccy as CurrencyCode)}
                  </p>
                </div>
              ))}
            </div>

            <div className='flex items-center justify-between mt-3 lg:mt-4 pt-3 lg:pt-4'>
              <p className="text-sm lg:text-lg text-white/70">Total</p>
              <p className='font-semibold text-sm lg:text-lg'>
                {formatPrice(cartTotal, ccy as CurrencyCode)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Chain Selection or Payment Details */}
        <div className='flex-1 w-full p-4 lg:h-screen overflow-y-auto'>
          {/* Payment Verification Status Screens */}
          {checkingPaymentStatus && <PaymentCheckingScreen
            chainDets={chainDets}
            checkoutData={checkoutData}
            retryPaymentCheck={retryPaymentCheck}
          />}
          {paymentVerificationStatus === 'success' && <PaymentSuccessScreen 
            paymentResponse={paymentResponse}
            startOver={startOver}
            handleCopyToClipboard={handleCopyToClipboard}
            transactionDetails= {transactionDetails}
          />}
          {paymentVerificationStatus === 'error' && <PaymentErrorScreen 
            checkingPaymentStatus={checkingPaymentStatus}
            paymentResponse={paymentResponse}
            retryPaymentCheck={retryPaymentCheck}
            startOver={startOver}
          />}
          {paymentVerificationStatus === 'pending' && <PaymentPendingScreen
            chainDets={chainDets}
            checkoutData={checkoutData}
            retryPaymentCheck={retryPaymentCheck}
          />}
          
          {/* Default Flow */}
          {paymentVerificationStatus === 'idle' && !checkingPaymentStatus && (
            <>
              {selectedChain ? (
                // Payment Details View
                <div className='flex flex-col justify-start lg:justify-center items-center h-full'>
                  <div className="w-full max-w-md space-y-4 lg:space-y-6">
                    {/* Back Button */}
                    <Button 
                      onClick={handleBackToChainSelection}
                      variant="ghost"
                      className="w-full lg:w-auto mb-2 lg:mb-4"
                    >
                      <X className='w-4 h-4 mr-2'/>
                      Back to Chain Selection
                    </Button>

                    {/* Chain Info */}
                    {/* <div className="text-center">
                      <h2 className="text-xl lg:text-2xl font-bold mb-2">Payment Details</h2>
                      <p className="text-muted-foreground text-sm lg:text-base">
                        Selected Chain: <span className="font-semibold">{selectedChain.name}</span>
                      </p>
                    </div> */}

                    {/* Loading State */}
                    {(isGeneratingAddress || isPending) && (
                      <Card>
                        <CardContent className="p-4 lg:p-6 text-center">
                          <Clock className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-4 animate-spin text-blue-500" />
                          <p className="text-sm lg:text-base">Generating payment address...</p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Success State - Payment Address Generated */}
                    {chainDets && (
                      <Card className='w-full'>
                        <CardHeader className="pb-3 lg:pb-4">
                          <CardTitle className="text-center text-lg lg:text-xl">
                            <Image
                              src={chainDets?.logo || ''}
                              alt={chainDets.name}
                              height={40}
                              width={40}
                              unoptimized
                              className='mx-auto mb-2'
                            />
                            Send {checkoutData?.payingAmount?.toFixed(2) || cartTotal.toFixed(2)} {chainDets?.symbol}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-4 lg:p-6">
                          {/* Payment Address */}
                          <div>
                            <Label className="text-xs lg:text-sm font-medium">Payment Address</Label>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-1">
                              <code className="flex-1 p-2 bg-muted rounded text-xs lg:text-sm break-all w-full sm:w-auto">
                                {chainDets.publicAddress || 'Address not available'}
                              </code>
                              <Button
                                type='button'
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (chainDets.publicAddress) {
                                    handleCopyToClipboard(chainDets.publicAddress);
                                  }
                                }}
                                disabled={!chainDets.publicAddress}
                                className="w-full sm:w-auto flex-shrink-0"
                              >
                                <Copy className="w-4 h-4 mr-1 sm:mr-0" />
                                <span className="sm:hidden">Copy Address</span>
                              </Button>
                            </div>
                          </div>

                          {/* Network and Amount */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs lg:text-sm font-medium">Network</Label>
                              <p className="text-xs lg:text-sm text-muted-foreground mt-1">{chainDets?.chain}</p>
                            </div>
                            <div>
                              <Label className="text-xs lg:text-sm font-medium">Amount</Label>
                              <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                                {checkoutData?.payingAmount?.toFixed(2) || cartTotal.toFixed(2)} {chainDets?.symbol}
                              </p>
                            </div>
                          </div>

                          {/* Order Number */}
                          {checkoutData?.orderNo && (
                            <div>
                              <Label className="text-xs lg:text-sm font-medium">Order Number</Label>
                              <p className="text-xs lg:text-sm text-muted-foreground mt-1 break-all">{checkoutData.orderNo}</p>
                            </div>
                          )}

                          {/* Instructions */}
                          <div className="bg-blue-50 p-3 lg:p-4 rounded-lg border">
                            <h4 className="font-medium text-blue-900 mb-2 text-sm lg:text-base">Payment Instructions:</h4>
                            <ol className="text-xs lg:text-sm text-blue-800 space-y-1">
                              <li>1. Copy the payment address above</li>
                              <li>2. Send exactly {checkoutData?.payingAmount?.toFixed(2) || cartTotal.toFixed(2)} {chainDets?.symbol} to this address</li>
                              <li>3. Make sure you're using the {selectedChain.name} network</li>
                              <li>4. Click "I've Sent the Payment" after sending</li>
                            </ol>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-2">
                            <Button 
                              onClick={checkPayment}
                              className="w-full"
                              disabled={!chainDets.publicAddress || checkingPaymentStatus}
                              size="sm"
                            >
                              {checkingPaymentStatus ? (
                                <>
                                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                                  Verifying...
                                </>
                              ) : (
                                <>
                                  <Wallet className="w-4 h-4 mr-2" />
                                  I've Sent the Payment
                                </>
                              )}
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              onClick={handleBackToChainSelection}
                              className="w-full"
                              size="sm"
                            >
                              Choose Different Chain
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              ) : (
                // Chain Selection View
                <div className='flex flex-col justify-start lg:justify-center items-center w-full h-full py-4 lg:py-0'>
                  <div className="w-full max-w-md">
                    <h2 className="text-xl lg:text-2xl font-bold text-center mb-4 lg:mb-6">Select a Chain</h2>
                    
                    {/* Chain Selection Grid */}
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 lg:gap-3 max-h-80 lg:max-h-96 overflow-y-auto'>
                      {chainList?.data?.list?.map((chain: any, index: number) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="h-auto p-3 lg:p-4 flex flex-col items-center gap-1 lg:gap-2 hover:border-primary hover:bg-primary/5 text-center"
                          onClick={() => handleChainSelection(chain)}
                          disabled={isGeneratingAddress || !checkoutData?.orderNo}
                        >
                          {/* <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-primary" />
                          </div> */}
                          <Image
                          src={chain?.otherInfo||''}
                          alt={chain.name || 'logo'}
                          height={40}
                          width={40}
                          unoptimized
                          />
                          <span className="font-medium text-xs lg:text-sm">{chain.code}</span>
                          <span className="text-xs text-muted-foreground leading-tight">{chain.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
}

export default UsdtPayment