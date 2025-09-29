'use client'
import { PaymentPlanCard } from "@/components/Customer/payment-plan/payment-plan-card";
// import useCustomer from "@/store/customerStore";
// import { PaymentPlanResponse } from "@/types";
import axiosCustomer from "@/utils/fetch-function-customer";
import { useQuery } from "@tanstack/react-query";


// Mock data that matches your backend structure


const Index = () => {
  
  const {data} = useQuery({
     queryKey: ['payment-plan'],
     queryFn: ()=>axiosCustomer({
      method: 'GET',
      url: '/payment-plans/generate',
      // params: {
      //   orderId: 'CART400660481674989'
      // }
     })
  })

  if (data?.data?.responseCode === 'E20') {
    return <div className="min-h-screen flex items-center justify-center">
      <h1 className="font-bold text-xl">No active payment plan!</h1>
    </div>
  }

  const paymentSummary = data?.data?.paymentPlanSummary

  console.log(data);
  
  return (
    <div className="min-h-screen bg-background">
    
      <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-accent">Buy Now, Pay Later</h1>
            <p className="text-gray-500">Flexible payment plans made simple</p>
    </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <PaymentPlanCard paymentPlan={paymentSummary} />
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Secure payments powered by advanced encryption</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
