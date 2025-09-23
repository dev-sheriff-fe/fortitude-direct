'use client'
import React, { useState } from 'react'
import { DialogDescription, DialogHeader, DialogTitle } from './dialog'
import { Input } from './input'
import Link from 'next/link'
import { Button } from './button'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/utils/fetch-function'
import { toast } from 'sonner'
import * as z from 'zod'
import useCustomer from '@/store/customerStore'
import { hasAccess, setAuthCredentials } from '@/utils/auth-utils-customer'
import { Label } from '@radix-ui/react-dropdown-menu'
export type LoginProps = {
    // setState: React.Dispatch<React.SetStateAction<'login' | 'register'>>,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}
type FormData = {
    username: string,
    password: string
}

const otpSchema = z.object({
    otp: z.string()
        .min(1, 'OTP is required')
        .regex(/^\d{6}$/, 'OTP must be exactly 6 digits')
});

type OTPForm = z.infer<typeof otpSchema>;
export const LoginForm = ({ setIsOpen }: LoginProps) => {
    const { register, handleSubmit } = useForm<FormData>()
    const { setCustomer } = useCustomer()
    const {
        register: registerOTP,
        handleSubmit: handleSubmitOTP,
        formState: { errors: otpErrors },
        reset: resetOTP
    } = useForm<OTPForm>();
    const searchParams = useSearchParams()
    const { refresh,push } = useRouter()
    const [loginStep, setLoginStep] = useState<'credentials' | 'otp'>('credentials')
    const [loginData, setLoginData] = useState<FormData | null>(null);
    const storeCode = searchParams.get('storeCode') || ''
    const { mutate, isPending } = useMutation({
        mutationFn: (data: any) => axiosInstance.request({
            url: '/ecommerce/login',
            method: 'POST',
            data,
        }),
        onSuccess: (data) => {
            localStorage.setItem("token_customer", data.data.ticketID)
            localStorage.setItem("customer_store", JSON.stringify(data.data))
            setCustomer(data?.data)
            if (data?.data?.ticketID) {
                if (hasAccess([data?.data.userRole], ["CUSTOMER"])) {
                    setAuthCredentials(data?.data.ticketID, ['CUSTOMER'])
                    setIsOpen(false)
                    return
                }
                toast.error("Not enough permission")
            } else {
                toast.error("Wrong credentials")
            }
        },
        onError: (error) => {
            console.log(error);
        }
    })
    const onSubmit = (value: FormData) => {
        const payload = {
            username: value?.username,
            password: value?.password,
            entityCode: 'H2P',
            language: 'en',
            channelType: 'WEB',
            deviceId: ''
        }

        mutate(payload)
    }
    return (
        <div className='space-y-3'>
            <DialogHeader className='flex flex-col'>
                <DialogTitle className="text-2xl text-center font-medium">Login</DialogTitle>
                <DialogDescription className="text-sm text-center">Please enter your credentials to continue</DialogDescription>
            </DialogHeader>

            <form className='' onSubmit={handleSubmit(onSubmit)}>
                {
                    loginStep === 'credentials' ? (
                        <div className='flex flex-col gap-4'>
                            <div>
                                <Label>Username</Label>
                                <Input
                                    {...register('username')}
                                    type="text"
                                    placeholder="Username"
                                    className="mt-2"
                                />
                            </div>
                            <div className='w-full'>
                                <Label>Password</Label>
                                <Input
                                    {...register('password')}
                                    type="password"
                                    placeholder="Password"
                                    className='mt-2'
                                />

                                <Link href="/forgot-password" className="text-sm relative right-0 text-accent underline">
                                    Forgot your password?
                                </Link>
                            </div>

                            <Button type='submit' className='bg-accent text-white'>{isPending ? 'Logging in...' : 'Login'}</Button>
                        </div>
                    )
                        :
                        <div>
                            <Input
                                {...registerOTP('otp')}
                                type="text"
                                placeholder="Enter OTP"
                                className="mb-4"
                                maxLength={6}
                            />
                            <Button className='bg-accent text-white w-full' disabled={isPending}>{isPending ? 'Verifying...' : 'Verify OTP'}</Button>
                        </div>
                }
            </form>

            <p className='text-sm text-center'>
                Don't have an account?{' '}
                <Link href={`/customer-onboarding`} className="text-accent underline" target='_blank'>
                    Register
                </Link >
            </p>

            <Link href="/admin-login" target="_blank" className="relative z-10">
                <p className='text-sm text-center'>
                    Are you an admin?{' '}
                    <button type='button' className="text-accent underline">
                        login here
                    </button>
                </p>
            </Link>
        </div>
    )
}

// export default LoginForm

// import React, { useState } from 'react'
// import { DialogDescription, DialogHeader, DialogTitle } from './dialog'
// import { Input } from './input'
// import Link from 'next/link'
// import { Button } from './button'
// import { useForm } from 'react-hook-form'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { useMutation } from '@tanstack/react-query'

// import { toast } from 'sonner'
// import * as z from 'zod'
// import useCustomer from '@/store/customerStore'
// import { hasAccess, setAuthCredentials } from '@/utils/auth-utils-customer'
// import { Label } from '@radix-ui/react-dropdown-menu'
// import axiosCustomer from '@/utils/fetch-function-no-auth'
// export type LoginProps = {
//     setState: React.Dispatch<React.SetStateAction<'login' | 'register'>>,
//     setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
// }

// type FormData = {
//     username: string,
//     password: string
// }

// const otpSchema = z.object({
//     otp: z.string()
//         .min(1, 'OTP is required')
//         .regex(/^\d{6}$/, 'OTP must be exactly 6 digits')
// });

// type OTPForm = z.infer<typeof otpSchema>;

// const LoginForm = ({ setState, setIsOpen }: LoginProps) => {
//     const { register, handleSubmit } = useForm<FormData>()
//     const { setCustomer } = useCustomer()
//     const {
//         register: registerOTP,
//         handleSubmit: handleSubmitOTP,
//         formState: { errors: otpErrors },
//         reset: resetOTP
//     } = useForm<OTPForm>();
//     const searchParams = useSearchParams()
//     const { refresh, push } = useRouter()
//     const [loginStep, setLoginStep] = useState<'credentials' | 'otp'>('credentials')
//     const [loginData, setLoginData] = useState<FormData | null>(null);
//     const [showAdminButton, setShowAdminButton] = useState(false);
//     const [customerData, setCustomerData] = useState<any>(null);
//     const storeCode = searchParams.get('storeCode') || ''
    
//     const { mutate, isPending } = useMutation({
//         mutationFn: (data: any) => axiosCustomer.request({
//             url: '/ecommerce/login',
//             method: 'POST',
//             data,
//         }),
//         onSuccess: (data) => {
//             localStorage.setItem("token_customer", data.data.ticketID)
//             localStorage.setItem("customer_store", JSON.stringify(data.data))
//             setCustomer(data?.data)
//             setCustomerData(data?.data)
            
//             if (data?.data?.ticketID) {
//                 if (hasAccess([data?.data.userRole], ["CUSTOMER"])) {
//                     setAuthCredentials(data?.data.ticketID, ['CUSTOMER'])
//                     setShowAdminButton(true); // Show the admin button on successful login
//                     // Don't close the modal immediately
//                     return
//                 }
//                 toast.error("Not enough permission")
//             } else {
//                 toast.error("Wrong credentials")
//             }
//         },
//         onError: (error) => {
//             console.log(error);
//         }
//     })
    
//     const onSubmit = (value: FormData) => {
//         const payload = {
//             username: value?.username,
//             password: value?.password,
//             entityCode: 'H2P',
//             language: 'en',
//             channelType: 'WEB',
//             deviceId: ''
//         }

//         mutate(payload)
//     }
    
//     const handleGoToAdmin = () => {
//         if (customerData) {
//             // Store the customer credentials for admin access
//             localStorage.setItem("token_store_admin", customerData.ticketID);
//             localStorage.setItem("user_store", JSON.stringify(customerData));
            
//             // Redirect to customer-admin
//             push('/customer-admin');
//             setIsOpen(false);
//         }
//     }

//     return (
//         <div className='space-y-3'>
//             <DialogHeader className='flex flex-col'>
//                 <DialogTitle className="text-2xl text-center font-medium">Login</DialogTitle>
//                 <DialogDescription className="text-sm text-center">Please enter your credentials to continue</DialogDescription>
//             </DialogHeader>

//             <form className='' onSubmit={handleSubmit(onSubmit)}>
//                 {
//                     loginStep === 'credentials' ? (
//                         <div className='flex flex-col gap-4'>
//                             <div>
//                                 <Label>Username</Label>
//                                 <Input
//                                     {...register('username')}
//                                     type="text"
//                                     placeholder="Username"
//                                     className="mt-2"
//                                 />
//                             </div>
//                             <div className='w-full'>
//                                 <Label>Password</Label>
//                                 <Input
//                                     {...register('password')}
//                                     type="password"
//                                     placeholder="Password"
//                                     className='mt-2'
//                                 />

//                                 <Link href="/forgot-password" className="text-sm relative right-0 text-accent underline">
//                                     Forgot your password?
//                                 </Link>
//                             </div>

//                             <Button type='submit' className='bg-accent text-white'>{isPending ? 'Logging in...' : 'Login'}</Button>
                            
//                             {/* Show admin button only after successful login */}
//                             {showAdminButton && (
//                                 <Button 
//                                     type="button" 
//                                     className='bg-blue-600 text-white mt-2'
//                                     onClick={handleGoToAdmin}
//                                 >
//                                     Go to Admin
//                                 </Button>
//                             )}
//                         </div>
//                     )
//                         :
//                         <div>
//                             <Input
//                                 {...registerOTP('otp')}
//                                 type="text"
//                                 placeholder="Enter OTP"
//                                 className="mb-4"
//                                 maxLength={6}
//                             />
//                             <Button className='bg-accent text-white w-full' disabled={isPending}>{isPending ? 'Verifying...' : 'Verify OTP'}</Button>
//                         </div>
//                 }
//             </form>

//             <p className='text-sm text-center'>
//                 Don't have an account?{' '}
//                 <button type='button' className="text-accent underline" onClick={() => setState('register')}>
//                     Register
//                 </button>
//             </p>

//             <Link href="/admin-login" target="_blank" className="relative z-10">
//                 <p className='text-sm text-center'>
//                     Are you an admin?{' '}
//                     <button type='button' className="text-accent underline">
//                         login here
//                     </button>
//                 </p>
//             </Link>
//         </div>
//     )
// }

// export default LoginForm