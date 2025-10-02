'use client'
import { ProductProps } from '@/types';
import React, { Suspense } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import Image from 'next/image';
import { Heart, Star } from 'lucide-react';
import { CurrencyCode, formatPrice } from '@/utils/helperfns';
import { useCart } from '@/store/cart';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import { Product } from '../gadgets/product';

type ProductDetailProps = {
    product: ProductProps | null;
    setIsOpen: (isOpen: boolean) => void;
}

const ProductDetail = ({ product, setIsOpen }: ProductDetailProps) => {
    const { addToCart, decrement, increment, inCart, singleQuantity } = useCart()
    const [modalProduct, setModalProduct] = React.useState<ProductProps | null>(null);
    const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || '';
    const { data,isLoading } = useQuery({
  queryKey: ["products"],
  queryFn: () => {
    return axiosInstance.request({
      method: "GET",
      url: '/ecommerce/products/list',
      params: {
        name: '',
        storeCode: '',
        entityCode: entityCode,
        category: product?.category || '',
        tag: '',
        pageNumber: 1,
        pageSize: 200
      }
    })
    .then(response => response.data)
  }
});
  return (
    <Dialog open={!!product} onOpenChange={setIsOpen}>
        <DialogContent 
        className='min-w-[100vw] lg:min-w-[90vw] h-screen overflow-y-auto py-2'
        style={{
            scrollbarWidth: 'none',
            scrollbarColor: 'transparent',
        }}
        >
            <DialogTitle className='sr-only'>{product?.name}</DialogTitle>
            <div className='min-h-screen flex flex-col lg:grid lg:grid-cols-2 gap-4  p-4'>
                {/* Image Section */}
                <div className='w-full max-w-md h-64 sm:h-80 lg:h-96 relative mx-auto flex-shrink-0'>
                    <Image
                        src={product?.picture!}
                        alt={product?.name!}
                        fill
                        className='object-contain'
                    />
                </div>
                
                {/* Product Info Section */}
                <div className='flex flex-col justify-start lg:justify-center space-y-4 lg:p-4'>
                    <div className='flex flex-col gap-y-8 border-b'>
                        {/* Product Name and Heart */}
                        <div className='flex items-start justify-between gap-3'>
                            <h2 className='text-xl sm:text-2xl font-semibold flex-1 leading-tight'>{product?.name}</h2>
                            <div className='flex items-center justify-center gap-2 h-11 w-11 p-3 rounded-full border-accent border flex-shrink-0'>
                                <Heart size={20} className='text-accent'/>
                            </div>
                        </div>
                        
                        {/* Quantity and Star */}
                        <div className='flex items-center justify-between'>
                            <span className='text-sm sm:text-base'>1pcs</span>
                            <button className='p-1 bg-accent text-white rounded-md lg:mr-2'>
                                <Star size={16}/>
                            </button>
                        </div>
                        
                        {/* Price */}
                        <div className='py-2'>
                            <span className='text-accent text-2xl sm:text-3xl font-semibold block'>
                                {formatPrice(product?.salePrice! || product?.oldPrice!, product?.ccy! as CurrencyCode)}
                            </span>

                            ({formatPrice(product?.usdPrice!, 'USD')})
                        </div>
                        
                        {/* Add to Cart Section */}
                        <div className='flex flex-col gap-3 items-stretch'>
                            {singleQuantity(product?.id) <= 0 && (
                                <button 
                                    className='group flex w-full py-3 bg-gray-100 items-center justify-center text-sm text-gray-600 font-semibold rounded-md transition-colors duration-200 relative hover:bg-accent hover:text-white cursor-pointer' 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addToCart(product as any)
                                    }}
                                >
                                    <span className='flex-1 text-center pr-12'>Add</span>
                                    <span className='bg-gray-200 h-full absolute right-0 top-0 group-hover:bg-accent group-hover:text-white px-3 flex items-center justify-center text-base text-black rounded-r-md border-l group-hover:border-accent'>+</span>
                                </button>
                            )}

                            {inCart(product?.id) && (
                                <div className='group flex w-full py-3 bg-accent items-center justify-between text-sm text-white font-semibold rounded-md transition-colors duration-200 relative'>
                                    <button 
                                        className='bg-accent h-full w-12 absolute left-0 top-0 flex items-center justify-center text-base text-white border-accent rounded-l-md border-r hover:bg-accent-dark' 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            decrement(product as any)
                                        }}
                                    >-</button>
                                    <span className='flex-1 text-center px-12'>{singleQuantity(product?.id)}</span>
                                    <button 
                                        className='bg-accent h-full w-12 absolute right-0 top-0 flex items-center justify-center text-base text-white border-accent rounded-r-md border-l hover:bg-accent-dark' 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            increment(product as any)
                                        }}
                                    >+</button>
                                </div>
                            )}
                            
                            {/* Available Stock */}
                            <div className='text-center lg:text-center'>
                                <span className='text-gray-600 text-base sm:text-lg'>{product?.qtyInStore} available</span>
                            </div>
                        </div>
                    </div>

                    {/* Category */}
                    <div className='py-2'>
                        <span className='text-gray-600 text-sm sm:text-base'>
                            Category: <span className='inline-block p-1 text-xs sm:text-sm border bg-gray-100 font-semibold rounded ml-1'>{product?.category}</span>
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Details Section */}
            <div className='px-4 pb-6'>
                <h3 className='text-lg font-semibold mb-3'>Details</h3>
                <p className='text-gray-600 text-sm sm:text-base leading-relaxed'>{product?.description}</p>
            </div>

            {/* Related products */}
            <div>
                <h3 className='text-lg font-semibold mb-3'>Related Products</h3>
                {
                    isLoading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {
                            [1, 2, 3, 4, 5, 6].map((item) => (
                                <div key={item} className="animate-pulse h-[356px] bg-gray-200 rounded-md mb-2"></div>
                            ))
                        }
                    </div>
                    ):
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-3 mt-1">
                              {data?.products?.map((product:ProductProps) => (
                                <Suspense>
                                    <Product key={product.id} product={product} onClick={() => {
                                  setModalProduct(product);
                                  setIsOpen(true);
                                }} />
                                </Suspense>
                              ))}
                    </div>
                }
            })
                .then(response => response.data)
        }
    });
    return (
        <Dialog open={!!product} onOpenChange={setIsOpen}>
            <DialogContent
                className='min-w-[100vw] lg:min-w-[90vw] h-screen overflow-y-auto py-2'
                style={{
                    scrollbarWidth: 'none',
                    scrollbarColor: 'transparent',
                }}
            >
                <DialogTitle className='sr-only'>{product?.name}</DialogTitle>
                <div className='min-h-screen flex flex-col lg:grid lg:grid-cols-2 gap-4  p-4'>
                    {/* Image Section */}
                    <div className='w-full max-w-md h-64 sm:h-80 lg:h-96 relative mx-auto flex-shrink-0'>
                        <Image
                            src={product?.picture!}
                            alt={product?.name!}
                            fill
                            className='object-contain'
                        />
                    </div>

                    {/* Product Info Section */}
                    <div className='flex flex-col justify-start lg:justify-center space-y-4 lg:p-4'>
                        <div className='flex flex-col gap-y-8 border-b'>
                            {/* Product Name and Heart */}
                            <div className='flex items-start justify-between gap-3'>
                                <h2 className='text-xl sm:text-2xl font-semibold flex-1 leading-tight'>{product?.name}</h2>
                                <div className='flex items-center justify-center gap-2 h-11 w-11 p-3 rounded-full border-accent border flex-shrink-0'>
                                    <Heart size={20} className='text-accent' />
                                </div>
                            </div>

                            {/* Quantity and Star */}
                            <div className='flex items-center justify-between'>
                                <span className='text-sm sm:text-base'>1pcs</span>
                                <button className='p-1 bg-accent text-white rounded-md lg:mr-2'>
                                    <Star size={16} />
                                </button>
                            </div>

                            {/* Price */}
                            <div className='py-2'>
                                <span className='text-accent text-2xl sm:text-3xl font-semibold block'>
                                    {formatPrice(product?.salePrice! || product?.oldPrice!, product?.ccy! as CurrencyCode)}
                                </span>

                                ({formatPrice(product?.usdPrice!, 'USD')})
                            </div>

                            {/* Add to Cart Section */}
                            <div className='flex flex-col gap-3 items-stretch'>
                                {singleQuantity(product?.id) <= 0 && (
                                    <button
                                        className='group flex w-full py-3 bg-gray-100 items-center justify-center text-sm text-gray-600 font-semibold rounded-md transition-colors duration-200 relative hover:bg-accent hover:text-white cursor-pointer'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(product as any)
                                        }}
                                    >
                                        <span className='flex-1 text-center pr-12'>Add</span>
                                        <span className='bg-gray-200 h-full absolute right-0 top-0 group-hover:bg-accent group-hover:text-white px-3 flex items-center justify-center text-base text-black rounded-r-md border-l group-hover:border-accent'>+</span>
                                    </button>
                                )}

                                {inCart(product?.id) && (
                                    <div className='group flex w-full py-3 bg-accent items-center justify-between text-sm text-white font-semibold rounded-md transition-colors duration-200 relative'>
                                        <button
                                            className='bg-accent h-full w-12 absolute left-0 top-0 flex items-center justify-center text-base text-white border-accent rounded-l-md border-r hover:bg-accent-dark'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                decrement(product as any)
                                            }}
                                        >-</button>
                                        <span className='flex-1 text-center px-12'>{singleQuantity(product?.id)}</span>
                                        <button
                                            className='bg-accent h-full w-12 absolute right-0 top-0 flex items-center justify-center text-base text-white border-accent rounded-r-md border-l hover:bg-accent-dark'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                increment(product as any)
                                            }}
                                        >+</button>
                                    </div>
                                )}

                                {/* Available Stock */}
                                <div className='text-center lg:text-center'>
                                    <span className='text-gray-600 text-base sm:text-lg'>{product?.qtyInStore} available</span>
                                </div>
                            </div>
                        </div>

                        {/* Category */}
                        <div className='py-2'>
                            <span className='text-gray-600 text-sm sm:text-base'>
                                Category: <span className='inline-block p-1 text-xs sm:text-sm border bg-gray-100 font-semibold rounded ml-1'>{product?.category}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className='px-4 pb-6'>
                    <h3 className='text-lg font-semibold mb-3'>Details</h3>
                    <p className='text-gray-600 text-sm sm:text-base leading-relaxed'>{product?.description}</p>
                </div>

                {/* Related products */}
                <div>
                    <h3 className='text-lg font-semibold mb-3'>Related Products</h3>
                    {
                        isLoading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                {
                                    [1, 2, 3, 4, 5, 6].map((item) => (
                                        <div key={item} className="animate-pulse h-[356px] bg-gray-200 rounded-md mb-2"></div>
                                    ))
                                }
                            </div>
                        ) :
                            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-3 mt-1">
                                {data?.products?.map((product: ProductProps) => (
                                    <Suspense>
                                        <Product key={product.id} product={product} onClick={() => {
                                            setModalProduct(product);
                                            setIsOpen(true);
                                        }} />
                                    </Suspense>
                                ))}
                            </div>
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProductDetail