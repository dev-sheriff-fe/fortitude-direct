'use client'

import axiosInstance from "@/utils/fetch-function"
import { useQuery } from "@tanstack/react-query"
import { Product } from "./product"
import { ProductProps } from "@/types"
import { useSearchParams } from "next/navigation"

const ProductsGrid = () => {
    // This component displays a grid of products
    const searchParams = useSearchParams();
    const category = searchParams.get('category') || ''

    console.log(category);
    
   const { data,isLoading } = useQuery({
  queryKey: ["products",category],
  queryFn: () => {
    return axiosInstance.request({
      method: "GET",
      url: '/ecommerce/products/list',
      params: {
        name: '',
        storeCode: '',
        entityCode: 'H2P',
        category,
        tag: '',
        pageNumber: 1,
        pageSize: 200
      }
    })
    .then(response => response.data)
  }
});

    if (isLoading) return <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {
            [1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="animate-pulse h-[356px] bg-gray-200 rounded-md mb-2"></div>
            ))
        }
    </div>
    

  return (
    <div className='p-4'>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-3">
          {data?.products?.map((product:ProductProps) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
    </div>
  )
}

export default ProductsGrid