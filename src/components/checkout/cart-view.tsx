// 'use client'
// import React, { useEffect, useState } from 'react'
// import { Button } from '../ui/button';
// import { ArrowLeft, Bot, Building2, Calendar, CoinsIcon, CreditCard, DollarSign, Shield, Wallet, Zap } from 'lucide-react';
// import { Card, CardContent } from '../ui/card';
// import { Badge } from '../ui/badge';
// import { useCart } from '@/store/cart';
// import { CurrencyCode, formatPrice } from '@/utils/helperfns';
// import { PaymentMethod } from '@/app/checkout/checkoutContent';

// type CartViewProps = {
//   handlePaymentSelect: (method: PaymentMethod) => void;
// }

// const CartView = ({ handlePaymentSelect }: CartViewProps) => {
//   const { cart, getCartTotal, mainCcy } = useCart()
//   const ccy = mainCcy()
//   const [aiRecommendation, setAiRecommendation] = useState<PaymentMethod>('usdt');
//   const [checkoutData, setCheckoutData] = useState<any>(null)
//   useEffect(() => {
//     const stored = sessionStorage.getItem('checkout');
//     if (stored) {
//       setCheckoutData(JSON.parse(stored));
//     }
//   }, []);
//   const CartView = () => (
//     <div className="max-w-2xl mx-auto space-y-6">
//       <div className="flex items-center gap-2">
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => window.history.back()}
//         >
//           <ArrowLeft className="w-4 h-4" />
//         </Button>
//         <h2 className="text-2xl font-bold">Checkout</h2>
//       </div>

//       {/* AI Recommendation Banner */}
//       <Card className="border-accent bg-accent/5">
//         <CardContent className="p-4">
//           <div className="flex items-start gap-3">
//             <Bot className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
//             <div className="flex-1">
//               <div className="flex items-center gap-2 mb-1">
//                 <h3 className="font-semibold text-accent">AI Recommendation</h3>
//                 <Badge variant="secondary" className="bg-accent text-secondary">
//                   <Zap className="w-3 h-3 mr-1" />
//                   Optimal
//                 </Badge>
//               </div>
//               <p className="text-sm">
//                 Pay with <strong>USDT (TRC-20)</strong> and save <strong>1.8%</strong> on fees
//               </p>
//               <p className="text-xs text-muted-foreground mt-1">
//                 Based on your location and payment history analysis
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Cart Items */}
//       <div className='grid grid-cols-2 gap-4'>
//         {cart.map((item) => (
//           <Card key={item.id}>
//             <CardContent className="p-6">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
//                   {item.picture ? (
//                     <img
//                       src={item.picture}
//                       alt={item.name}
//                       className="w-full h-full object-cover rounded"
//                     />
//                   ) : (
//                     <div className="text-2xl">📦</div>
//                   )}
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="font-semibold">{item.name}</h3>
//                   <p className="text-sm text-muted-foreground">{item.category}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-lg font-bold">{formatPrice(item?.subTotal, ccy as CurrencyCode)}</p>
//                   <p className="text-sm text-muted-foreground">{item.quantity} × {formatPrice(item?.subTotal, ccy as CurrencyCode)}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>


//       {/* Payment Method Selection */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold">Choose Payment Method</h3>
//         <div className="grid md:grid-cols-2 gap-4">
//           {/* USDT Option */}
//           <Card
//             className={`cursor-pointer transition-all ${aiRecommendation === 'usdt'
//                 ? 'border-accent bg-accent/5 shadow-md'
//                 : 'hover:shadow-md'
//               }`}
//             onClick={() => handlePaymentSelect('usdt')}
//           >
//             <CardContent className="p-6">
//               <div className="flex items-center gap-3 mb-3">
//                 <Wallet className="w-6 h-6 text-accent" />
//                 <div className="flex-1">
//                   <h4 className="font-semibold">USDT (TRC-20)</h4>
//                   {aiRecommendation === 'usdt' && (
//                     <Badge variant="secondary" className="bg-accent text-secondary text-xs">
//                       <Bot className="w-3 h-3 mr-1" />
//                       AI Recommended
//                     </Badge>
//                   )}
//                 </div>
//               </div>
//               <div className="space-y-2 text-sm">
//                 <div className="flex items-center gap-2 text-accent">
//                   <Shield className="w-4 h-4" />
//                   <span>Instant approval</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-accent">
//                   {/* <DollarSign className="w-4 h-4" /> */}
//                   {/* <span>Save ${estimatedSavings.toFixed(2)} in fees</span> */}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Zap className="w-4 h-4" />
//                   <span>~3 second confirmation</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Card Option */}
//           <Card
//             className="cursor-pointer hover:shadow-md transition-all"
//             onClick={() => handlePaymentSelect('card')}
//           >
//             <CardContent className="p-6">
//               <div className="flex items-center gap-3 mb-3">
//                 <CreditCard className="w-6 h-6" />
//                 <div>
//                   <h4 className="font-semibold">Card Payment</h4>
//                   <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
//                 </div>
//               </div>
//               <div className="space-y-2 text-sm text-muted-foreground">
//                 <p>• Standard processing</p>
//                 <p>• 3D Secure verification</p>
//                 <p>• {formatPrice(checkoutData?.totalAmount || 0, ccy as CurrencyCode)} total</p>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Buy Now Pay Later Option */}
//           <Card
//             className="cursor-pointer hover:shadow-md transition-all"
//             onClick={() => handlePaymentSelect('bnpl')}
//           >
//             <CardContent className="p-6">
//               <div className="flex items-center gap-3 mb-3">
//                 <Calendar className="w-6 h-6 text-blue-600" />
//                 <div>
//                   <h4 className="font-semibold">Buy Now Pay Later</h4>
//                   <p className="text-xs text-muted-foreground">3 interest-free installments</p>
//                 </div>
//               </div>
//               <div className="space-y-2 text-sm text-muted-foreground">
//                 <p>• Spread payment of {formatPrice(checkoutData?.totalAmount || 0, mainCcy() as CurrencyCode)} today</p>
//                 <p>• Pay according to your credit score</p>
//                 <p>• 0% interest rate</p>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Bank Transfer Option */}
//           <Card
//             className="cursor-pointer hover:shadow-md transition-all"
//             onClick={() => handlePaymentSelect('bank')}
//           >
//             <CardContent className="p-6">
//               <div className="flex items-center gap-3 mb-3">
//                 <Building2 className="w-6 h-6 text-purple-600" />
//                 <div>
//                   <h4 className="font-semibold">Bank Transfer</h4>
//                   <p className="text-xs text-muted-foreground">Virtual account transfer</p>
//                 </div>
//               </div>
//               <div className="space-y-2 text-sm text-muted-foreground">
//                 <p>• Instant virtual account</p>
//                 <p>• Direct bank transfer</p>
//                 <p>• {formatPrice(checkoutData?.totalAmount || 0, ccy as CurrencyCode)} total</p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );

//   return <CartView />;
// }

// export default CartView

'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { ArrowLeft, Bot, Building2, Calendar, CoinsIcon, CreditCard, DollarSign, Shield, Wallet, Zap, Plus, Edit, MapPin, Truck, Package, Rocket, Ship, Building } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useCart } from '@/store/cart';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { PaymentMethod } from '@/app/checkout/checkoutContent';
import axiosInstance from '@/utils/fetch-function';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useForm } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import Image from "next/image";
import rexpay from '@/components/images/rexpay.png'
import { useRouter } from 'next/navigation';

type CartViewProps = {
  handlePaymentSelect: (method: PaymentMethod) => void;
}

interface DeliveryAddress {
  id: number;
  street: string;
  landmark: string;
  postCode: string;
  city: string;
  state: string;
  country: string;
  addressType: string;
}

interface AddressFormData {
  street: string;
  landmark: string;
  postCode: string;
  city: string;
  state: string;
  country: string;
  addressType: string;
}

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedArrival: string;
  icon: React.ReactNode;
}

const CartView = ({ handlePaymentSelect }: CartViewProps) => {
  const { cart, getCartTotal, mainCcy } = useCart()
  const ccy = mainCcy()
  const [aiRecommendation, setAiRecommendation] = useState<PaymentMethod>('usdt');
  const [checkoutData, setCheckoutData] = useState<any>(null)
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<string>('economy');
  const router = useRouter()


  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<AddressFormData>();

  // Shipping options data
  const shippingOptions: ShippingOption[] = [
    {
      id: 'economy',
      name: 'Economy',
      description: 'Estimated Arrival, Dec 20-23',
      price: 10,
      estimatedArrival: 'Dec 20-23',
      icon: '🚚'
    },
    {
      id: 'regular',
      name: 'Regular',
      description: 'Estimated Arrival, Dec 20-22',
      price: 15,
      estimatedArrival: 'Dec 20-22',
      icon: '📦'
    },
    {
      id: 'cargo',
      name: 'Cargo',
      description: 'Estimated Arrival, Dec 19-20',
      price: 20,
      estimatedArrival: 'Dec 19-20',
      icon: '🚢'
    },
    {
      id: 'express',
      name: 'Express',
      description: 'Estimated Arrival, Dec 18-19',
      price: 30,
      estimatedArrival: 'Dec 18-19',
      icon: '⚡'
    }
  ];


  useEffect(() => {
    const stored = sessionStorage.getItem('checkout');
    if (stored) {
      setCheckoutData(JSON.parse(stored));
    }
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get('/ecommerce/get-addresses');
      if (response.data.deliveryAddress) {
        setAddresses(response.data.deliveryAddress);
        // Auto-select the first address if available
        if (response.data.deliveryAddress.length > 0) {
          setSelectedAddress(response.data.deliveryAddress[0]);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch addresses');
    }
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

  const onSubmit = async (data: AddressFormData) => {
    try {
      const requestData = editingAddress ? { ...data, id: editingAddress.id } : data;

      const response = await axiosInstance.post('/ecommerce/save-delivery-address', requestData);

      if (response.data.code === '000') {
        toast.success(editingAddress ? 'Address updated successfully' : 'Address saved successfully');
        setIsAddressModalOpen(false);
        setEditingAddress(null);
        reset();
        fetchAddresses();
      } else {
        toast.error(response.data.message || 'Failed to save address');
      }
    } catch (error) {
      toast.error('Failed to save address');
    }
  };

  const handleEditAddress = async (address: DeliveryAddress) => {
    const addressDetails = await fetchAddressById(address.id);
    if (addressDetails) {
      setEditingAddress(addressDetails);
      Object.keys(addressDetails).forEach(key => {
        setValue(key as keyof AddressFormData, addressDetails[key as keyof DeliveryAddress]);
      });
      setIsAddressModalOpen(true);
    }
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    reset();
    setIsAddressModalOpen(true);
  };

  const getSelectedShippingOption = () => {
    return shippingOptions.find(option => option.id === selectedShipping) || shippingOptions[0];
  };

  const AddressModal = () => (
    <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                {...register('street', { required: 'Street address is required' })}
                placeholder="123 Main Street"
              />
              {errors.street && <span className="text-red-500 text-xs">{errors.street.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="landmark">Landmark</Label>
              <Input
                id="landmark"
                {...register('landmark')}
                placeholder="Near shopping mall"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register('city', { required: 'City is required' })}
                placeholder="New York"
              />
              {errors.city && <span className="text-red-500 text-xs">{errors.city.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                {...register('state', { required: 'State is required' })}
                placeholder="NY"
              />
              {errors.state && <span className="text-red-500 text-xs">{errors.state.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postCode">Postal Code</Label>
              <Input
                id="postCode"
                {...register('postCode', { required: 'Postal code is required' })}
                placeholder="10001"
              />
              {errors.postCode && <span className="text-red-500 text-xs">{errors.postCode.message}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                {...register('country', { required: 'Country is required' })}
                placeholder="United States"
              />
              {errors.country && <span className="text-red-500 text-xs">{errors.country.message}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressType">Address Type</Label>
            <Input
              id="addressType"
              {...register('addressType')}
              placeholder="Home/Office/Other"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsAddressModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingAddress ? 'Update Address' : 'Save Address'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  const AddressSelection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Shipping Address</h3>
        <AddressModal />
      </div>

      {addresses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No shipping addresses saved</p>
            <Button onClick={handleAddNewAddress}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className={`cursor-pointer transition-all ${selectedAddress?.id === address.id
                ? 'border-accent bg-accent/5'
                : 'hover:shadow-md'
                }`}
              onClick={() => setSelectedAddress(address)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{address.addressType || 'Shipping Address'}</h4>
                      {selectedAddress?.id === address.id && (
                        <Badge variant="secondary" className="bg-accent text-white">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm">{address.street}</p>
                    {address.landmark && <p className="text-sm text-muted-foreground">Near {address.landmark}</p>}
                    <p className="text-sm">{address.city}, {address.state} {address.postCode}</p>
                    <p className="text-sm text-muted-foreground">{address.country}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAddress(address);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const ShippingSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Shipping Method</h3>
      <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping} className="space-y-3">
        {shippingOptions.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all ${selectedShipping === option.id
              ? 'border-accent bg-accent/5'
              : 'hover:shadow-md'
              }`}
            onClick={() => setSelectedShipping(option.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <div className="text-2xl">{option.icon}</div>
                  <div className="flex-1">
                    <Label htmlFor={option.id} className="font-semibold cursor-pointer">
                      {option.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(option.price, ccy as CurrencyCode)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>
    </div>
  );

  const OrderSummary = () => {
    const cartTotal = getCartTotal();
    const shippingCost = getSelectedShippingOption().price;
    const total = cartTotal + shippingCost;

    return (
      <Card>
        <CardContent className="p-6 space-y-3">
          <h4 className="font-semibold text-lg">Order Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal, ccy as CurrencyCode)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping ({getSelectedShippingOption().name})</span>
              <span>{formatPrice(shippingCost, ccy as CurrencyCode)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(total, ccy as CurrencyCode)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const CartView = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router?.push(`/`)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-2xl font-bold">Checkout</h2>
      </div>

      {/* Shipping Address Selection */}
      <AddressSelection />

      {/* Shipping Method Selection */}
      <ShippingSelection />

      {/* Cart Items */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Order Items</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {cart.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                    {item.picture ? (
                      <img
                        src={item.picture}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="text-2xl">📦</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatPrice(item?.subTotal, ccy as CurrencyCode)}</p>
                    {/* <p className="text-xs text-muted-foreground">{item.quantity} × {formatPrice(item?.price, ccy as CurrencyCode)}</p> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <OrderSummary />

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Choose Payment Method</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Rexpay Option */}
          <Card
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => handlePaymentSelect('rexpay')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <Wallet className="w-6 h-6 text-purple-600" />
                <div>
                  <h4 className="font-semibold">RexPay</h4>
                  <p className="text-xs text-muted-foreground">Integrated payment gateway</p>
                </div>
                <Image src={rexpay} alt="RexPay Logo" className="w-[30%] h-[30%]" />
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Direct Bank Transfer</p>
                <p>• Card & USSD Payment</p>
                <p>• {formatPrice(checkoutData?.totalAmount || 0, ccy as CurrencyCode)} total</p>
              </div>
            </CardContent>
          </Card>

          {/* USDT Option */}
          <Card
            className={`cursor-pointer transition-all ${aiRecommendation === 'usdt'
              ? 'border-accent bg-accent/5 shadow-md'
              : 'hover:shadow-md'
              }`}
            onClick={() => handlePaymentSelect('usdt')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Building className="w-6 h-6 text-accent" />
                <div className="flex-1">
                  <h4 className="font-semibold">USDT (TRC-20)</h4>
                  {aiRecommendation === 'usdt' && (
                    <Badge variant="secondary" className="bg-accent text-secondary text-xs">
                      <Bot className="w-3 h-3 mr-1" />
                      AI Recommended
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-accent">
                  <Shield className="w-4 h-4" />
                  <span>Instant approval</span>
                </div>
                <div className="flex items-center gap-2 text-accent">
                  <Zap className="w-4 h-4" />
                  <span>~3 second confirmation</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card Option */}
          <Card
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => handlePaymentSelect('card')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="w-6 h-6" />
                <div>
                  <h4 className="font-semibold">Card Payment</h4>
                  <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Standard processing</p>
                <p>• 3D Secure verification</p>
                <p>• {formatPrice(checkoutData?.totalAmount || 0, ccy as CurrencyCode)} total</p>
              </div>
            </CardContent>
          </Card>

          {/* Buy Now Pay Later Option */}
          <Card
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => handlePaymentSelect('bnpl')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold">Buy Now Pay Later</h4>
                  <p className="text-xs text-muted-foreground">3 interest-free installments</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Spread payment of {formatPrice(checkoutData?.totalAmount || 0, mainCcy() as CurrencyCode)} today</p>
                <p>• Pay according to your credit score</p>
                <p>• 0% interest rate</p>
              </div>
            </CardContent>
          </Card>

          {/* Bank Transfer Option */}
          <Card
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => handlePaymentSelect('bank')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="w-6 h-6 text-purple-600" />
                <div>
                  <h4 className="font-semibold">Bank Transfer</h4>
                  <p className="text-xs text-muted-foreground">Virtual account transfer</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Instant virtual account</p>
                <p>• Direct bank transfer</p>
                <p>• {formatPrice(checkoutData?.totalAmount || 0, ccy as CurrencyCode)} total</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return <CartView />;
}

export default CartView;