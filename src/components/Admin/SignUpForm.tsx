"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"
import posIcon from '@/assets/login-image.png'
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import BusinessInformation from "./onboarding/business-information"
import ContactDetails from "./onboarding/contact-details"
import PasswordDetails from "./onboarding/password-details"
import LocationDetails from "./onboarding/location-details"
import axiosInstanceNoAuth from "@/utils/fetch-function-auth"

export interface FormData {
  businessName: string
  firstname: string
  lastname: string
  email: string
  mobileNo: string
  address: string
  country: string
  state?: string
  city: string
  password: string
  cPassword: string
}

export function SignUpForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid },
    trigger,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      businessName: "",
      firstname: "",
      lastname: "",
      email: "",
      mobileNo: "",
      address: "",
      country: "",
      state: "",
      city: "",
      password: "",
      cPassword: "",
    },
  })

  const watchedValues = watch()

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return watchedValues.businessName && watchedValues.firstname && watchedValues.lastname
      case 2:
        return watchedValues.email && watchedValues.mobileNo
      case 3:
        return watchedValues.password && watchedValues.cPassword
      case 4:
        return watchedValues.address && watchedValues.state && watchedValues.city && watchedValues?.country
      default:
        return false
    }
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isStepValid = await trigger(fieldsToValidate)

    if (isStepValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  const getFieldsForStep = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 1:
        return ["businessName", "firstname", "lastname"]
      case 2:
        return ["email", "mobileNo"]
      case 3:
        return ["password", "cPassword"]
      case 4:
        return ["address", "country", "city"]
      default:
        return []
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: () => axiosInstanceNoAuth.request({
      url: 'business/onboard',
      method: 'POST',
      data: {
        email: getValues().email,
        firstname: getValues().firstname,
        lastname: getValues().lastname,
        bvn: '12345678901',
        businessName: getValues().businessName,
        businessType: 'STORE',
        mobileNo: getValues().mobileNo,
        password: getValues().password,
        address: getValues().address,
        state: getValues().state,
        city: getValues().city,
        deviceId: 'string',
        dob: '1990-05-15',
        photoLink: '/user-photo.jpg',
        bvnPhotoLink: '/bvn-photo.jpg',
        accountType: 'MERCHWAL',

        currencyCode: 'NGN',
        referralCode: '000000',
        countryCode: 'NG',
        onboardDocs: [],

        entityCode: 'H2P',
        merchantGroupCode: 'M0001',
        branchCode: 'ETZ_HO',
        id: 0,
      }
    }),
    onSuccess: (response) => {
      if (response?.data?.code === '000') {
        toast.success(response?.data?.desc ?? 'Registration successful');
        // Open liveness page in new tab
        window.open(`/liveness?id=${response?.data?.id}`, '_blank');
        return
      } else {
        toast.error(response.data?.desc);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'An error occurred');
    },
  })
  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data)
    mutate()
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessInformation
          errors={errors}
          register={register}
          setValue={setValue}
          watchedValues={watchedValues}
        />


      case 2:
        return <ContactDetails
          errors={errors}
          register={register}
        />

      case 3:
        return <PasswordDetails
          errors={errors}
          register={register}
          watch={watch}
        />
      case 4:
        return <LocationDetails
          errors={errors}
          register={register}
          setValue={setValue}
          watchedValues={watchedValues}
        />

      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Business Information"
      case 2:
        return "Contact Details"
      case 3:
        return "Password Details"
      case 4:
        return "Location Details"
      default:
        return ""
    }
  }



  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Blue header bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-accent"></div>

      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-8">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">ONBOARDING</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Welcome to the Retail Store.
              <br />
              Complete your business registration to get started.
            </p>
          </div>

          <div className="flex items-center justify-center mb-6 relative">
            <div className="flex items-center">
              {[1, 2, 3, 4].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium relative z-10 ${step <= currentStep ? "bg-accent text-white" : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {step}
                  </div>
                  {index < 3 && <div className={`w-20 h-0.5 ${step < currentStep ? "bg-accent" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">{getStepTitle()}</h2>
            {renderStep()}

            <div className="flex justify-between space-x-4">
              <Button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
                className="flex items-center space-x-2 px-6 py-3 disabled:opacity-50 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepComplete()}
                  className="flex items-center space-x-2 bg-accent hover:bg-accent/70 text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!isStepComplete() || isPending}
                  className="bg-accent hover:bg-accent/70 text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Submitting..." : "Complete Registration"}
                </Button>
              )}
            </div>
          </form>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 items-center justify-center p-8">
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={posIcon}
            alt="POS System Illustration"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  )
}