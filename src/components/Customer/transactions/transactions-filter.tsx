'use client'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'
import React, { useState } from 'react'

const statusOptions = [
    {id: 'all', label: 'All Status'},
    {id: 'sent', label: 'Sent'},
    {id: 'success', label: 'Success'},
    {id: 'pending', label: 'Pending'}
]

const TransactionsFilter = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="flex lg:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Filter size={16} />
          <span className="text-sm font-medium">Filters</span>
        </button>
      </div>

      {/* Filter Container */}
      <div className={`
        bg-gray-50 rounded-lg border transition-all duration-200 ease-in-out
        ${isFilterOpen ? 'block' : 'hidden'} lg:block
      `}>
        <div className="p-4 space-y-4 lg:space-y-0">
          
          {/* Desktop Layout */}
          <div className="hidden lg:flex lg:items-center lg:justify-between lg:gap-4">
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <Search size={16} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  className="flex-1 border-none outline-none bg-transparent text-sm placeholder:text-gray-500"
                  placeholder="Search by name, transaction ID..."
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-3">
              
              {/* Status Select */}
              <Select>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date Range */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Input
                  type="date"
                  className="w-[140px] bg-white"
                />
                <span className="px-1">to</span>
                <Input
                  type="date"
                  className="w-[140px] bg-white"
                />
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="flex flex-col space-y-4 lg:hidden">
            
            {/* Search Bar */}
            <div className="relative flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
              <Search size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                className="flex-1 border-none outline-none bg-transparent text-sm placeholder:text-gray-500"
                placeholder="Search by name, transaction ID..."
              />
            </div>

            {/* Filter Controls Row 1 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Select>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Range Row */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Date Range
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="date"
                    className="w-full bg-white"
                    placeholder="From date"
                  />
                </div>
                <div className="flex items-center justify-center sm:px-2">
                  <span className="text-sm text-gray-500">to</span>
                </div>
                <div className="flex-1">
                  <Input
                    type="date"
                    className="w-full bg-white"
                    placeholder="To date"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Clear All
              </button>
              <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TransactionsFilter