import React from 'react'
import { FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { FormData } from '../SignUpForm'

type Props = {
    errors: FieldErrors<FormData>,
    register: UseFormRegister<FormData>,
    watch: UseFormWatch<FormData>,
}
const PasswordDetails = ({ errors, register, watch }: Props) => {
  return (
    <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="cPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Input
                id="cPassword"
                type="password"
                {...register("cPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm your password"
              />
              {errors.cPassword && <p className="text-red-500 text-xs">{errors.cPassword.message}</p>}
            </div>
          </div>
  )
}

export default PasswordDetails;