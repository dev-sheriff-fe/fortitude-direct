import React from 'react'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Controller, useForm } from 'react-hook-form'
import useGetLookup from '@/app/hooks/useGetLookup'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '@aws-amplify/ui-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosCustomer from '@/utils/fetch-function-customer'
import { toast } from 'sonner'

type AddDeliveryForm = {
    state: string;
    city: string;
    street: string;
    postCode: string;
    landmark: string;
    country: string;
    addressType: string;
}


const AddDeliveryAddress = ({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: (open: boolean) => void}) => {

    const {register, formState: {errors},control,handleSubmit} = useForm<AddDeliveryForm>()
    const addressTypeOptions = useGetLookup('ADDRESS_TYPE')
    const queryClient = useQueryClient()
    const {isPending,mutate} = useMutation({
        mutationFn: (data:any)=>axiosCustomer.request({
            url: '/ecommerce/save-delivery-address',
            method: 'POST',
            data
        }),
        onSuccess: (data)=>{
            if (data?.data?.code!=='000') {
                toast.error(data?.data?.desc)
                return
            }
            toast.success(data?.data?.desc)
            queryClient.invalidateQueries({
                queryKey: ["delivery-addresses"]
            })
            setIsOpen(false)
            return
        },
        onError: (error)=>{
            console.log(error);
            toast?.error('Something went wrong!')
            return
        }
    })

    const onSubmit = (data: AddDeliveryForm) => {
        console.log(data);

        const payload = {
            country: data?.country,
            addressType: data?.addressType,
            state: data?.state,
            city: data?.city,
            landmark: data?.landmark,
            street: data?.street,
            postCode: data?.postCode,
            orderNo: ''
        }

        mutate(payload)
    }
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-medium">
              Add Delivery Address
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
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
        
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.addressType && (
                <p className="text-destructive text-sm mt-1">{errors.addressType.message}</p>
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
                <div>
                    <Label htmlFor="state" className="text-checkout-text text-sm font-medium">
                        State
                    </Label>
                    <Input
                        id="state"
                        placeholder="Enter state"
                        {...register("state", { required: "State is required" })}
                        className={`mt-1 ${errors.state ? "border-destructive" : ""}`}
                    />
                    {errors.state && (
                        <p className="text-destructive text-sm mt-1">{errors.state.message}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="city" className="text-checkout-text text-sm font-medium">
                        City
                    </Label>
                    <Input
                        id="city"
                        placeholder="Enter city"
                        {...register("city")}
                        className={`mt-1 ${errors.state ? "border-destructive" : ""}`}
                    />
                    {errors.city && (
                        <p className="text-destructive text-sm mt-1">{errors.city.message}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="street" className="text-checkout-text text-sm font-medium">
                        Street
                    </Label>
                    <Input
                        id="street"
                        placeholder="Enter Street"
                        {...register("street")}
                        className={`mt-1 ${errors.street ? "border-destructive" : ""}`}
                    />
                    {errors.street && (
                        <p className="text-destructive text-sm mt-1">{errors.street.message}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="landmark" className="text-checkout-text text-sm font-medium">
                        Landmark
                    </Label>
                    <Input
                        id="landmark"
                        placeholder="landmark"
                        {...register("landmark")}
                        className={`mt-1 ${errors.landmark ? "border-destructive" : ""}`}
                    />
                    {errors.landmark && (
                        <p className="text-destructive text-sm mt-1">{errors.landmark?.message}</p>
                    )}
                </div>
                <div className='md:col-span-2'>
                    <Label htmlFor="postCode" className="text-checkout-text text-sm font-medium">
                        Postal Code
                    </Label>
                    <Input
                        id="postCode"
                        placeholder="Postal Code"
                        {...register("postCode")}
                        className={`mt-1 ${errors.postCode ? "border-destructive" : ""}`}
                    />
                    {errors.postCode && (
                        <p className="text-destructive text-sm mt-1">{errors.postCode?.message}</p>
                    )}
                </div>
            </div>
            <Button type="submit" 
            className="w-full bg-accent hover:bg-accent/90 p-2 rounded-md text-white mt-4"
            disabled = {isPending}
            >
                {isPending ? 'Please wait...': 'Save Address'}
            </Button>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default AddDeliveryAddress