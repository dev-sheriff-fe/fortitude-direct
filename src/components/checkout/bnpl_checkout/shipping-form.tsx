import { useForm, Controller, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Truck, MapPin, ArrowLeft, Clock, Plus } from "lucide-react";
import { toast } from "sonner";
import { CheckoutStep, FormData } from "@/app/checkout/checkoutContent";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/fetch-function";
import useCustomer from "@/store/customerStore";
import { useCart } from "@/store/cart";
import { useLocationStore } from "@/store/locationStore";
import axiosCustomer from "@/utils/fetch-function-customer";
import { formatPrice } from "@/utils/helperfns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import useGetLookup from "@/app/hooks/useGetLookup";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDeliveryAddress } from "@/app/hooks/useGetDeliveryAddress";
import AddDeliveryAddress from "../add-delivery-address";

export const ShippingForm = ({setCurrentStep,form}: {setCurrentStep: (currentStep:CheckoutStep)=>void, form: UseFormReturn<FormData>}) => {

  const [shippingMethod, setShippingMethod] = useState<"delivery" | "pickup">("delivery");
  const {customer} = useCustomer()
  const {cart} = useCart()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {location} = useLocationStore()
  const {back} = useRouter()

  const {register, 
        handleSubmit, 
        control,
        formState: {errors},
        setValue,
        watch,
        reset
      } 
        = form
  const addressTypeOptions = useGetLookup('ADDRESS_TYPE')
  const {deliveryAddress} = useGetDeliveryAddress()


  console.log(deliveryAddress);
  

  const handleShippingMethodChange = (method: "delivery" | "pickup") => {
    setShippingMethod(method);
    setValue("shippingMethod", method);
  };

  const handleAddressSelect = (address: any) => {
    setValue("selectedAddressId", address.id);
    setValue("street", address.street);
    setValue("landmark", address.landmark || "");
    setValue("zipCode", address.postCode);
    setValue("city", address.city || "");
    setValue("state", address.state || "");
    setValue("country", address.country);
    setValue("addressType", address.addressType);
  };

  return (
    <>
      <div className="w-full">
      <div className="flex items-center gap-1 mb-8">
        <button className="h-fit" onClick={()=>back()}><ArrowLeft/></button>
        <h1 className="text-2xl font-semibold text-checkout-text">Checkout</h1>
      </div>
      
      <form>
        {/* Shipping Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-checkout-text mb-4">Shipping Information</h2>
          
          {/* Shipping Method */}
          <div className="flex gap-4 mb-6">
            <Button
              type="button"
              className={`flex-1 justify-start gap-3 h-12 ${shippingMethod === 'delivery'?'bg-accent/5 border-accent border text-accent' : 'bg-white border text-black'} hover:bg-accent/10`}
              onClick={() => handleShippingMethodChange("delivery")}
            >
              <Truck className="w-4 h-4" />
              Delivery
            </Button>
            <Button
              type="button"
              className={`flex-1 justify-start gap-3 h-12 ${shippingMethod === 'pickup' ? 'bg-accent/5 border-accent border text-accent' : "bg-white border text-black"} hover:bg-accent/10`}
              onClick={() => handleShippingMethodChange("pickup")}
            >
              <MapPin className="w-4 h-4" />
              Pick up
            </Button>
          </div>

          {/* Shipping Info*/}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              {deliveryAddress.length === 0 ? (
                <div className="border-2 border-dashed border-accent rounded-md p-4 bg-accent/5 hover:bg-accent/10 cursor-pointer">
                  <Button
                    type="button"
                    className="w-full bg-transparent h-full flex flex-col items-center justify-center text-center py-10 hover:bg-accent/10"
                    onClick={()=>setIsModalOpen(true)}
                  >
                    <div className="flex items-center justify-center rounded-full border-2 border-dashed bg-white border-border w-16 h-16 mb-4">
                      <Plus className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-muted-foreground">Add New Address</h3>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {deliveryAddress.map((address: any) => (
                    <div
                      key={address.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        watch("selectedAddressId") === address.id
                          ? "border-accent bg-accent/5 shadow-sm"
                          : "border-gray-200 hover:border-accent/50"
                      }`}
                      onClick={() => handleAddressSelect(address)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                              {address.addressType}
                            </span>
                            {watch("selectedAddressId") === address.id && (
                              <span className="text-xs text-accent font-medium">✓ Selected</span>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-sm">
                            <p className="font-medium text-checkout-text">{address.street}</p>
                            {address.landmark && (
                              <p className="text-muted-foreground">Landmark: {address.landmark}</p>
                            )}
                            <p className="text-muted-foreground">
                              {[address.city, address.state, address.postCode]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                            <p className="text-muted-foreground font-medium">{address.country}</p>
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              watch("selectedAddressId") === address.id
                                ? "border-accent bg-accent"
                                : "border-gray-300"
                            }`}
                          >
                            {watch("selectedAddressId") === address.id && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-dashed border-accent text-accent hover:bg-accent/10"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Address
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
         

          {/* Submit Button for Development/Testing */}
          <Button 
          type="button"  
          className="mt-6 w-full bg-accent md:w-full"
          onClick={()=>setCurrentStep('cart')}
          >
             Continue to Payment
          </Button>
        </div>
      </form>
    </div>
    <AddDeliveryAddress
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
    />
    </>
  );
};

// ${formatPrice(checkoutData?.totalAmount/3,checkoutData?.ccy)}