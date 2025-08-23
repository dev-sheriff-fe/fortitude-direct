'use client'

import axiosInstance from "@/utils/fetch-function"
import { useQuery } from "@tanstack/react-query"
import { Product } from "./product"
import { ProductProps } from "@/types"
import { useSearchParams } from "next/navigation"
import { Dialog, DialogContent } from "../ui/dialog"
import { Suspense, useState } from "react"
import ProductDetail from "../ui/product-modal"

const ProductsGrid = () => {
    // This component displays a grid of products
    const searchParams = useSearchParams();
    const category = searchParams.get('category') || ''
    const name = searchParams.get('name') || ''
    const storeCode = searchParams.get('storeCode') || ''
    const [modalProduct, setModalProduct] = useState<ProductProps | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    
   const { data,isLoading } = useQuery({
  queryKey: ["products",category,name],
  queryFn: () => {
    return axiosInstance.request({
      method: "GET",
      url: '/ecommerce/products/list',
      params: {
        name,
        storeCode,
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
    

    console.log(isOpen);
    

  return (
    <div className='p-4'>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-3">
          {data?.products?.map((product:ProductProps) => (
            <Product key={product.id} product={product} onClick={() => {
              setModalProduct(product);
              setIsOpen(true);
            }} />
          ))}
        </div>

        {
          isOpen && <Suspense><ProductDetail product={modalProduct} setIsOpen={setIsOpen} /></Suspense>
        }
    </div>
  )
}

export default ProductsGrid