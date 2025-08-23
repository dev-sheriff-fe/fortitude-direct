import { Input } from '@/components/ui/input'
import React from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { FormData } from '../SignUpForm'


type Props = {
    register: UseFormRegister<FormData>,
    errors: FieldErrors<FormData>,
    watchedValues: FormData,
    setValue: UseFormSetValue<FormData>
}

const BusinessInformation = ({register,errors,watchedValues,setValue}:Props) => {
  return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                Business Name
              </label>
              <Input
                id="businessName"
                {...register("businessName", { required: "Business name is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your business name"
              />
              {errors.businessName && <p className="text-red-500 text-xs">{errors.businessName.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="firstname" className="text-sm font-medium text-gray-700">
                First Name
              </label>
              <Input
                id="firstname"
                {...register("firstname", { required: "First name is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter first name"
              />
              {errors.firstname && <p className="text-red-500 text-xs">{errors.firstname.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="lastname" className="text-sm font-medium text-gray-700">
                Last Name
              </label>
              <Input
                id="lastname"
                {...register("lastname", { required: "Last name is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter last name"
              />
              {errors.lastname && <p className="text-red-500 text-xs">{errors.lastname.message}</p>}
            </div>
          </div>
        )
}

export default BusinessInformation