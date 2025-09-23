'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { ArrowLeft, Bot, Building2, Calendar, CoinsIcon, CreditCard, DollarSign, Shield, Wallet, Zap } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { PaymentMethod } from '@/app/checkout/checkoutContent';
import { useRouter } from 'next/navigation';

type CartViewProps = {
    handlePaymentSelect: (method: PaymentMethod) => void;
}

const CartView = ({ handlePaymentSelect }: CartViewProps) => {
    const {cart,getCartTotal,mainCcy} = useCart()
    const ccy = mainCcy()
     const [aiRecommendation, setAiRecommendation] = useState<PaymentMethod>('usdt');
    const [checkoutData,setCheckoutData] = useState<any>(null)
    const router = useRouter()
    
    useEffect(() => {
    const stored = sessionStorage.getItem('checkout');
    if (stored) {
      setCheckoutData(JSON.parse(stored));
    }
  }, []);
    const CartView = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router?.push(`/`)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-2xl font-bold">Checkout</h2>
      </div>

      {/* AI Recommendation Banner */}
      {/* <Card className="border-accent bg-accent/5">
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
      </Card> */}

      {/* Cart Items */}
      {/* {cart.map((item) => (
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
                <p className="text-lg font-bold">{formatPrice(item?.subTotal,ccy as CurrencyCode)}</p>
                <p className="text-sm text-muted-foreground">{item.quantity} × {formatPrice(item?.subTotal,ccy as CurrencyCode)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))} */}

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
                  {/* <DollarSign className="w-4 h-4" /> */}
                  {/* <span>Save ${estimatedSavings.toFixed(2)} in fees</span> */}
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
                <p>• {formatPrice(checkoutData?.totalAmount || 0, ccy as CurrencyCode)} total</p>
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
                <p>• Spread payment of {formatPrice(checkoutData?.totalAmount||0,mainCcy() as CurrencyCode)} today</p>
                <p>• Pay according to your credit score</p>
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
                <p>• {formatPrice(checkoutData?.totalAmount||0, ccy as CurrencyCode)} total</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return <CartView />;
}

export default CartView