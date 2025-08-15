import { ProductProps } from '@/types'
import Image from 'next/image'
import React from 'react'

export const Product = ({ product }: { product: ProductProps }) => {
    const discount = product?.sale_price ? Math.ceil((product.price! - product.sale_price!) / product.price! * 100):0
    
    
  return (
    <div className='w-full bg-white shadow-md relative p-4 rounded-sm'>
        {discount > 0 && (
            <div className='absolute top-0 right-0 bg-accent text-white p-1 rounded-bl-md'>
                {discount}%
            </div>
        )}
        <div className='w-full flex justify-center'>
            <Image
                src={product.image?.original!}
                alt={product.name!}
                width={300}
                height={300}
                className='object-cover'
            />
        </div>

        <div className='space-x-2'>
            <span className='text-md font-semibold'>
                ${product.sale_price! || product.price! || `${product?.min_price!} - ${product?.max_price!}`}
            </span>
            {discount > 0 && (
                <del className='text-[#9ca3af] text-[14px]'>${product.price!}</del>
            )}
        </div>

        <h3 className="truncate text-md font-semibold text-[#6b7280]">
            {product.name!}
        </h3>

        {/* <button className='flex w-full py-4 bg-[]'>
            <span>Add</span>
            <span>+</span>
        </button> */}

    </div>
  )
}
