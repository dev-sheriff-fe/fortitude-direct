"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"
// import posIcon from '@/assets/ecommerce-svg.jpg'
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import axiosInstance from "@/utils/fetch-function"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Personal from "./onboarding/Personal"
import ContactDetails from "./onboarding/Contact"
import PasswordDetails from "./onboarding/PasswordDetails"
import LocationDetails from "./onboarding/LocationDetails"
import { formatDateToDDMMYYYY } from "@/utils/helperfns"
import axiosCustomer from "@/utils/fetch-function-no-auth"
import Link from "next/link"
import { OtpVerification } from "./otp-verification"


export interface FormData {
  firstname: string
  lastname: string
  email: string
  mobileNo: string
  nationality: string
  state?: string
  city: string
  password: string
  cPassword: string
  gender: string
  dateOfBirth?: string
}

export function SignUpForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [onboardStep, setOnBoardStep] = useState<'register' | 'otp'>('register')
  const totalSteps = 4
  const router = useRouter()
  const bannerUrl = process.env.NEXT_PUBLIC_BANNER_URL || "https://mmcpdocs.s3.eu-west-2.amazonaws.com/16574_ecommerce-svg.jpg";
  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || '';


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

      firstname: "",
      lastname: "",
      email: "",
      mobileNo: "",
      nationality: "",
      state: "",
      city: "",
      password: "",
      cPassword: "",
      dateOfBirth: ''
    },
  })

  const watchedValues = watch()
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => axiosCustomer.request({
      url: '/ecommerce/customer/simple-onboard',
      method: 'POST',
      data,
      headers: {
        'x-source-code': process.env.NEXT_PUBLIC_SOURCE_CODE || 'HELP2PAY',
        'x-client-id': process.env.NEXT_PUBLIC_CLIENT_ID || 'TST03054745785188010772',
        'x-client-secret': process.env.NEXT_PUBLIC_CLIENT_SECRET || 'TST03722175625334233555707073458615741827171811840881'
      }
    }),
    onSuccess: (data) => {
      if (data?.data?.code !== '000') {
        toast.error(data?.data?.desc || "An error occurred");
        return;
      }
      // router.push(`/customer-login`)
      setOnBoardStep('otp')
      toast.success("Registration successful! Please login.");

    },
    onError: (error) => {
      console.log(error);
    }
  })
  const onSubmit = (value: FormData) => {
    const nationalityData = JSON?.parse(value?.nationality)
    const payload = {
      firstname: value?.firstname,
      channel: 'WEB',
      customerType: "",
      deviceId: "",
      geolocation: "",
      lastname: value?.lastname,
      name: value?.firstname,
      middlename: "",
      mobileNo: value?.mobileNo,
      email: value?.email,
      entityCode: entityCode,
      city: value?.city,
      countryCode: nationalityData?.code,
      gender: value?.gender,
      onboardingId: "",
      dateOfBirth: formatDateToDDMMYYYY(value?.dateOfBirth),
      password: value?.password,
      nationality: nationalityData?.nationality,
      phoneCode: nationalityData?.phoneCode,
      referralCode: "",
      bvn: "12345678901"
    }

    mutate(payload)
  }

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return watchedValues?.gender && watchedValues.firstname && watchedValues.lastname && watchedValues?.dateOfBirth
      case 2:
        return watchedValues.email && watchedValues.mobileNo
      case 3:
        return watchedValues.password && watchedValues.cPassword
      case 4:
        return watchedValues.city && watchedValues?.nationality
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
        return ["firstname", "lastname", "gender", "dateOfBirth"]
      case 2:
        return ["email", "mobileNo"]
      case 3:
        return ["password", "cPassword"]
      case 4:
        return ["nationality", "city"]
      default:
        return []
    }
  }


  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Personal
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
        return "Personal Details"
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

  const handleBackToRegistration = () => {
    setOnBoardStep('register')
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Blue header bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-accent"></div>

      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-8">
        {
          onboardStep === 'otp'
            ?
            <OtpVerification
              onBack={handleBackToRegistration}
              email={getValues('email')}
            />
            :
            <div className="w-full max-w-md space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">ONBOARDING</h1>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Welcome to the Retail Store.
                  <br />
                  Complete your user registration to get started.
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

              <div className="text-center">
                <span className="text-sm text-gray-600">Already registered? </span>
                <Link
                  href="/customer-login"
                  className="text-sm text-accent hover:text-blue-700"
                >
                  Sign in
                </Link>
              </div>
            </div>
        }
      </div>

      {/* Right side - Illustraton */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 items-center justify-center p-8">
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={bannerUrl}
            alt="POS System Illustration"
            width={600}
            height={600}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  )
}