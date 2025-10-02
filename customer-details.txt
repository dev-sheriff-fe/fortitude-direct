import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Truck, MapPin, ArrowLeft, Clock } from "lucide-react";
import { toast } from "sonner";
import { CheckoutStep } from "@/app/checkout/checkoutContent";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/utils/fetch-function";
import useCustomer from "@/store/customerStore";
import { useCart } from "@/store/cart";
import { useLocationStore } from "@/store/locationStore";
import axiosCustomer from "@/utils/fetch-function-customer";
import { formatPrice } from "@/utils/helperfns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import useGetLookup from "@/app/hooks/useGetLookup";


const formSchema = z.object({
  shippingMethod: z.enum(["delivery", "pickup"]).default("delivery")?.optional(),
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
  country: z.string().min(1, "Please select a country"),
  addressType: z.string().min(1, "Please select address type").optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  street: z.string().optional(),
  landmark: z.string().optional(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type FormData = z.infer<typeof formSchema>;

export const ShippingForm = ({setCurrentStep}: {setCurrentStep: (currentStep:CheckoutStep)=>void}) => {

  const [shippingMethod, setShippingMethod] = useState<"delivery" | "pickup">("delivery");
  const {customer} = useCustomer()
  const {cart} = useCart()
  const {location} = useLocationStore()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shippingMethod: "delivery",
      fullName: "",
      country: "",
      city: "",
      state: "",
      zipCode: "",
      agreeTerms: false,
    },
  });

  const addressTypeOptions = useGetLookup('ADDRESS_TYPE')

  console.log(addressTypeOptions);
  
  const [pendingModal,setPendingModal] = useState(false)

  const [checkoutData,setCheckoutData] = useState<any>(null)
         useEffect(() => {
        const stored = sessionStorage.getItem('checkout');
        if (stored) {
          setCheckoutData(JSON.parse(stored));
        }
      }, []);

  const {isPending,mutate,data} = useMutation({
    mutationFn: (data:any)=>axiosCustomer({
        url: '/ecommerce/submit-order',
        method: 'POST',
        data
    }),
    onSuccess: (data)=>{
        if (data?.data?.responseCode!=='000') {
            if (data?.data?.responseCode==='PP') {
              setPendingModal(true)
              return
            }
            toast?.error(data?.data?.responseMessage)
            return
        }
        toast?.success(data?.data?.responseMessage)
        reset({
                agreeTerms:false,
                city: '',
                country:'',
                fullName:'',
                landmark:'',
                shippingMethod:'delivery',
                state:'',
                street:'',
                zipCode:''
              })
    },
    onError: (error)=>{
        toast.error('Something went wrong!')
    }
  })

  console.log(customer);
  

  const onSubmit = (data: FormData) => {
    const orderItems = cart.map(item=>({
            itemCode: item?.code,
            itemName: item?.name,
            price: item?.salePrice,
            quantity: item?.quantity,
            amount: item?.subTotal,
            discount: 0,
            picture: item?.picture,
        }))
    const payload = {
        channel: "WEB",
        cartId: checkoutData?.orderNo,
        orderDate: "",
        totalAmount: checkoutData?.payingAmount,
        totalDiscount: 0,
        deliveryOption: data?.shippingMethod,
        paymentMethod: "BNPL",
        couponCode: "",
        ccy: checkoutData?.payingCurrency,
        deliveryFee: 0,
        geolocation: location ? `${location?.latitude}, ${location?.longitude}` : '',
        deviceId: customer?.deviceID,
        orderSatus: "",
        paymentStatus: "",
        storeCode: customer?.storeCode || "STO445",
        customerName: data?.fullName,
        username: customer?.username,
        deliveryAddress: {
            id: 0,
            street: data?.street,
            landmark: data?.landmark,
            postCode: data?.zipCode,
            city: data?.city,
            state: data?.state,
            country: data?.country,
            addressType: data?.addressType || 'WAREHOUSE'
        },
        cartItems: orderItems
    }

    mutate(payload)
  };

  console.log(data);
  

  const {mutate:checkStatus,isPending:checkingStatus} = useMutation({
          mutationFn: ()=>axiosCustomer({
              url: 'tran-master/tsq',
              params: {
                  externalRefNo: data?.data?.orderNo
              }
          }),
          onSuccess: (data)=>{
              if (data?.data?.responseCode === 'PP') {
                return
              }
              if (data?.data?.responseCode!=='000') {
                  toast?.error(data?.data?.responseMessage)
                  return
              }
              // setCurrentStep('success')
              // setStep('success')
              toast.success(data?.data?.responseMessage)
              setPendingModal(false)
              reset({
                agreeTerms:false,
                city: '',
                country:'',
                fullName:'',
                landmark:'',
                shippingMethod:'delivery',
                state:'',
                street:'',
                zipCode:''
              })
          },
          onError: ()=>{
              toast.error('something went wrong')
          }
      })



  const handleShippingMethodChange = (method: "delivery" | "pickup") => {
    setShippingMethod(method);
    setValue("shippingMethod", method);
  };

  return (
    <>
      <div className="w-full">
      <div className="flex items-center gap-1 mb-8">
        <button className="h-fit" onClick={()=>setCurrentStep('cart')}><ArrowLeft/></button>
        <h1 className="text-2xl font-semibold text-checkout-text">Checkout</h1>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Shipping Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-checkout-text mb-4">Shipping Information</h2>
          
          {/* Shipping Method */}
          <div className="flex gap-4 mb-6">
            <Button
              type="button"
            //   variant={shippingMethod === "delivery" ? "default" : "outline"}
              className={`flex-1 justify-start gap-3 h-12 ${shippingMethod === 'delivery'?'bg-accent/5 border-accent border text-accent' : 'bg-white border text-black'} hover:bg-accent/10`}
              onClick={() => handleShippingMethodChange("delivery")}
            >
              <Truck className="w-4 h-4" />
              Delivery
            </Button>
            <Button
              type="button"
            //   variant={shippingMethod === "pickup" ? "default" : "outline"}
              className={`flex-1 justify-start gap-3 h-12 ${shippingMethod === 'pickup' ? 'bg-accent/5 border-accent border text-accent' : "bg-white border text-black"} hover:bg-accent/10`}
              onClick={() => handleShippingMethodChange("pickup")}
            >
              <MapPin className="w-4 h-4" />
              Pick up
            </Button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-checkout-text text-sm font-medium">
                Full name
              </Label>
              <Input
                id="fullName"
                placeholder="Enter full name"
                {...register("fullName")}
                className={`mt-1 ${errors.fullName ? "border-destructive" : ""}`}
              />
              {errors.fullName && (
                <p className="text-destructive text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
              <Label htmlFor="addressType" className="text-checkout-text text-sm font-medium">
                Address Type *
              </Label>
              <Controller
                name="addressType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={`mt-1 ${errors.addressType ? "border-destructive" : ""} w-full`}>
                      <SelectValue placeholder="Choose address type" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {
                        addressTypeOptions.map((option)=>(
                          <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                        ))
                      }
                      {/* <SelectItem value="NG">Nigeria</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem> */}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.country && (
                <p className="text-destructive text-sm mt-1">{errors.country.message}</p>
              )}
            </div>
            <div className="w-full">
              <Label htmlFor="country" className="text-checkout-text text-sm font-medium">
                Country *
              </Label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={`mt-1 ${errors.country ? "border-destructive" : ""} w-full`}>
                      <SelectValue placeholder="Choose country" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="NG">Nigeria</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.country && (
                <p className="text-destructive text-sm mt-1">{errors.country.message}</p>
              )}
            </div>
            </div>

            <div>
                <Label htmlFor="street" className="text-checkout-text text-sm font-medium">
                  Street
                </Label>
                <Input
                  id="street"
                  placeholder="Enter street"
                  {...register("street")}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="landmark" className="text-checkout-text text-sm font-medium">
                  Landmark
                </Label>
                <Input
                  id="landmark"
                  placeholder="Enter landmark"
                  {...register("landmark")}
                  className="mt-1"
                />
              </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city" className="text-checkout-text text-sm font-medium">
                  City
                </Label>
                <Input
                  id="city"
                  placeholder="Enter city"
                  {...register("city")}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-checkout-text text-sm font-medium">
                  State
                </Label>
                <Input
                  id="state"
                  placeholder="Enter state"
                  {...register("state")}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="zipCode" className="text-checkout-text text-sm font-medium">
                  ZIP Code
                </Label>
                <Input
                  id="zipCode"
                  placeholder="Enter ZIP code"
                  {...register("zipCode")}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Controller
                name="agreeTerms"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="terms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className={errors.agreeTerms ? "border-destructive" : ""}
                  />
                )}
              />
              <div className="flex-1">
                <Label
                  htmlFor="terms"
                  className="text-sm text-checkout-text-muted leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I have read and agree to the Terms and Conditions.
                </Label>
                {errors.agreeTerms && (
                  <p className="text-destructive text-sm mt-1">{errors.agreeTerms.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button for Development/Testing */}
          <Button type="submit" disabled={isPending} className="mt-6 w-full bg-accent md:w-full">
            {isPending ? `Please wait`: `Pay now`}
          </Button>
        </div>
      </form>
    </div>

    <Dialog open={pendingModal} onOpenChange={setPendingModal}>
      <DialogContent>
            <DialogHeader className="flex flex-col items-center gap-y-3">
              <DialogTitle className="sr-only">Pending State</DialogTitle>
              <div className="flex justify-center mb-4">
            <Clock className="w-16 h-16 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold">Transaction Processing</h2>
        </DialogHeader>

        <div className="flex gap-4">
                    {/* <Button variant="outline" onClick={onCancel} className="flex-1">
                      Cancel
                    </Button> */}
                    <Button disabled = {checkingStatus} onClick={()=>checkStatus()} className="flex-1 bg-accent">
                      {checkingStatus ? `Please wait..` : `Check Transaction Status`}
                    </Button>
                  </div>

        </DialogContent>           
    </Dialog>
    </>
  );
};

// ${formatPrice(checkoutData?.totalAmount/3,checkoutData?.ccy)}