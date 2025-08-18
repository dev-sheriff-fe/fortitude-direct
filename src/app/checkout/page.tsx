'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Wallet, Bot, CheckCircle, Copy, ArrowLeft, ShoppingBag, Zap, Shield, DollarSign, Calendar, Building2, Clock, Banknote } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import { useCart } from '@/store/cart';
import axiosInstance from '@/utils/fetch-function';
import { useQuery } from '@tanstack/react-query';

type PaymentMethod = 'card' | 'usdt' | 'bnpl' | 'bank' | null;
type CheckoutStep = 'cart' | 'payment' | 'processing' | 'success';

const Checkout = () => {
  const { cart, getCartTotal } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [aiRecommendation, setAiRecommendation] = useState<PaymentMethod>('usdt');
  const [cardProcessing, setCardProcessing] = useState(false);
  const [usdtPaid, setUsdtPaid] = useState(false);
  const { toast } = useToast();

  const {data,isLoading,error} = useQuery({
    queryKey: ['methods'],
    queryFn: ()=>axiosInstance.request({
        url: '/payment-methods/fetch',
        params: {
        name: "",
        entityCode: "H2P",
        category: '',
        tag: '',
        pageNumber: 1,
        pageSize: 200
        }
    })
})

    // return {data:data?.data, isLoading, error}

  // Calculate values based on cart
  const cartTotal = getCartTotal();
  const usdtEquivalent = cartTotal; // 1:1 for simplicity
  const estimatedSavings = cartTotal * 0.018; // 1.8% savings
  const txHash = "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890";

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
    setCurrentStep('payment');
  };

  const handleCardPayment = () => {
    setCardProcessing(true);
    // Simulate card processing
    setTimeout(() => {
      // Simulate card decline
      setCardProcessing(false);
      toast({
        title: "Card Declined",
        description: "Try USDT for instant approval",
        variant: "destructive",
      });
    }, 2000);
  };

  const handleUSDTPayment = () => {
    setCurrentStep('processing');
    // Simulate blockchain confirmation
    setTimeout(() => {
      setUsdtPaid(true);
      setCurrentStep('success');
      toast({
        title: "Payment Confirmed",
        description: "USDT payment successful on TRON network",
      });
    }, 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    });
  };

  const CartView = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-2xl font-bold">Your Cart</h2>
      </div>

      {/* AI Recommendation Banner */}
      <Card className="border-accent bg-accent/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Bot className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-accent">AI Recommendation</h3>
                <Badge variant="secondary" className="bg-accent text-secondary">
                  <Zap className="w-3 h-3 mr-1" />
                  Optimal
                </Badge>
              </div>
              <p className="text-sm">
                Pay with <strong>USDT (TRC-20)</strong> and save <strong>1.8%</strong> on fees
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on your location and payment history analysis
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cart Items */}
      {cart.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                {item.picture ? (
                  <img 
                    src={item.picture} 
                    alt={item.name} 
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="text-2xl">📦</div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${item.subTotal.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{item.quantity} × ${item.salePrice.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Choose Payment Method</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {/* USDT Option */}
          <Card 
            className={`cursor-pointer transition-all ${
              aiRecommendation === 'usdt' 
                ? 'border-accent bg-accent/5 shadow-md' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handlePaymentSelect('usdt')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Wallet className="w-6 h-6 text-accent" />
                <div className="flex-1">
                  <h4 className="font-semibold">USDT (TRC-20)</h4>
                  {aiRecommendation === 'usdt' && (
                    <Badge variant="secondary" className="bg-accent text-secondary text-xs">
                      <Bot className="w-3 h-3 mr-1" />
                      AI Recommended
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-accent">
                  <Shield className="w-4 h-4" />
                  <span>Instant approval</span>
                </div>
                <div className="flex items-center gap-2 text-accent">
                  <DollarSign className="w-4 h-4" />
                  <span>Save ${estimatedSavings.toFixed(2)} in fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>~3 second confirmation</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card Option */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => handlePaymentSelect('card')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="w-6 h-6" />
                <div>
                  <h4 className="font-semibold">Card Payment</h4>
                  <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Standard processing</p>
                <p>• 3D Secure verification</p>
                <p>• ${cartTotal.toFixed(2)} total</p>
              </div>
            </CardContent>
          </Card>

          {/* Buy Now Pay Later Option */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => handlePaymentSelect('bnpl')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold">Buy Now Pay Later</h4>
                  <p className="text-xs text-muted-foreground">3 interest-free installments</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Pay ${(cartTotal / 3).toFixed(2)} today</p>
                <p>• 2 payments of ${(cartTotal / 3).toFixed(2)}</p>
                <p>• 0% interest rate</p>
              </div>
            </CardContent>
          </Card>

          {/* Bank Transfer Option */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => handlePaymentSelect('bank')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="w-6 h-6 text-purple-600" />
                <div>
                  <h4 className="font-semibold">Bank Transfer</h4>
                  <p className="text-xs text-muted-foreground">Virtual account transfer</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Instant virtual account</p>
                <p>• Direct bank transfer</p>
                <p>• ${cartTotal.toFixed(2)} total</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const PaymentView = () => {
    if (selectedPayment === 'usdt') {
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
              <div className="bg-muted p-8 rounded-lg text-center">
                <div className="text-6xl mb-2">📱</div>
                <p className="text-sm text-muted-foreground">Scan QR Code with your wallet</p>
              </div>

              {/* Payment Details */}
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">AMOUNT</Label>
                  <p className="text-2xl font-bold">{usdtEquivalent} USDT</p>
                  <p className="text-sm text-muted-foreground">≈ ${cartTotal.toFixed(2)}</p>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">TRON ADDRESS</Label>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <code className="text-xs flex-1 break-all">
                      TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
                    </code>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                  <strong>Gas Fee:</strong> 0 TRX (Sponsored by merchant)
                </div>
              </div>

              <Button 
                onClick={handleUSDTPayment}
                className="w-full"
                size="lg"
              >
                I've Sent the Payment
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (selectedPayment === 'card') {
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
            <h2 className="text-2xl font-bold">Card Payment</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Pay ${cartTotal.toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="name">Name on Card</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex justify-center gap-4 py-2">
                <div className="text-2xl">💳</div>
                <div className="text-2xl">🔒</div>
                <div className="text-2xl">✅</div>
              </div>

              <Button 
                onClick={handleCardPayment}
                className="w-full"
                size="lg"
                disabled={cardProcessing}
              >
                {cardProcessing ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
              </Button>

              {/* Fallback to USDT */}
              {!cardProcessing && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Card not working?
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedPayment('usdt')}
                    className="text-accent border-accent"
                  >
                    Try USDT for instant approval
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    if (selectedPayment === 'bnpl') {
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
            <h2 className="text-2xl font-bold">Buy Now Pay Later</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                3 Interest-Free Installments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Payment Schedule */}
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm font-medium">Today</span>
                    </div>
                    <span className="font-bold text-blue-600">${(cartTotal / 3).toFixed(2)}</span>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">In 30 days</span>
                    </div>
                    <span className="font-medium">${(cartTotal / 3).toFixed(2)}</span>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">In 60 days</span>
                    </div>
                    <span className="font-medium">${(cartTotal / 3).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Card Details for First Payment */}
              <div className="space-y-3">
                <h4 className="font-medium">Payment Details</h4>
                <div>
                  <Label htmlFor="bnpl-card-number">Card Number</Label>
                  <Input id="bnpl-card-number" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="bnpl-expiry">Expiry</Label>
                    <Input id="bnpl-expiry" placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label htmlFor="bnpl-cvc">CVC</Label>
                    <Input id="bnpl-cvc" placeholder="123" />
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded">
                <strong>0% Interest:</strong> No fees or interest charges when paid on time
              </div>

              <Button 
                onClick={() => {
                  setCurrentStep('success');
                  toast({
                    title: "BNPL Payment Approved",
                    description: "First installment charged successfully",
                  });
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Pay First Installment (${(cartTotal / 3).toFixed(2)})
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (selectedPayment === 'bank') {
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
            <h2 className="text-2xl font-bold">Bank Transfer</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                Virtual Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Bank Details */}
              <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    NW
                  </div>
                  <div>
                    <h4 className="font-semibold">NatWest Bank</h4>
                    <p className="text-sm text-muted-foreground">Sort Code: 60-40-05</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">ACCOUNT NUMBER</Label>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <code className="text-lg font-mono flex-1">31926819</code>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard('31926819')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">ACCOUNT NAME</Label>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="flex-1 font-medium">TransBridge Payments Ltd</span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard('TransBridge Payments Ltd')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">REFERENCE</Label>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <code className="text-sm flex-1">ORDER-TB{Date.now()}</code>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(`ORDER-TB${Date.now()}`)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded text-xs">
                  <strong>Amount to Transfer:</strong> ${cartTotal.toFixed(2)}<br/>
                  <strong>Important:</strong> Include the reference for instant processing
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4" />
                  <span>Transfers typically take 2-4 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Protected by UK banking regulations</span>
                </div>
              </div>

              <Button 
                onClick={() => {
                  setCurrentStep('processing');
                  setTimeout(() => {
                    setCurrentStep('success');
                    toast({
                      title: "Transfer Received",
                      description: "Bank transfer confirmed successfully",
                    });
                  }, 3000);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                I've Made the Transfer
              </Button>
            </CardContent>
          </Card>
        </div>
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
        {currentStep === 'cart' && <CartView />}
        {currentStep === 'payment' && <PaymentView />}
        {currentStep === 'processing' && <ProcessingView />}
        {currentStep === 'success' && <SuccessView />}
      </div>
    </div>
  );
};

export default Checkout;

