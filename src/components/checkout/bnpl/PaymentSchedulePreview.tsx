import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/store/cart'
import { CurrencyCode, formatPrice } from '@/utils/helperfns'
import { Calendar, CheckCircle, Clock, Shield, TrendingUp } from 'lucide-react'
import React from 'react'

const PaymentSchedulePreview = () => {
    const {getCartTotal,mainCcy} = useCart()
    const ccy = mainCcy()
  return (
    <>
        <Card className='h-fit sticky top-0'>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Payment Schedule Preview
                  </CardTitle>

                  <h3 className='font-semibold'>NB: This is just a preview and not your calculated payment plan.</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Interest-Free Installments</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-sm font-medium">Today</span>
                        </div>
                        <span className="font-bold text-blue-600">{formatPrice(getCartTotal()/3,ccy as CurrencyCode)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">In 30 days</span>
                        </div>
                        <span className="font-medium">{formatPrice(getCartTotal()/3, ccy as CurrencyCode)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">In 60 days</span>
                        </div>
                        <span className="font-medium">{formatPrice(getCartTotal()/3, ccy as CurrencyCode)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Shield className="w-4 h-4" />
                      <span>0% Interest Rate</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>No Hidden Fees</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>Build Credit History</span>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded text-xs">
                    <strong>Credit Assessment:</strong> We use AI-powered scoring including income verification, 
                    digital payment history, and social/professional signals for instant approval.
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Approval limits range from £150 to £750 based on your credit tier.
                  </div>
                </CardContent>
              </Card>
    </>
  )
}

export default PaymentSchedulePreview