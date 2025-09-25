import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, DollarSign, Calendar, CheckCircle } from "lucide-react";
import { useState } from "react";
import { PaymentRequest } from "@/types/";
import { toast } from "sonner";


interface PaymentButtonProps {
  orderId: string;
  paymentRef: string;
  amount: number;
  amountDisplay: string;
  installmentNumber: number;
  scheduleDate: string;
  isDisabled?: boolean;
  variant?: "default" | "outline" | "secondary";
}

export function PaymentButton({ 
  orderId, 
  paymentRef, 
  amount, 
  amountDisplay, 
  installmentNumber, 
  scheduleDate,
  isDisabled = false,
  variant = "default"
}: PaymentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  

  const handlePayment = async () => {
    setIsProcessing(true);

    const paymentData: PaymentRequest = {
      orderId,
      paymentRef,
      amount
    };

    try {
      // Simulate API call - replace with your actual payment endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      console.log('Payment payload:', paymentData);
      
      toast.success(`Payment of ${amountDisplay} has been processed successfully.`);

      setIsOpen(false);
    } catch (error) {
      toast.error("There was an error processing your payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          size="sm" 
          disabled={isDisabled}
          className="min-w-[100px] bg-accent"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Pay Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Confirm Payment
          </DialogTitle>
          <DialogDescription>
            Review your payment details before proceeding.
          </DialogDescription>
        </DialogHeader>
        
        <Card className="bg-muted/30">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Installment</span>
              <span className="font-medium">#{installmentNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-xl font-bold text-primary">{amountDisplay}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Due Date</span>
              <span className="font-medium">{new Date(scheduleDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Order ID</span>
              <span className="font-mono text-sm">{orderId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Payment Ref</span>
              <span className="font-mono text-sm">{paymentRef}</span>
            </div>
          </CardContent>
        </Card>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={isProcessing} className="min-w-[120px] bg-accent">
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Payment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}