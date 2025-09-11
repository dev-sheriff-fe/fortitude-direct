'use client';
import { useState, useEffect } from 'react';
import HeroSlider from "@/components/home/hero-slider";
import TestimonialSlider from "@/components/home/testimonial-slider";
import { ProductCard } from "@/utils/products-card";
import { ProductProps } from '@/types';
import axiosInstance from "@/utils/fetch-function";
import { useQuery } from "@tanstack/react-query";
import mouse from "@/components/images/mouse.png";
import watch from "@/components/images/watch.png";
import { useRouter, useSearchParams } from "next/navigation";
import Header from '../../../fortitude-app/layout/header';
import Footer from '../../../fortitude-app/layout/footer';


export default function HomeFortitude() {
    const [featuredProducts, setFeaturedProducts] = useState<ProductProps[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedCategory = searchParams ? searchParams.get('category') || '' : '';
    const storeCode = searchParams ? searchParams.get('storeCode') || 'STO445' : 'STO445';

    useEffect(() => {
        if (!searchParams?.get('storeCode')) {
            router.push(`?storeCode=STO445`);
        }
    }, [router, searchParams]);

    const { data, isLoading, error } = useQuery({
        queryKey: ["featured-products", selectedCategory, storeCode],
        queryFn: () => {
            return axiosInstance.request({
                method: "GET",
                url: '/ecommerce/products/list',
                params: {
                    name: '',
                    storeCode: storeCode,
                    entityCode: 'H2P',
                    category: selectedCategory,
                    tag: '',
                    pageNumber: 1,
                    pageSize: 100
                }
            }).then(response => response.data)
        }
    });

    useEffect(() => {
        if (data?.products) {
            setFeaturedProducts(data.products.slice(0, 20));
        }
    }, [data]);

    const CategoryFilterIndicator = () => {
        if (!selectedCategory) return null;

        return (
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Filtered by:</span>
                    <span className="px-3 py-1 bg-[#d8480b] text-white text-sm rounded-full">
                        {selectedCategory}
                    </span>
                    <button
                        onClick={() => {
                            const params = new URLSearchParams(searchParams?.toString() || '');
                            params.delete('category');
                            router.push(`?${params.toString()}`);
                        }}
                        className="text-sm text-gray-500 hover:text-[#d8480b] ml-2"
                    >
                        Clear filter
                    </button>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-12 px-4 mt-50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 animate-pulse">
                            <div className="h-6 w-16 bg-gray-200 rounded-full mb-4"></div>
                            <div className="w-full h-48 bg-gray-200 mb-4 rounded-md"></div>
                            <div className="h-6 bg-gray-200 mb-2 rounded"></div>
                            <div className="h-6 bg-gray-200 mb-4 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded-3xl"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-12 px-4 mt-50 text-center">
                <p className="text-red-500">Error loading products. Please try again later.</p>
            </div>
        );
    }

    return (
        <>
        <Header/>
            <div className="container mx-auto py-12 px-4 mt-50">
                <div className="mb-8 py-5 border-b border-[#e7eaee] flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Deals of the Week</h1>
                    <span className="font-semibold text-[#d8480b]">View All →</span>
                </div>

                <CategoryFilterIndicator />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredProducts.slice(0, 4).map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onClick={() => {
                                console.log('Product clicked:', product);
                            }}
                        />
                    ))}
                </div>
            </div>


            <div className="container mx-auto py-12 px-4 mt-12">
                <div className="mb-8 py-5 border-b border-[#e7eaee] flex justify-between items-center">
                    <div className="font-semibold text-xs md:text-lg flex items-center md:gap-4 text-[#5c728e]">
                        <span>New Arrivals</span>
                        <span>Ongoing Offers</span>
                        <span>Featured Products</span>
                        <span>Best Sellers</span>
                    </div>
                    <span className="font-semibold text-xs md:text-lg text-[#d8480b]">View All →</span>
                </div>

                <CategoryFilterIndicator />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-30">
                    {featuredProducts.slice(4, 25).map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onClick={() => {
                                console.log('Product clicked:', product);
                            }}
                        />
                    ))}
                </div>
            </div>
            <Footer/>
        </>
    );
} 