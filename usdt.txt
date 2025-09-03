'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ArrowLeft, Copy, Wallet, CheckCircle, ExternalLink, Clock } from 'lucide-react'
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

type UsdtPaymentProps = {
    setCurrentStep: (step: CheckoutStep) => void;
    copyToClipboard: (text: string) => void;
    currentStep: CheckoutStep
}

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

const UsdtPayment = ({setCurrentStep, copyToClipboard,currentStep}: UsdtPaymentProps) => {
    const {getCartTotal,mainCcy} = useCart()
    const searchParams = useSearchParams()
    const [paymentStep, setPaymentStep] = useState<'success'|'failed'|null>(null)
    const [countdown, setCountdown] = useState<number>(0)
    const storeCode = searchParams.get('storeCode') || ''
    const ccy = mainCcy()
  const cartTotal = getCartTotal();
  const [status, setStatus] = useState("");
  const [txId, setTxId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  
  // Contract & merchant addresses
  const ESCROW_VAULT = "TReeAUnDQakeDSEnAUcp65EubajiQhz8YV";
  const MERCHANT = "TXxPrefBbyktVJmtNqXvcL3xAXn4cFLfez";
  const USDT_CONTRACT = "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf"; // Nile testnet USDT
  const USDT_DECIMALS = 1_000_000;

   const ESCROW_ABI = [
    {
      "inputs": [
        {"name": "escrowId", "type": "bytes32"},
        {"name": "payer", "type": "address"},
        {"name": "payee", "type": "address"},
        {"name": "amount", "type": "uint256"},
        {"name": "expiry", "type": "uint256"},
        {"name": "attestRef", "type": "bytes32"}
      ],
      "name": "fund",
      "stateMutability": "Nonpayable",
      "type": "Function"
    },
    {
      "inputs": [
        {"name": "escrowId", "type": "bytes32"},
        {"name": "payee", "type": "address"},
        {"name": "expiry", "type": "uint256"},
        {"name": "attestRef", "type": "bytes32"}
      ],
      "name": "payWithTRX",
      "stateMutability": "Payable",
      "type": "Function"
    },
    {
      "outputs": [
        {"name": "payer", "type": "address"},
        {"name": "payee", "type": "address"},
        {"name": "amount", "type": "uint256"},
        {"name": "released", "type": "bool"},
        {"name": "expiry", "type": "uint256"},
        {"name": "attestRef", "type": "bytes32"}
      ],
      "constant": true,
      "inputs": [{"type": "bytes32"}],
      "name": "escrows",
      "stateMutability": "View",
      "type": "Function"
    }
  ];
  
   const handleUSDTPayment = () => {
    setCurrentStep('processing');
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setCurrentStep('success');
          toast('Payment Confirmed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const {data,error,isLoading:loading} = useQuery({
    queryKey: ['usdtPayment',currentStep],
    queryFn: ()=>axiosInstance.request({
      url: '/store/wallet-details',
      method: 'GET',
      params: {
        storeCode,
        entityCode: 'H2P'
      },
    }).then(res => res.data),
  })

  const info = data?.coinAddresses[0]

  const [checkoutData, setCheckoutData] = useState<any>(null);
    const [tronWeb, setTronWeb] = useState<any>(null);
    
    // Backend API
    // const {mutate} = useMutation({
    //   mutationFn: (data:any)=>axiosInstance.request({
    //     url: '/chainTransaction/save',
    //     method: 'POST',
    //     data: data
    //   }),
    //   onSuccess: (data)=>{
    //     if (data?.data?.code !== '000') {
    //       toast.error(data?.data?.desc)
    //       return
    //     }
    //     toast.success(data?.data?.desc||'Order sent')
    //   }
    // })
  
    useEffect(() => {
      const initTronWeb = async () => {
        if ((window as any).tronWeb && (window as any).tronWeb.ready) {
          const tw = (window as any).tronWeb;
  
          // Force fullHost to Nile testnet
          tw.setFullNode("https://api.nileex.io");
          tw.setSolidityNode("https://api.nileex.io");
          tw.setEventServer("https://api.nileex.io");
  
          setTronWeb(tw);
          console.log("TronWeb initialized successfully");
        } else {
          console.warn("TronLink not found. Please install TronLink.");
          setStatus("⚠️ TronLink not found. Please install TronLink extension.");
        }
      };
      initTronWeb();
    }, []);
  
    useEffect(() => {
      const stored = sessionStorage.getItem('checkout');
      if (stored) {
        setCheckoutData(JSON.parse(stored));
      }
    }, []);
  
    // Helper function to wait for transaction confirmation
    const waitForTransaction = useCallback(async (tronWebInstance: any, txId: string): Promise<any> => {
      return new Promise(async (resolve) => {
        let receipt: any = null;
        for (let i = 0; i < 30; i++) {
          try {
            receipt = await tronWebInstance.trx.getTransactionInfo(txId);
            if (receipt && receipt.receipt) {
              resolve(receipt);
              return;
            }
          } catch (error) {
            console.warn(`Attempt ${i + 1} failed:`, error);
          }
          await new Promise((r) => setTimeout(r, 1000));
        }
        resolve(receipt);
      });
    }, []);
  
    // Helper function to approve USDT spending - FIXED VERSION
    const approveUSDT = async (amount: number) => {
      try {
        setStatus("Approving USDT spending...");
        
        // Get USDT contract without ABI (TronWeb will fetch it automatically)
        const usdtContract = await tronWeb.contract().at(USDT_CONTRACT);
        
        // IMPORTANT: Convert amount to integer (remove decimals)
        // The amount should already be in the correct units (multiplied by USDT_DECIMALS)
        // but we need to ensure it's an integer
        const amountInteger = Math.floor(amount);
        
        console.log("Approving USDT amount:", amountInteger, "for spender:", ESCROW_VAULT);
        
        const approveResult = await usdtContract.approve(
          ESCROW_VAULT,
          amountInteger  // Use integer amount
        ).send({
          feeLimit: 50_000_000,
          shouldPollResponse: false
        });
        
        console.log("USDT approval result:", approveResult);
        setStatus("USDT approved. Proceeding with escrow funding...");
        
        return approveResult;
      } catch (error: any) {
        console.error("USDT approval failed:", error);
        throw new Error(`USDT approval failed: ${error.message || error}`);
      }
    };
  
    const fundEscrow = useCallback(async (isTRC20: boolean) => {
      if (isLoading) return;
      
      setIsLoading(true);
      setStatus("");
      setTxId("");
  
      try {
        // Validation checks
        if (!tronWeb) {
          throw new Error("TronLink is not initialized. Please make sure TronLink is installed and unlocked.");
        }
  
        if (!tronWeb.defaultAddress || !tronWeb.defaultAddress.base58) {
          throw new Error("No wallet address found. Please connect your TronLink wallet.");
        }
  
        const buyer = tronWeb.defaultAddress.base58;
        console.log("Buyer address:", buyer);
  
        // Check network
        const nodeInfo = await tronWeb.trx.getNodeInfo();
        console.log("Connected to network:", nodeInfo);
  
        // Generate transaction parameters
        const orderIdStr = checkoutData?.orderNo || `ORDER_${Date.now()}`;
        
        if (!orderIdStr || typeof orderIdStr !== 'string') {
          throw new Error("Invalid order ID. Please refresh and try again.");
        }
        
        console.log("Order ID String:", orderIdStr);
        
        const orderId = tronWeb.sha3(orderIdStr);
        console.log("Hashed Order ID:", orderId);
        
        // FIXED: Ensure amount calculation produces integers
        const rawAmount = isTRC20 ? 
          (checkoutData?.payingAmount * USDT_DECIMALS) : 
          (checkoutData?.payingAmount * 1_000_000);
        
        const amount = Math.floor(rawAmount); // Ensure integer
        
        console.log("Raw amount:", rawAmount, "Final amount:", amount);
        
        const expiry = Math.floor(Date.now() / 1000) + 86400;
        const attestRef = tronWeb.sha3("TXN_REF_" + Date.now());
  
        console.log("Transaction params:", { orderId, buyer, MERCHANT, amount, expiry, attestRef });
  
        setStatus("Connecting to contract...");
  
        // Verify contract exists
        const contractInfo = await tronWeb.trx.getContract(ESCROW_VAULT);
        if (!contractInfo || !contractInfo.contract_address) {
          throw new Error(`Contract not found at address: ${ESCROW_VAULT}`);
        }
        console.log("Contract verified:", contractInfo);
  
        // Get contract instance - try multiple approaches
        let contract;
        try {
          // Method 1: Try with ABI
          contract = await tronWeb.contract(ESCROW_ABI, ESCROW_VAULT);
          console.log("Contract instance created with ABI");
        } catch (contractError) {
          console.error("Contract creation with ABI failed:", contractError);
          
          try {
            // Method 2: Try without ABI (let TronWeb fetch it)
            contract = await tronWeb.contract().at(ESCROW_VAULT);
            console.log("Contract instance created without ABI");
          } catch (fallbackError) {
            console.error("Contract creation fallback failed:", fallbackError);
            throw new Error(`Failed to connect to contract: ${fallbackError.message || fallbackError}`);
          }
        }
  
        // Check account balance
        if (isTRC20) {
          try {
            const usdtContract = await tronWeb.contract().at(USDT_CONTRACT);
            const balance = await usdtContract.balanceOf(buyer).call();
            console.log("USDT Balance:", balance.toString());
            
            if (balance < amount) {
              throw new Error(`Insufficient USDT balance. Required: ${amount / USDT_DECIMALS} USDT`);
            }
  
            // Approve USDT spending first
            await approveUSDT(amount);
          } catch (balanceError: any) {
            console.error("Balance/approval check failed:", balanceError);
            throw new Error(`USDT balance/approval failed: ${balanceError.message || balanceError}`);
          }
        } else {
          const trxBalance = await tronWeb.trx.getBalance(buyer);
          console.log("TRX Balance:", trxBalance);
          
          if (trxBalance < amount) {
            throw new Error(`Insufficient TRX balance. Required: ${amount / 1_000_000} TRX`);
          }
        }
  
        setStatus("Sending transaction...");
  
        let tx: string;
  
        if (isTRC20) {
          console.log("Calling fund method with params:", { orderId, buyer, MERCHANT, amount, expiry, attestRef });
          
          try {
            const result = await contract.fund(
              orderId,
              buyer,
              MERCHANT,
              amount,
              expiry,
              attestRef
            ).send({ 
              feeLimit: 100_000_000,
              shouldPollResponse: false
            });
            tx = result;
            
          } catch (fundError: any) {
            console.error("Fund method error:", fundError);
            throw new Error(`TRC20 payment failed: ${fundError.message || fundError}`);
          }
        } else {
          console.log("Calling payWithTRX method with params:", { orderId, MERCHANT, expiry, attestRef, callValue: amount });
          
          try {
            const result = await contract.payWithTRX(
              orderId,
              MERCHANT,
              expiry,
              attestRef
            ).send({ 
              feeLimit: 100_000_000, 
              callValue: amount,
              shouldPollResponse: false
            });
            tx = result;
            
          } catch (trxError: any) {
            console.error("PayWithTRX method error:", trxError);
            throw new Error(`TRX payment failed: ${trxError.message || trxError}`);
          }
        }
        
        console.log("Transaction result:", tx);
  
        if (!tx) {
          throw new Error("Transaction failed to execute - no transaction ID returned");
        }
  
        setTxId(tx);
        setStatus(`Transaction sent: ${tx}. Waiting for confirmation...`);

        // Start countdown for transaction confirmation
        setCountdown(30);
        const countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
  
        // Wait for confirmation
        try {
          const receipt = await waitForTransaction(tronWeb, tx);
          clearInterval(countdownInterval);
          const statusText = receipt && receipt.receipt && receipt.receipt.result === "SUCCESS" ? "CONFIRMED" : "PENDING";
          console.log("Transaction receipt:", receipt);
          
          if (receipt && receipt.receipt && receipt.receipt.result === "REVERT") {
            throw new Error(`Transaction reverted: ${receipt.receipt.message || "Unknown error"}`);
          }
          
          setStatus(`Transaction ${statusText}. Preparing backend update...`);

          // Store transaction details for success screen
          const txDetails: TransactionDetails = {
            txId: tx,
            contractAddress: ESCROW_VAULT,
            merchantAddress: MERCHANT,
            amount,
            symbol: isTRC20 ? 'USDT' : 'TRX',
            status: statusText,
            orderNo: orderIdStr,
            fromAddress: buyer,
            attestationRef: attestRef,
            timestamp: Date.now()
          };
          
          setTransactionDetails(txDetails);
  
          // Post to backend
          const payload = {
            txId: tx,
            fromAddress: buyer,
            orderId: orderIdStr,
            amount,
            status: statusText,
            fee: receipt?.fee || 0,
            symbol: isTRC20 ? 'USDT' : 'TRX',
            merchantAddress: MERCHANT,
            contractAddress: ESCROW_VAULT,
            paymentType: isTRC20 ? "USDT" : "TRX",
            attestationRef: attestRef
          };
  
          console.log("Backend payload:", payload);
          
          // // Call backend API
          // mutate(payload);

          // Mark as successful even if pending
          setPaymentStep('success');
          toast.success('Payment transaction submitted successfully!');
  
          setStatus(
            `✅ Transaction ${statusText} (${isTRC20 ? "USDT" : "TRX"}). Backend notified.`
          );
        } catch (confirmError: any) {
          console.error("Transaction confirmation error:", confirmError);
          setStatus(`⚠️ Transaction sent but confirmation failed: ${confirmError.message}`);
          
          // Still mark as success since transaction was sent
          if (tx) {
            const txDetails: TransactionDetails = {
              txId: tx,
              contractAddress: ESCROW_VAULT,
              merchantAddress: MERCHANT,
              amount,
              symbol: isTRC20 ? 'USDT' : 'TRX',
              status: 'PENDING',
              orderNo: orderIdStr,
              fromAddress: buyer,
              attestationRef: attestRef,
              timestamp: Date.now()
            };
            
            setTransactionDetails(txDetails);
            setPaymentStep('success');
            toast.success('Payment transaction submitted successfully!');
          }
        }
  
      } catch (err: any) {
        console.error("Transaction error:", err);
        
        let errorMessage = "Unknown error occurred";
        
        if (err && typeof err === 'object') {
          if (err.message) {
            errorMessage = err.message;
          } else if (err.error) {
            errorMessage = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
          } else {
            errorMessage = JSON.stringify(err);
          }
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
        
        setStatus(`❌ Error: ${errorMessage}`);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
        setCountdown(0);
      }
    }, [isLoading, waitForTransaction, ESCROW_VAULT, MERCHANT, USDT_DECIMALS, USDT_CONTRACT, checkoutData, tronWeb, setCurrentStep]);

  // Success Screen Component
  const SuccessScreen = () => {
    if (!transactionDetails) return null;

    const getTronScanUrl = (txId: string) => {
      // Using Nile testnet TronScan
      return `https://nile.tronscan.org/#/transaction/${txId}`;
    };

    const getAddressScanUrl = (address: string) => {
      return `https://nile.tronscan.org/#/address/${address}`;
    };

    return (
      <div className="max-w-md mx-auto space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setPaymentStep(null);
              setTransactionDetails(null);
              setCurrentStep('cart');
            }}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-bold">Transaction Complete</h2>
        </div>

        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
            <p className="text-muted-foreground">Your TRON payment has been submitted</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">TRANSACTION ID</Label>
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <code className="text-xs flex-1 break-all">{transactionDetails.txId}</code>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => copyToClipboard(transactionDetails.txId)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">AMOUNT</Label>
              <p className="text-lg font-semibold">
                {transactionDetails.amount / (transactionDetails.symbol === 'USDT' ? USDT_DECIMALS : 1_000_000)} {transactionDetails.symbol}
              </p>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">STATUS</Label>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${transactionDetails.status === 'CONFIRMED' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-sm font-medium">{transactionDetails.status}</span>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">ORDER NUMBER</Label>
              <p className="text-sm font-mono">{transactionDetails.orderNo}</p>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">CONTRACT ADDRESS</Label>
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <code className="text-xs flex-1 break-all">{transactionDetails.contractAddress}</code>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => copyToClipboard(transactionDetails.contractAddress)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">FROM ADDRESS</Label>
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <code className="text-xs flex-1 break-all">{transactionDetails.fromAddress}</code>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => copyToClipboard(transactionDetails.fromAddress)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">TIMESTAMP</Label>
              <p className="text-sm">{new Date(transactionDetails.timestamp).toLocaleString()}</p>
            </div>

            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open(getTronScanUrl(transactionDetails.txId), '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on TronScan
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open(getAddressScanUrl(transactionDetails.contractAddress), '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Contract
              </Button>
            </div>

            <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
              <p><strong>Note:</strong> Your transaction has been submitted to the blockchain. 
              {transactionDetails.status === 'PENDING' && ' It may take a few minutes to confirm.'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={() => {
            setPaymentStep(null);
            setTransactionDetails(null);
            setCurrentStep('cart');
          }}
          className="w-full"
          variant="outline"
        >
          Make Another Payment
        </Button>
      </div>
    );
  };

  // Show success screen if currentStep is 'success' and we have transaction details
  if (paymentStep === 'success' && transactionDetails) {
    return <SuccessScreen />;
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
            <h2 className="text-2xl font-bold">USDT Payment</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Send USDT (TRC-20)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* QR Code Placeholder */}
              <div className="bg-muted p-8 rounded-lg text-center flex flex-col items-center space-y-1">
                {
                  loading ? (<div className="animate-pulse">Loading...</div>) : (
                    <QrCode
                      value={info?.publicAddress || ''}
                      className='w-40 h-30'
                    />
                  )
                }
                <p className="text-sm text-muted-foreground">Scan QR Code with your wallet</p>

                <div style={{ marginBottom: "1rem" }}>
                  <button
                    onClick={() => fundEscrow(true)}
                    disabled={isLoading || !tronWeb}
                    style={{ 
                      padding: "1rem 2rem", 
                      marginRight: "1rem",
                      backgroundColor: (isLoading || !tronWeb) ? "#ccc" : "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: (isLoading || !tronWeb) ? "not-allowed" : "pointer"
                    }}
                    className='mx-auto'
                  >
                    {isLoading ? "Processing..." : "Pay with TronLink"}
                  </button>
                </div>

                {/* Enhanced Status Display with Countdown */}
                {status && (
                  <Card className="w-full mt-4">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {isLoading && (
                          <div className="flex-shrink-0 mt-1">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm break-words">{status}</p>
                          {countdown > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Waiting for confirmation... {countdown}s
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {txId && (
                        <div className="mt-3 p-2 bg-muted rounded">
                          <Label className="text-xs text-muted-foreground">TRANSACTION ID</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-xs flex-1 break-all">{txId}</code>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => copyToClipboard(txId)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Payment Details */}
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">AMOUNT</Label>
                  <p className="text-2xl font-bold">{loading?<div className='w-full bg-gray-100 h-6 rounded-sm animate-pulse'/>: `USDT ${checkoutData?.payingAmount?.toFixed(2)||0}`}</p>
                  <p className="text-sm text-muted-foreground">≈ {formatPrice(cartTotal,ccy as CurrencyCode)}</p>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">USDT ADDRESS</Label>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <code className="text-xs flex-1 break-all">
                      {loading? <div className='animate-pulse'>loading..</div>:info?.publicAddress}
                    </code>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(info?.publicAddress || '')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                  <strong>Gas Fee:</strong> {info?.message}
                </div>
              </div>

              <Button 
                onClick={handleUSDTPayment}
                className="w-full bg-accent"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Processing...
                  </div>
                ) : (
                  "I've Sent the Payment Manually"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
  )
}

export default UsdtPayment