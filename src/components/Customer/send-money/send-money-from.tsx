'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Wallet, Send, Shield, CheckCircle } from 'lucide-react';


const transferSchema = z.object({
  transferType: z.string().min(1, 'Please select a transfer type'),
  sourceWallet: z.string().min(1, 'Please select a source wallet'),
  amount: z.string().min(1, 'Please enter an amount').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Please enter a valid amount'),
  beneficiaryBank: z.string().min(1, 'Please select beneficiary bank/chain'),
  beneficiaryCurrency: z.string().min(1, 'Please select beneficiary currency'),
  beneficiaryAddress: z.string().min(1, 'Please enter beneficiary address'),
  narration: z.string().min(1, 'Please enter a narration'),
});

type TransferFormData = z.infer<typeof transferSchema>;

interface WalletBalance {
  currency: string;
  balance: number;
  icon: string;
}

const mockWallets: WalletBalance[] = [
  { currency: 'USD', balance: 2540.50, icon: '$' },
  { currency: 'EUR', balance: 1890.75, icon: '€' },
  { currency: 'GBP', balance: 985.20, icon: '£' },
  { currency: 'BTC', balance: 0.0234, icon: '₿' },
];

type Step = 'form' | 'review' | 'otp' | 'success';

const SendMoneyForm = () => {
  const [currentStep, setCurrentStep] = useState<Step>('form');
  const [otpValue, setOtpValue] = useState('');

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      transferType: '',
      sourceWallet: '',
      amount: '',
      beneficiaryBank: '',
      beneficiaryCurrency: '',
      beneficiaryAddress: '',
      narration: '',
    },
  });

  const onSubmit = (data: TransferFormData) => {
    console.log('Form data:', data);
    setCurrentStep('review');
  };

  const handleConfirmTransfer = () => {
    setCurrentStep('otp');
  };

  const handleOtpSubmit = () => {
    if (otpValue.length === 6) {
      setCurrentStep('success');
    }
  };

  const formData = form.getValues();
  const selectedWallet = mockWallets.find(w => w.currency === formData.sourceWallet);

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-card">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-success-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Transfer Successful!</h1>
            <p className="text-muted-foreground mb-6">
              Your transfer of {formData.amount} {formData.sourceWallet} has been processed successfully.
            </p>
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => setCurrentStep('form')}
            >
              Send Another Transfer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Verify Transaction
            </CardTitle>
            <CardDescription>Enter the 6-digit OTP sent to your registered device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2 justify-center">
              {[...Array(6)].map((_, i) => (
                <Input
                  key={i}
                  className="w-12 h-12 text-center text-lg font-semibold"
                  maxLength={1}
                  value={otpValue[i] || ''}
                  onChange={(e) => {
                    const newOtp = otpValue.split('');
                    newOtp[i] = e.target.value;
                    setOtpValue(newOtp.join(''));
                  }}
                />
              ))}
            </div>
            <div className="space-y-3">
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={handleOtpSubmit}
                disabled={otpValue.length !== 6}
              >
                Verify & Send
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => setCurrentStep('review')}
              >
                Back to Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'review') {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Review Transfer Details
            </CardTitle>
            <CardDescription>Please verify all details before proceeding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">From</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-semibold">{selectedWallet?.icon}</span>
                    <span className="font-medium">{formData.sourceWallet}</span>
                    <Badge variant="secondary">Balance: {selectedWallet?.balance}</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Amount</Label>
                  <p className="text-2xl font-bold text-primary">{formData.amount} {formData.sourceWallet}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">To</Label>
                  <p className="font-medium">{formData.beneficiaryBank}</p>
                  <p className="text-sm text-muted-foreground">{formData.beneficiaryAddress}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Receive Currency</Label>
                  <p className="font-medium">{formData.beneficiaryCurrency}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-sm text-muted-foreground">Narration</Label>
              <p className="mt-1">{formData.narration}</p>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setCurrentStep('form')}
              >
                Edit Details
              </Button>
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={handleConfirmTransfer}
              >
                Confirm Transfer
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">

      {/* Form Section */}
      <div className="flex justify-center p-4 -mt-8">
        <Card className="w-full max-w-2xl shadow-card relative z-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Transfer Details
            </CardTitle>
            <CardDescription>Fill in the details for your money transfer</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                {/* Transfer Type */}
                <FormField
                  control={form.control}
                  name="transferType"
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Type of Transfer</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select transfer type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="crypto">Crypto Transfer</SelectItem>
                          <SelectItem value="international">International Wire</SelectItem>
                          <SelectItem value="instant">Instant Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Source Wallet */}
                <FormField
                  control={form.control}
                  name="sourceWallet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Wallet</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your wallet" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockWallets.map((wallet) => (
                            <SelectItem key={wallet.currency} value={wallet.currency}>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{wallet.icon}</span>
                                <span>{wallet.currency}</span>
                                <Badge variant="secondary" className="ml-auto">
                                  {wallet.balance}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount to Send</FormLabel>
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 py-2 bg-muted rounded-l-md border border-r-0">
                          <span className="text-sm font-medium">
                            {selectedWallet?.icon || '$'}
                          </span>
                        </div>
                        <FormControl>
                          <Input 
                            placeholder="0.00" 
                            className="rounded-l-none"
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Beneficiary Bank */}
                <FormField
                  control={form.control}
                  name="beneficiaryBank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beneficiary Bank/Chain</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bank or blockchain" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="chase">JPMorgan Chase</SelectItem>
                          <SelectItem value="bofa">Bank of America</SelectItem>
                          <SelectItem value="wells">Wells Fargo</SelectItem>
                          <SelectItem value="ethereum">Ethereum Network</SelectItem>
                          <SelectItem value="bitcoin">Bitcoin Network</SelectItem>
                          <SelectItem value="polygon">Polygon Network</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Beneficiary Currency */}
                <FormField
                  control={form.control}
                  name="beneficiaryCurrency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beneficiary Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="BTC">BTC - Bitcoin</SelectItem>
                          <SelectItem value="ETH">ETH - Ethereum</SelectItem>
                          <SelectItem value="USDC">USDC - USD Coin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Beneficiary Address */}
                <FormField
                  control={form.control}
                  name="beneficiaryAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beneficiary Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter wallet address or account details" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Narration */}
                <FormField
                  control={form.control}
                  name="narration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Narration</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter description or reference for this transfer"
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-accent" size="lg">
                  Review Transfer
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SendMoneyForm;