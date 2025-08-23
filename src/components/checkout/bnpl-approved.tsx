import React from 'react'
import { Button } from '../ui/button';
import { ArrowLeft, Badge, Calendar, Clock, Coins, Currency, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice, timestampToDays } from '@/utils/helperfns';
import { useToast } from '@/app/hooks/use-toast';
import { BNPLStep, CheckoutStep, CreditScoreData, PaymentMethod } from '@/app/checkout/page';
import LivenessTrigger from './bnpl/LivenessTrigger';

type Props = {
    setBnplStep: (step: BNPLStep) => void;
    setCurrentStep: (step: CheckoutStep) => void;
    score: any
    setSelectedPayment: (selectedPayment:PaymentMethod) =>void
}

const BNPLApproved = ({setBnplStep,setCurrentStep,score,setSelectedPayment}:Props) => {
    const {getCartTotal,mainCcy} = useCart()
    const ccy = mainCcy()
    const {toast} = useToast()

    // console.log(timestampToDays(1761063367742));
    
    console.log(score);
    
  return (
    <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setBnplStep('registration')}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-2xl font-bold text-green-600">Credit Approved!</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Credit Score Results */}
              <Card className='h-fit'>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Credit Score Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <div className="text-4xl font-bold text-green-600 mb-2">{Math.ceil(score.score)}</div>
                    <div className="text-lg font-semibold text-gray-700">{score.tier}</div>
                    <div className={`mt-2 bg-green-100 text-green-800 ${score?.rating==='GOOD'&&'text-blue-600 bg-blue-100'} ${score?.rating==='BAD'&&'bg-red-100'} w-fit p-1 mx-auto rounded-sm`}>
                      {score?.rating}
                    </div>
                  </div>


                  <Separator />

                  <div className='space-y-3'>
                    {
                    score?.scoreParameters?.map((param:any,index:number)=>(
                      <div className='w-full flex items-center justify-between' key={index}>
                        <span>{param?.displayName}</span>
                        <span>{param?.score}</span>
                      </div>
                    ))
                  }
                  </div>

                  {/* <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Your Approved Limit</h4>
                    <div className="text-2xl font-bold text-green-600">{score?.approvedLimitDisplay}</div>
                    <div className="text-sm text-green-700">Up to {score?.maxInstallments} installments</div>
                  </div> */}

                  <LivenessTrigger
                  livenessSessionId= {score?.livenessSessionId}
                  />
                </CardContent>
              </Card>

              {/* Complete Purchase */}
              <Card className='h-fit sticky top-0'>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Complete Purchase
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Your Payment Plan</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-sm font-medium">Today</span>
                        </div>
                        {/* <span className="font-bold text-blue-600">{formatPrice(getCartTotal() / Math.min(creditScore.installments, 3),'NGN')}</span> */}
                      </div>
                      {score?.paymentPlan?.installments.map((item:any,i:number)=>(
                          <div key={i} className="flex justify-between items-center p-3 bg-white rounded">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{item?.scheduleDate}</span>
                          </div>
                          <span className="font-medium">{formatPrice(item?.scheduleAmount,ccy as CurrencyCode)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Payment Details for First Installment</h4>
                    <Button className='w-full' onClick={()=>setSelectedPayment('usdt')}>
                      Pay with Crypto <Coins/>
                    </Button>
                    <br/>
                    <Button className='w-full' onClick={()=>setSelectedPayment('bank')}>
                      Pay with transfer <Currency/>
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground bg-green-50 p-3 rounded">
                    <strong>0% Interest:</strong> No fees when paid on time. Late payment fees may apply.
                  </div>

                  {/* <Button 
                    onClick={() => {
                      setCurrentStep('success');
                      toast({
                        title: "BNPL Payment Approved",
                        description: `First installment of ${formatPrice(getCartTotal() / Math.min(creditScore.installments, 3),'NGN')} charged successfully`,
                      });
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    Pay First Installment ({formatPrice(getCartTotal() / Math.min(creditScore.installments, 3),'NGN')})
                  </Button> */}
                </CardContent>
              </Card>
            </div>
          </div>
  )
}

export default BNPLApproved