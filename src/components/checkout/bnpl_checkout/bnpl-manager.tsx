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

const BnplManager = ({ setCurrentStep, form }: { setCurrentStep: (currentStep: CheckoutStep) => void, form: UseFormReturn<FormData> }) => {
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

  const [selectedStore, setSelectedStore] = useState<string>("");

  const watchShippingMethod = form.watch("shippingMethod");
  const watchShippingOption = form.watch("shippingOption");
  const watchPickupStore = form.watch("pickupStore");

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
          description: "Estimated Arrival, Oct 24-25",
          icon: "🚚"
        },
        regular: {
          id: "regular",
          name: "Regular",
          price: 15,
          description: "Estimated Arrival, Oct 23-25",
          icon: "📦"
        },
        cargo: {
          id: "cargo",
          name: "Cargo",
          price: 20,
          description: "Estimated Arrival, Oct 22-25",
          icon: "🚢"
        },
        express: {
          id: "express",
          name: "Express",
          price: 30,
          description: "Estimated Arrival, Oct 21-25",
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

  useEffect(() => {
    if (watchPickupStore) {
      setSelectedStore(watchPickupStore);
    }
  }, [watchPickupStore]);

  return (
    <div className="min-h-screen w-full bg-[#f7f7f7] py-1">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          <div className="lg:pr-8">
            <ShippingForm
              setCurrentStep={setCurrentStep}
              form={form}
            />
          </div>

          <div className="lg:pl-8 lg:border-l border-border">
            <CartReview
              selectedShippingOption={shippingData.option}
              shippingMethod={shippingData.method}
              setCurrentStep={setCurrentStep}
              form={form}
              selectedStore={selectedStore}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BnplManager