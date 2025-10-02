'use client';
import { useState, useEffect, use } from 'react';
import HeroSlider from "@/components/home/hero-slider";
import TestimonialSlider from "@/components/home/testimonial-slider";
import { ProductCard } from "@/utils/products-card";
import { ProductProps } from '@/types';
// import axiosInstance from "@/utils/fetch-function";
import axiosInstanceNoAuth from '@/utils/fetch-function-auth';
import { useQuery } from "@tanstack/react-query";
import mouse from "@/components/images/mouse.png";
import watch from "@/components/images/watch.png";
import { useRouter, useSearchParams } from "next/navigation";
import Header from '../../../fortitude-app/layout/header';
import Footer from '../../../fortitude-app/layout/footer';
import ProductDetailsModal from '@/utils/product-details';
import { useCategories } from '@/app/hooks/useCategories';
import { all } from 'axios';

export default function HomeFortitude() {

    const [allProducts, setAllProducts] = useState<ProductProps[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<ProductProps[]>([]);
    const [dealsOfTheWeek, setDealsOfTheWeek] = useState<ProductProps[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialCategory = searchParams ? searchParams.get('category') || '' : '';
    const storeCode = searchParams ? searchParams.get('storeCode') || 'STO445' : 'STO445';
    const [selectedProduct, setSelectedProduct] = useState<ProductProps | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || 'FTD';

    const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

    useEffect(() => {
        if (!searchParams?.get('storeCode')) {
            router.push(`?storeCode=STO445`);
        }
    }, [router, searchParams]);

    useEffect(() => {
        if (categoriesData?.categories?.length > 0 && !selectedCategory) {
            const firstCategory = categoriesData.categories[0].name;
            setSelectedCategory(firstCategory);

            // Update URL with the first category
            const params = new URLSearchParams(searchParams?.toString() || '');
            params.set('category', firstCategory);
            router.push(`?${params.toString()}`);
        }
    }, [categoriesData, selectedCategory, searchParams, router]);

    // Fetch all products for deals of the week (random selection)
    const { data: allProductsData, isLoading: allProductsLoading } = useQuery({
        queryKey: ["all-products", storeCode],
        queryFn: () => {
            return axiosInstanceNoAuth.request({
                method: "GET",
                url: '/ecommerce/products/list',
                params: {
                    name: '',
                    storeCode: storeCode,
                    entityCode: entityCode,
                    category: '',
                    tag: '',
                    pageNumber: 1,
                    pageSize: 100
                }
            }).then(response => response.data)
        }
    });

    // Fetch products based on selected category
    const { data, isLoading, error } = useQuery({
        queryKey: ["featured-products", selectedCategory, storeCode],
        queryFn: () => {
            return axiosInstanceNoAuth.request({
                method: "GET",
                url: '/ecommerce/products/list',
                params: {
                    name: '',
                    storeCode: storeCode,
                    entityCode: entityCode,
                    category: selectedCategory,
                    tag: '',
                    pageNumber: 1,
                    pageSize: 100
                }
            }).then(response => response.data)
        },
        enabled: !!selectedCategory
    });

    useEffect(() => {
        if (data?.products) {
            setFeaturedProducts(data.products.slice(0, 20));
        }
    }, [data]);

    useEffect(() => {
        if (allProductsData?.products) {
            setAllProducts(allProductsData.products);
        }
    }, [allProductsData]);

    useEffect(() => {
        if (allProductsData?.products) {
            // Select 4 random products for deals of the week
            const randomProducts = [...allProductsData.products]
                .sort(() => 0.5 - Math.random())
                .slice(0, 4);
            setDealsOfTheWeek(randomProducts);
        }
    }, [allProductsData]);

    const handleCategoryClick = (categoryName: string) => {
        setSelectedCategory(categoryName);

        const params = new URLSearchParams(searchParams?.toString() || '');
        params.set('category', categoryName);
        router.push(`?${params.toString()}`);
    };

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

    if (isLoading || allProductsLoading || categoriesLoading) {
        return (
            <><Header /><div className="container mx-auto py-12 px-4 mt-10">
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
            </div><Footer /></>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="container mx-auto py-12 px-4 mt-10 text-center">
                    <p className="text-red-500">Error loading products. Please try again later.</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="container mx-auto py-12 px-4">
                <div className="mb-8 py-5 border-b border-[#e7eaee] flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Deals of the Week</h1>
                    <span className="font-semibold text-[#d8480b]">View All →</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dealsOfTheWeek.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onClick={() => {
                                setSelectedProduct(product);
                                setIsModalOpen(true);
                            }}
                        />
                    ))}
                </div>
            </div>




            <div className="container mx-auto py-8 px-4 mt-12">
                <div className="mb-8 py-5 border-b border-[#e7eaee] flex justify-between items-center">
                    <div className="font-semibold text-xs md:text-lg flex items-center gap-2 md:gap-4 text-[#5c728e] overflow-x-auto">
                        {categoriesData?.categories?.map((category: any) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.name)}
                                className={`whitespace-nowrap px-3 py-2 rounded-lg ${selectedCategory === category.name
                                    ? 'bg-[#d8480b] text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                    <span className="font-semibold text-xs md:text-lg text-[#d8480b]">View All →</span>
                </div>

                <CategoryFilterIndicator />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-30">
                    {featuredProducts.length > 0 ? (
                        featuredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={() => {
                                    setSelectedProduct(product);
                                    setIsModalOpen(true);
                                }}
                            />
                        ))
                    ) : (
                        <div className="col-span-4 text-center py-10">
                            <p className="text-gray-500">No products found in this category.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="container mx-auto py-8 px-4 mb-12">
                <div className="mb-8 py-5 border-b border-[#e7eaee] flex justify-between items-center">
                    <div className="font-semibold text-xs md:text-lg flex items-center md:gap-4 text-[#5c728e]">
                        <span>New Arrivals</span>
                        <span>Ongoing Offers</span>
                        <span>Featured Products</span>
                        <span>Best Sellers</span>
                    </div>
                    <span className="font-semibold text-xs md:text-lg text-[#d8480b]">View All →</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-30">
                    {allProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onClick={() => {
                                setSelectedProduct(product);
                                setIsModalOpen(true);
                            }}
                        />
                    ))}
                </div>
            </div>
            <Footer />

            <ProductDetailsModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                product={selectedProduct}
            />
        </>
    );
} 