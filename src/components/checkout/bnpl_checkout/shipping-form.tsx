// import { useForm, Controller, UseFormReturn } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Truck, MapPin, ArrowLeft, Clock, Plus } from "lucide-react";
// import { toast } from "sonner";
// import { CheckoutStep, FormData } from "@/app/checkout/checkoutContent";
// import { useMutation } from "@tanstack/react-query";
// import axiosInstance from "@/utils/fetch-function";
// import useCustomer from "@/store/customerStore";
// import { useCart } from "@/store/cart";
// import { useLocationStore } from "@/store/locationStore";
// import axiosCustomer from "@/utils/fetch-function-customer";
// import { formatPrice } from "@/utils/helperfns";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import useGetLookup from "@/app/hooks/useGetLookup";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useGetDeliveryAddress } from "@/app/hooks/useGetDeliveryAddress";
// import AddDeliveryAddress from "../add-delivery-address";

// export const ShippingForm = ({setCurrentStep,form}: {setCurrentStep: (currentStep:CheckoutStep)=>void, form: UseFormReturn<FormData>}) => {

//   const [shippingMethod, setShippingMethod] = useState<"delivery" | "pickup">("delivery");
//   const {customer} = useCustomer()
//   const {cart} = useCart()
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const {location} = useLocationStore()
//   const {back} = useRouter()

//   const {register, 
//         handleSubmit, 
//         control,
//         formState: {errors},
//         setValue,
//         watch,
//         getValues,
//         reset
//       } 
//         = form
//   const addressTypeOptions = useGetLookup('ADDRESS_TYPE')
//   const {deliveryAddress} = useGetDeliveryAddress()


//   console.log(deliveryAddress);


//   const handleShippingMethodChange = (method: "delivery" | "pickup") => {
//     setShippingMethod(method);
//     setValue("shippingMethod", method);
//   };

//   const handleAddressSelect = (address: any) => {
//     setValue("selectedAddressId", address.id);
//     setValue("street", address.street);
//     setValue("landmark", address.landmark || "");
//     setValue("zipCode", address.postCode);
//     setValue("city", address.city || "");
//     setValue("state", address.state || "");
//     setValue("country", address.country);
//     setValue("addressType", address.addressType);
//   };

//   return (
//     <>
//       <div className="w-full">
//       <div className="flex items-center gap-1 mb-8">
//         <button className="h-fit" onClick={()=>back()}><ArrowLeft/></button>
//         <h1 className="text-2xl font-semibold text-checkout-text">Checkout</h1>
//       </div>

//       <form>
//         {/* Shipping Information */}
//         <div className="mb-8">
//           <h2 className="text-lg font-medium text-checkout-text mb-4">Shipping Information</h2>

//           {/* Shipping Method */}
//           <div className="flex gap-4 mb-6">
//             <Button
//               type="button"
//               className={`flex-1 justify-start gap-3 h-12 ${shippingMethod === 'delivery'?'bg-accent/5 border-accent border text-accent' : 'bg-white border text-black'} hover:bg-accent/10`}
//               onClick={() => handleShippingMethodChange("delivery")}
//             >
//               <Truck className="w-4 h-4" />
//               Delivery
//             </Button>
//             <Button
//               type="button"
//               className={`flex-1 justify-start gap-3 h-12 ${shippingMethod === 'pickup' ? 'bg-accent/5 border-accent border text-accent' : "bg-white border text-black"} hover:bg-accent/10`}
//               onClick={() => handleShippingMethodChange("pickup")}
//             >
//               <MapPin className="w-4 h-4" />
//               Pick up
//             </Button>
//           </div>

//           {/* Shipping Info*/}

//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Delivery Information</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {deliveryAddress.length === 0 ? (
//                 <div className="border-2 border-dashed border-accent rounded-md p-4 bg-accent/5 hover:bg-accent/10 cursor-pointer">
//                   <Button
//                     type="button"
//                     className="w-full bg-transparent h-full flex flex-col items-center justify-center text-center py-10 hover:bg-accent/10"
//                     onClick={()=>setIsModalOpen(true)}
//                   >
//                     <div className="flex items-center justify-center rounded-full border-2 border-dashed bg-white border-border w-16 h-16 mb-4">
//                       <Plus className="w-7 h-7 text-muted-foreground" />
//                     </div>
//                     <h3 className="text-lg font-medium mb-2 text-muted-foreground">Add New Address</h3>
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {deliveryAddress.map((address: any) => (
//                     <div
//                       key={address.id}
//                       className={`border rounded-lg p-4 cursor-pointer transition-all ${
//                         watch("selectedAddressId") === address.id
//                           ? "border-accent bg-accent/5 shadow-sm"
//                           : "border-gray-200 hover:border-accent/50"
//                       }`}
//                       onClick={() => handleAddressSelect(address)}
//                     >
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2 mb-2">
//                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
//                               {address.addressType}
//                             </span>
//                             {watch("selectedAddressId") === address.id && (
//                               <span className="text-xs text-accent font-medium">✓ Selected</span>
//                             )}
//                           </div>

//                           <div className="space-y-1 text-sm">
//                             <p className="font-medium text-checkout-text">{address.street}</p>
//                             {address.landmark && (
//                               <p className="text-muted-foreground">Landmark: {address.landmark}</p>
//                             )}
//                             <p className="text-muted-foreground">
//                               {[address.city, address.state, address.postCode]
//                                 .filter(Boolean)
//                                 .join(", ")}
//                             </p>
//                             <p className="text-muted-foreground font-medium">{address.country}</p>
//                           </div>
//                         </div>

//                         <div className="ml-4">
//                           <div
//                             className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
//                               watch("selectedAddressId") === address.id
//                                 ? "border-accent bg-accent"
//                                 : "border-gray-300"
//                             }`}
//                           >
//                             {watch("selectedAddressId") === address.id && (
//                               <div className="w-2 h-2 bg-white rounded-full" />
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}

//                   <Button
//                     type="button"
//                     variant="outline"
//                     className="w-full border-dashed border-accent text-accent hover:bg-accent/10"
//                     onClick={() => setIsModalOpen(true)}
//                   >
//                     <Plus className="w-4 h-4 mr-2" />
//                     Add Another Address
//                   </Button>
//                 </div>
//               )}
//             </CardContent>
//           </Card>


//           {/* Submit Button for Development/Testing */}
//           <Button 
//           type="button"  
//           className="mt-6 w-full bg-accent md:w-full"
//           onClick={()=>setCurrentStep('cart')}
//           disabled = {!getValues("selectedAddressId")}
//           >
//              Continue to Payment
//           </Button>
//         </div>
//       </form>
//     </div>
//     <AddDeliveryAddress
//       isOpen={isModalOpen}
//       setIsOpen={setIsModalOpen}
//     />
//     </>
//   );
// };

// // ${formatPrice(checkoutData?.totalAmount/3,checkoutData?.ccy)}

import { useForm, Controller, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Truck, MapPin, ArrowLeft, Clock, Plus, Store, Package, Rocket, Ship, Edit } from "lucide-react";
import { toast } from "sonner";
import { CheckoutStep, FormData } from "@/app/checkout/checkoutContent";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/fetch-function";
import useCustomer from "@/store/customerStore";
import { useCart } from "@/store/cart";
import { useLocationStore } from "@/store/locationStore";
import axiosCustomer from "@/utils/fetch-function-customer";
import { formatPrice } from "@/utils/helperfns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import useGetLookup from "@/app/hooks/useGetLookup";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDeliveryAddress } from "@/app/hooks/useGetDeliveryAddress";
import AddDeliveryAddress from "../add-delivery-address";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

export const ShippingForm = ({ setCurrentStep, form }: { setCurrentStep: (currentStep: CheckoutStep) => void, form: UseFormReturn<FormData> }) => {

  const [shippingMethod, setShippingMethod] = useState<"delivery" | "pickup">("delivery");
  const { customer } = useCustomer()
  const { cart, getCartTotal, mainCcy } = useCart()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { location } = useLocationStore()
  const { back } = useRouter()
  const [selectedShippingOption, setSelectedShippingOption] = useState<string>("economy");
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const { register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    getValues,
    reset
  }
    = form
  const addressTypeOptions = useGetLookup('ADDRESS_TYPE')
  const { deliveryAddress, refetch: refetchAddresses } = useGetDeliveryAddress()

  const shippingOptions = [
    {
      id: 'economy',
      name: 'Economy',
      description: "Estimated Arrival, Oct 24-25",
      price: 10,
      estimatedArrival: 'Oct 24-25',
      icon: '🚚'
    },
    {
      id: 'regular',
      name: 'Regular',
      description: "Estimated Arrival, Oct 23-25",
      price: 15,
      estimatedArrival: 'Oct 23-25',
      icon: '📦'
    },
    {
      id: 'cargo',
      name: 'Cargo',
      description: "Estimated Arrival, Oct 22-25",
      price: 20,
      estimatedArrival: 'Oct 22-25',
      icon: '🚢'
    },
    {
      id: 'express',
      name: 'Express',
      description: "Estimated Arrival, Oct 21-25",
      price: 30,
      estimatedArrival: 'Oct 21-25',
      icon: '⚡'
    }
  ];

  const pickupStores = [
    {
      id: 'store-1',
      name: 'Downtown Store',
      address: '123 Main Street, Downtown',
      distance: '0.5 miles',
      hours: '9:00 AM - 8:00 PM',
      phone: '(555) 123-4567'
    },
    {
      id: 'store-2',
      name: 'Shopping Mall Branch',
      address: '456 Mall Road, Westside',
      distance: '1.2 miles',
      hours: '10:00 AM - 9:00 PM',
      phone: '(555) 987-6543'
    },
    {
      id: 'store-3',
      name: 'City Center Outlet',
      address: '789 Central Ave, City Center',
      distance: '2.1 miles',
      hours: '8:00 AM - 7:00 PM',
      phone: '(555) 456-7890'
    }
  ];

  useEffect(() => {
    setValue("shippingMethod", shippingMethod);
    setValue("shippingOption", selectedShippingOption);
    setValue("pickupStore", selectedStore);
  }, [shippingMethod, selectedShippingOption, selectedStore, setValue]);

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

  const handleStoreSelect = (storeId: string) => {
    setSelectedStore(storeId);
    setValue("pickupStore", storeId);
  };

  const getSelectedShippingOption = () => {
    return shippingOptions.find(option => option.id === selectedShippingOption) || shippingOptions[0];
  };

  const getSelectedStore = () => {
    return pickupStores.find(store => store.id === selectedStore);
  };

  const calculateOrderTotal = () => {
    const cartTotal = getCartTotal();
    const shippingCost = shippingMethod === 'delivery' ? getSelectedShippingOption().price : 0;
    return {
      subtotal: cartTotal,
      shipping: shippingCost,
      total: cartTotal + shippingCost
    };
  };

  const fetchAddressById = async (id: number) => {
    try {
      const response = await axiosInstance.get(`/ecommerce/get-delivery-address?id=${id}`);
      if (response.data.deliveryAddress) {
        return response.data.deliveryAddress;
      }
    } catch (error) {
      toast.error('Failed to fetch address details');
    }
    return null;
  };

  const handleEditAddress = async (address: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const addressDetails = await fetchAddressById(address.id);
    if (addressDetails) {
      setEditingAddress(addressDetails);
      setIsModalOpen(true);
    }
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleAddressSaved = () => {
    refetchAddresses();
    handleCloseModal();
  };

  const orderTotal = calculateOrderTotal();

  return (
    <>
      <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => back()}
            className="bg-accent/15 hover:bg-accent/50 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-2xl font-bold"></h2>
        </div>

        <form>
          <div className="mb-8">
            <h2 className="text-lg font-medium text-checkout-text mb-4">Shipping Information</h2>

            <div className="flex gap-4 mb-6">
              <Button
                type="button"
                className={`flex-1 justify-start gap-3 h-12 ${shippingMethod === 'delivery' ? 'bg-accent/5 border-accent border text-accent' : 'bg-white border text-black'} hover:bg-accent/10`}
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

            {shippingMethod === 'delivery' && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Delivery Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {deliveryAddress.length === 0 ? (
                    <div className="border-2 border-dashed border-accent rounded-md p-4 bg-accent/5 hover:bg-accent/10 cursor-pointer">
                      <Button
                        type="button"
                        className="w-full bg-transparent h-full flex flex-col items-center justify-center text-center py-10 hover:bg-accent/10"
                        onClick={handleAddNewAddress}
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
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${watch("selectedAddressId") === address.id
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

                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleEditAddress(address, e)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <div className="ml-2">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${watch("selectedAddressId") === address.id
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
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-dashed border-accent text-accent hover:bg-accent/10"
                        onClick={handleAddNewAddress}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Address
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {shippingMethod === 'pickup' && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Pickup Locations</CardTitle>
                  <p className="text-sm text-muted-foreground">Select a store near you for pickup</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pickupStores.map((store) => (
                      <div
                        key={store.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedStore === store.id
                          ? "border-accent bg-accent/5 shadow-sm"
                          : "border-gray-200 hover:border-accent/50"
                          }`}
                        onClick={() => handleStoreSelect(store.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Store className="w-4 h-4 text-accent" />
                              <h3 className="font-semibold text-checkout-text">{store.name}</h3>
                              {selectedStore === store.id && (
                                <Badge variant="secondary" className="bg-accent text-white text-xs">
                                  Selected
                                </Badge>
                              )}
                            </div>

                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p>{store.address}</p>
                              <div className="flex items-center gap-4 text-xs">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {store.distance}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {store.hours}
                                </span>
                              </div>
                              <p className="text-xs">{store.phone}</p>
                            </div>
                          </div>

                          <div className="ml-4">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedStore === store.id
                                ? "border-accent bg-accent"
                                : "border-gray-300"
                                }`}
                            >
                              {selectedStore === store.id && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {shippingMethod === 'delivery' && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Shipping Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={selectedShippingOption}
                    onValueChange={setSelectedShippingOption}
                    className="space-y-3"
                  >
                    {shippingOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedShippingOption === option.id
                          ? 'border-accent bg-accent/5 shadow-sm'
                          : 'border-gray-200 hover:border-accent/50'
                          }`}
                      >
                        <label
                          htmlFor={option.id}
                          className="flex items-center gap-4 cursor-pointer"
                        >
                          <RadioGroupItem value={option.id} id={option.id} />
                          <div className="text-2xl">{option.icon}</div>
                          <div className="flex-1">
                            <span className="font-semibold cursor-pointer text-checkout-text">
                              {option.name}
                            </span>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-checkout-text">{formatPrice(option.price, mainCcy() as any)}</p>
                          </div>
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {/* <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-checkout-text">Subtotal</span>
                    <span className="font-medium">{formatPrice(orderTotal.subtotal, mainCcy() as any)}</span>
                  </div>

                  {shippingMethod === 'delivery' && (
                    <div className="flex justify-between">
                      <span className="text-checkout-text">
                        Shipping ({getSelectedShippingOption().name})
                      </span>
                      <span className="font-medium">{formatPrice(orderTotal.shipping, mainCcy() as any)}</span>
                    </div>
                  )}

                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span className="text-checkout-text">Total</span>
                      <span>{formatPrice(orderTotal.total, mainCcy() as any)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            <Button
              type="button"
              className="w-full bg-accent md:w-full"
              onClick={() => setCurrentStep('cart')}
              disabled={
                shippingMethod === 'delivery'
                  ? !getValues("selectedAddressId") || !selectedShippingOption
                  : !selectedStore
              }
            >
              Continue to Payment
            </Button>
          </div>
        </form>
      </div>

      <AddDeliveryAddress
        isOpen={isModalOpen}
        setIsOpen={handleCloseModal}
        editingAddress={editingAddress}
        onAddressSaved={handleAddressSaved}
      />
    </>
  );
};