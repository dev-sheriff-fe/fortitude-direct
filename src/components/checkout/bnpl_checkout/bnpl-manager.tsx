// import React from 'react'
// import { ShippingForm } from './shipping-form'
// import { CartReview } from './cart-review'
// import { CheckoutStep, FormData } from '@/app/checkout/checkoutContent'
// import { UseFormReturn } from 'react-hook-form'

// const BnplManager = ({setCurrentStep,form}: {setCurrentStep:(currentStep:CheckoutStep)=>void, form:UseFormReturn<FormData>}) => {
//   return (
//     <div className="min-h-screen bg-[#f7f7f7]">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
//           {/* Left Column - Shipping Form */}
//           <div className="lg:pr-8">
//             <ShippingForm 
//                 setCurrentStep = {setCurrentStep}
//                 form = {form}
//             />
//           </div>
          
//           {/* Right Column - Cart Review */}
//           <div className="lg:pl-8 lg:border-l border-border">
//             <CartReview />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default BnplManager

import React, { useState, useEffect } from 'react'
import { ShippingForm } from './shipping-form'
import { CartReview } from './cart-review'
import { CheckoutStep, FormData } from '@/app/checkout/checkoutContent'
import { UseFormReturn } from 'react-hook-form'

interface ShippingData {
  method: "delivery" | "pickup";
  option?: {
    id: string;
    name: string;
    price: number;
    description: string;
    icon: string;
  };
}

const BnplManager = ({setCurrentStep,form}: {setCurrentStep:(currentStep:CheckoutStep)=>void, form:UseFormReturn<FormData>}) => {
  const [shippingData, setShippingData] = useState<ShippingData>({
    method: "delivery",
    option: {
      id: "economy",
      name: "Economy",
      price: 10,
      description: "Estimated Arrival, Dec 20-23",
      icon: "🚚"
    }
  });

  const watchShippingMethod = form.watch("shippingMethod");
  const watchShippingOption = form.watch("shippingOption");

  useEffect(() => {
    if (watchShippingMethod) {
      setShippingData(prev => ({
        ...prev,
        method: watchShippingMethod
      }));
    }
  }, [watchShippingMethod]);

  useEffect(() => {
    if (watchShippingOption) {
      const shippingOptions = {
        economy: {
          id: "economy",
          name: "Economy",
          price: 10,
          description: "Estimated Arrival, Dec 20-23",
          icon: "🚚"
        },
        regular: {
          id: "regular",
          name: "Regular",
          price: 15,
          description: "Estimated Arrival, Dec 20-22",
          icon: "📦"
        },
        cargo: {
          id: "cargo",
          name: "Cargo",
          price: 20,
          description: "Estimated Arrival, Dec 19-20",
          icon: "🚢"
        },
        express: {
          id: "express",
          name: "Express",
          price: 30,
          description: "Estimated Arrival, Dec 18-19",
          icon: "⚡"
        }
      };

      const selectedOption = shippingOptions[watchShippingOption as keyof typeof shippingOptions];
      if (selectedOption) {
        setShippingData(prev => ({
          ...prev,
          option: selectedOption
        }));
      }
    }
  }, [watchShippingOption]);

  return (
    <div className="min-h-screen bg-[#f7f7f7] p-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          <div className="lg:pr-8">
            <ShippingForm 
                setCurrentStep = {setCurrentStep}
                form = {form}
            />
          </div>
          
          <div className="lg:pl-8 lg:border-l border-border">
            <CartReview 
              selectedShippingOption={shippingData.option}
              shippingMethod={shippingData.method}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BnplManager