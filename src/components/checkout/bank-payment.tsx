import React from 'react'
import { Button } from '../ui/button';
import { ArrowLeft, Banknote, Building2, Copy, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { useToast } from '@/app/hooks/use-toast';
import { CheckoutStep } from '@/app/checkout/page';
import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';


type Props = {
    setCurrentStep: (step: CheckoutStep) => void,
    copyToClipboard: (text: string) => void
}
const BankPayment = ({ setCurrentStep, copyToClipboard }: Props) => {
    const {toast} = useToast()
    const {getCartTotal,mainCcy} = useCart()
   
    const ccy = mainCcy()
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
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-white font-bold">
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
                  <strong>Amount to Transfer:</strong> {formatPrice(getCartTotal(),ccy as CurrencyCode)}<br/>
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
                className="w-full bg-accent hover:bg-accent-foreground"
                size="lg"
              >
                I've Made the Transfer
              </Button>
            </CardContent>
          </Card>
        </div>
  )
}

export default BankPayment