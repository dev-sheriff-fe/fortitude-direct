'use client'
import { useCategories } from '@/app/hooks/useCategories'
import Image from 'next/image'
import React from 'react'

const CategoriesDesktop = () => {
  const {data, isLoading, error} = useCategories()

  console.log(data);

  if (isLoading) return <div className="p-4 hidden md:block">Loading...</div>
  if (error) return <div className="p-4">Error loading categories</div>

  return (
    <div className='hidden lg:block lg:w-[380px] xl:w-[380px] lg:sticky lg:top-22 lg:self-start lg:max-h-screen'>
      <div 
        className='p-4 bg-light max-h-[calc(100vh-5.5rem)] overflow-y-auto'
        style={{
          scrollbarWidth: 'none',
          scrollbarColor: 'transparent',
        }}
      >
        <ul className='grid grid-cols-2 gap-4'>
          {data?.data?.map((category:any) => (
            <li
              key={category.id}
              className='w-full h-full bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center p-3 hover:shadow-md transition-shadow duration-200 cursor-pointer'
            >
              <div className='w-12 h-12 mb-3 relative flex-shrink-0'>
                <Image
                  src={category?.image?.original}
                  alt={category.name}
                  fill
                  className='object-contain'
                />
              </div>
              <span className='text-xs text-center text-gray-700 font-medium leading-tight line-clamp-2'>
                {category.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CategoriesDesktop
