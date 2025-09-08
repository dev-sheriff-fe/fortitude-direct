import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, Copy, ExternalLink, RefreshCw } from "lucide-react";

 interface PendingScreenProps {
    checkoutData: any;
    chainDets: any;
    retryPaymentCheck?: any;
 }

 interface PaymentSuccessProps{
    paymentResponse: any;
    handleCopyToClipboard?: any;
    startOver: any;
 }

 interface PaymentErrorProps extends PaymentSuccessProps{
    checkingPaymentStatus: any;
    retryPaymentCheck: any;
 }
 // Pending Screen
  export  const PaymentPendingScreen = ({chainDets,checkoutData,retryPaymentCheck}:PendingScreenProps) => (
      <div className='flex flex-col justify-center items-center h-full'>
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-yellow-500 mb-2">Payment Processing</h2>
              <p className="text-muted-foreground">Please wait while we check your transaction on the blockchain...</p>
            </div>
          </div>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Order Number:</span>
                  <span className="text-sm font-medium">{checkoutData?.orderNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount:</span>
                  <span className="text-sm font-medium">{checkoutData?.payingAmount?.toFixed(2)} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Network:</span>
                  <span className="text-sm font-medium">{chainDets?.chain}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
          onClick={retryPaymentCheck}
          className='w-full'
          >
            Check Status
          </Button>

          <p className="text-sm text-muted-foreground">This may take a few moments depending on network congestion...</p>
        </div>
      </div>
    );

    // Payment Success screen
   export const PaymentSuccessScreen = ({handleCopyToClipboard,paymentResponse,startOver}:PaymentSuccessProps) => (
          <div className='flex flex-col justify-center items-center h-full'>
            <div className="w-full max-w-md space-y-6 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Confirmed!</h2>
                  <p className="text-muted-foreground">Your transaction has been successfully verified on the blockchain.</p>
                </div>
              </div>
    
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Transaction ID:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-background px-2 py-1 rounded">{paymentResponse?.txId}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyToClipboard(paymentResponse?.txId)}
                        className="p-1"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {paymentResponse?.amountPaid && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Amount Paid:</span>
                      <span className="text-sm font-medium">{paymentResponse.amountPaid} {paymentResponse.symbol}</span>
                    </div>
                  )}
                  
                  {paymentResponse?.fromAddress && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">From Address:</span>
                      <code className="text-xs bg-background px-2 py-1 rounded">{paymentResponse.fromAddress.slice(0, 10)}...</code>
                    </div>
                  )}
                  
                  {paymentResponse?.blockNumber && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Block Number:</span>
                      <span className="text-sm">{paymentResponse.blockNumber}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
    
              <div className="space-y-3">
                {paymentResponse?.onchainUrl && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(paymentResponse.onchainUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Blockchain Explorer
                  </Button>
                )}
                
                <Button
                  onClick={startOver}
                  variant="outline"
                  className="w-full"
                >
                  Make Another Payment
                </Button>
              </div>
            </div>
          </div>
        );

          // Error Screen Component
    export const PaymentErrorScreen = ({checkingPaymentStatus,paymentResponse,retryPaymentCheck,startOver}:PaymentErrorProps) => (
      <div className='flex flex-col justify-center items-center h-full'>
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Not Found</h2>
              <p className="text-muted-foreground">We couldn't find your transaction on the blockchain yet.</p>
            </div>
          </div>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 space-y-3">
              <div className="text-left">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Response Code:</span>
                  <code className="text-xs bg-background px-2 py-1 rounded text-red-600">{paymentResponse?.responseCode}</code>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Message:</span>
                  <p className="text-sm text-red-700 mt-1">{paymentResponse?.responseMessage}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
            <h4 className="font-medium text-yellow-800 mb-2">Possible reasons:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Transaction is still being processed (try again in a few minutes)</li>
              <li>• Wrong network or amount sent</li>
              <li>• Transaction hasn't been broadcasted yet</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={retryPaymentCheck}
              className="w-full"
              disabled={checkingPaymentStatus}
            >
              {checkingPaymentStatus ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Check Again
                </>
              )}
            </Button>
            
            <Button
              onClick={startOver}
              variant="outline"
              className="w-full"
            >
              Start Over
            </Button>
          </div>
        </div>
      </div>
    );
    

    export  const PaymentCheckingScreen = ({chainDets,checkoutData}:PendingScreenProps) => (
          <div className='flex flex-col justify-center items-center h-full'>
            <div className="w-full max-w-md space-y-6 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-blue-600 mb-2">Verifying Payment</h2>
                  <p className="text-muted-foreground">Please wait while we check your transaction on the blockchain...</p>
                </div>
              </div>
    
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Order Number:</span>
                      <span className="text-sm font-medium">{checkoutData?.orderNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Amount:</span>
                      <span className="text-sm font-medium">{checkoutData?.payingAmount?.toFixed(2)} USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Network:</span>
                      <span className="text-sm font-medium">{chainDets?.chain}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <p className="text-sm text-muted-foreground">This may take a few moments depending on network congestion...</p>
            </div>
          </div>
        );