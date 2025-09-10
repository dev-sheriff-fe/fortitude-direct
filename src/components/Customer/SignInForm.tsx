"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import posIcon from "@/assets/ecommerce-svg.jpg"
import { useMutation } from "@tanstack/react-query"
import axiosInstance from "@/utils/fetch-function"
// import { hasAccess, setAuthCredentials } from "@/utils/auth-utils"
import { toast } from "sonner"
// import useUser from "@/global_states/userStore"
import { useRouter } from "next/navigation"

import useUser from "@/store/userStore"
import useCustomer from "@/store/customerStore"
import { hasAccess, setAuthCredentials } from "@/utils/auth-utils-customer"

export function SignInForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { setUser } = useUser()
  const { push } = useRouter()
  const {setCustomer} = useCustomer()
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
                    push('/dashboard')
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
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const payload = {
            username: username,
            password: password,
            entityCode: 'H2P',
            language: 'en',
            channelType: 'WEB',
            deviceId: ''
        }

        mutate(payload)
    }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Blue header bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-blue-600"></div>

      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
        <div className="w-full max-w-md space-y-6">
          {/* Heading */}
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">SIGN IN</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Welcome back.
              <br />
              Sign in to access your account.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium"
              disabled= {isPending}
            >
              {isPending ? "Please wait" : "Sign In"}
            </Button>
          </form>

          <div className="text-center">
            <span className="text-sm text-gray-600">Don&apos;t have an account? </span>
            <Link
              href="/customer-onboarding"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 items-center justify-center p-8">
        <Image
          src={posIcon}
          alt="POS System Illustration"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  )
}
