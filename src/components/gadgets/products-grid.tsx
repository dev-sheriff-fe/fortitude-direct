'use client'

import axiosInstance from "@/utils/fetch-function"
import { useQuery } from "@tanstack/react-query"
import { Product } from "./product"
import { ProductProps } from "@/types"

const ProductsGrid = () => {
    // This component displays a grid of products
    const {data,isLoading,error} = useQuery({
        queryKey: ['products'],
        queryFn: ()=> axiosInstance.request({
            url: '/products',
            method: 'GET',
            params: {
                searchJoin: 'and',
                limit: 30,
                language: 'en',
                search: `type.slug:gadget`,
                status: 'publish'
            }
        })
    })

    console.log(data);
    

  return (
    <div className='p-4'>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-3">
          {data?.data?.data?.map((product:ProductProps) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
    </div>
  )
}

export default ProductsGrid