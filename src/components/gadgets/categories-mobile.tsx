import React from 'react'
import { SheetContent, SheetTitle } from '../ui/sheet'
import { useCategories } from '@/app/hooks/useCategories'
import Image from 'next/image'

const CategoriesMoile = () => {
  const {data,isLoading,error} = useCategories()
  return (
    <SheetContent side='left' className='p-4'>
      <SheetTitle>Categories</SheetTitle>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading categories</div>}
      {data && (
        <ul className='space-y-5'>
          {data?.data?.map((category:any) => (
            <li key={category.id} className='flex items-center gap-x-3'>
              <div className='w-5 h-5 mb-3 relative flex-shrink-0 flex items-center'>
                <Image
                  src={category?.image?.original}
                  alt={category.name}
                  fill
                  className='object-contain self-center'
                />
              </div>
              <span>{category.name}</span>
            </li>
          ))}
        </ul>
      )}
    </SheetContent>
  )
}

export default CategoriesMoile