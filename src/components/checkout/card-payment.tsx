import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ArrowLeft, CreditCard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useToast } from '@/app/hooks/use-toast'
import { useCart } from '@/store/cart'
import { CurrencyCode, formatPrice } from '@/utils/helperfns'

import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query'
import { CheckoutStep, PaymentMethod } from '@/app/checkout/checkoutContent'

type CardPaymentProps = {
    setCurrentStep: (step: CheckoutStep) => void;
    setSelectedPayment: (method: PaymentMethod) => void;
}

type method = 'stripe' | 'paystack' | ''

const stripePromise = loadStripe('pk_test_51QZlW8Deo5zH04Uxetn9fDgorYX2SDE0QoCAxHz5jxupJsA28any2ASzr3YkhQA3LFemKMJ8fTE70Wy4D369pkvj00G98Vo4O2');

type CreatePaymentIntentPayload = {
  amount: number;     // amount in major currency unit (e.g. dollars, naira)
  currency: string;   // e.g. "usd", "ngn"
};

// Stripe Payment Form Component
const StripePaymentForm = ({ onSuccess, onError }: { 
  onSuccess: () => void; 
  onError: (error: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: 'if_required'
    });

    if (result.error) {
      onError(result.error.message || 'Payment failed');
    } else {
      onSuccess();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
};

const CardPayment = ({ setCurrentStep, setSelectedPayment }: CardPaymentProps) => {
    const [cardProcessing, setCardProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<method>('');
    const { toast } = useToast()
    const { getCartTotal, mainCcy } = useCart()

    const currency = mainCcy()
    const total = getCartTotal() 

    // Check if amount meets minimum requirements
    const isAmountTooLow = () => {
      const minimums = {
        usd: 0.50,
        eur: 0.50,
        gbp: 0.30,
        ngn: 30.00
      };
      
      const minimum = minimums[currency?.toLowerCase() as keyof typeof minimums];
      return minimum && total < minimum;
    };

    const { mutate, data, isPending, error } = useMutation({
      mutationFn: async ({ amount, currency }: CreatePaymentIntentPayload) => {
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, currency }),
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to create payment intent");
        }
        
        return res.json() as Promise<{ clientSecret: string }>;
      },
      onError: (error: Error) => {
        toast({
          title: "Payment Setup Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    });

    useEffect(() => {
      if (paymentMethod === 'stripe' && !isAmountTooLow()) {
        mutate({ amount: total, currency: currency as string });
      }
    }, [paymentMethod, mutate, total, currency]);

    const handlePaymentSuccess = () => {
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully!",
      });
      // Redirect or update state as needed
    };

    const handlePaymentError = (error: string) => {
      toast({
        title: "Payment Failed",
        description: error,
        variant: "destructive"
      });
    };

    const appearance = { 
      theme: "stripe" as const,
    };
    
    const options: StripeElementsOptions | undefined = data ? { 
      clientSecret: data.clientSecret, 
      appearance 
    } : undefined;

    // Show amount warning if too low
    if (isAmountTooLow()) {
      const minimums = {
        usd: '$0.50',
        eur: '€0.50',
        gbp: '£0.30',
        ngn: '₦30.00'
      };
      const minimumDisplay = minimums[currency?.toLowerCase() as keyof typeof minimums];

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
              <CardTitle>Amount Too Low</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                The minimum charge amount for {currency?.toUpperCase()} is {minimumDisplay}. 
                Your current total is {formatPrice(total, currency as CurrencyCode)}.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Please add more items to your cart or choose a different payment method.
              </p>
            </CardContent>
          </Card>
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
            <h2 className="text-2xl font-bold">Card Payment</h2>
          </div>

          <Card>
            <CardHeader className='flex items-center'>
              <span>Total: {formatPrice(total, currency as CurrencyCode)}</span>
            </CardHeader>

            {!paymentMethod && (
              <CardContent className="space-y-4 flex flex-col">
                <Button onClick={() => setPaymentMethod('stripe')}>
                  Pay with Stripe <CreditCard className="ml-2" />
                </Button>
                <Button onClick={() => setPaymentMethod('paystack')}>
                  Pay with PayStack <CreditCard className="ml-2" />
                </Button>
              </CardContent>
            )}

            {paymentMethod === 'stripe' && (
              <CardContent className="space-y-4">
                {isPending && <p>Setting up payment...</p>}
                {error && (
                  <div className="text-red-500 text-sm">
                    Error: {(error as Error).message}
                  </div>
                )}
                {options && (
                  <Elements stripe={stripePromise} options={options}>
                    <StripePaymentForm 
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </Elements>
                )}
              </CardContent>
            )}

            {paymentMethod === 'paystack' && (
              <CardContent>
                <p>PayStack integration coming soon...</p>
              </CardContent>
            )}
          </Card>     
        </div>
      </>
    )
}

export default CardPayment