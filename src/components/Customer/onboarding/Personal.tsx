import { Input } from '@/components/ui/input'
import React from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormData } from '../SignUpForm'


type Props = {
    register: UseFormRegister<FormData>,
    errors: FieldErrors<FormData>,
    watchedValues: FormData,
    setValue: UseFormSetValue<FormData>
}

const Personal = ({register,errors,watchedValues,setValue}:Props) => {
  return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="firstname" className="text-sm font-medium text-gray-700">
                Firstname
              </label>
              <Input
                id="firstname"
                {...register("firstname", { required: "This field is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your first name"
              />
              {errors.firstname && <p className="text-red-500 text-xs">{errors.firstname.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="lastname" className="text-sm font-medium text-gray-700">
                Lastname
              </label>
              <Input
                id="lastname"
                {...register("lastname", { required: "Last name is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter last name"
              />
              {errors.lastname && <p className="text-red-500 text-xs">{errors.lastname.message}</p>}
            </div>

            <Select 
            value={watchedValues?.gender}
            onValueChange={(value) => setValue("gender", value, { shouldValidate: true })}
            >
                <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={'Male'}>Male</SelectItem>
                    <SelectItem value={'Female'}>Female</SelectItem>
                </SelectContent>
            </Select>

          <div className="space-y-2">
              <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                Date Of Birth
              </label>
              <Input
                id="dateOfBirth"
                {...register("dateOfBirth", { required: "Date of birth is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type='date'
              />
              {errors.lastname && <p className="text-red-500 text-xs">{errors.lastname.message}</p>}
            </div>
          </div>
        )
}

export default Personal