// page.tsx
'use client'
import CategoriesDesktop from "@/components/gadgets/categories-desktop";
import bannerImg from '@/assets/Gadget-banners.webp'
import Image from "next/image";
import FilterHeader from "@/components/gadgets/filter-header";
import ProductsGrid from "@/components/gadgets/products-grid";
import CartTriggerDesktop from "@/components/ui/cart-trigger-desktop";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";

export default async function Home() {
  const router = useRouter()
  useEffect(()=>{
    router?.push(`?storeCode=STO445`)
  },[])
  return (
    <main className="w-full flex-1 flex">
      {/* Categories desktop - Fixed sidebar */}
        <Suspense>
          <CategoriesDesktop />
        </Suspense>
        <CartTriggerDesktop/>
      {/* Main content area - Scrollable */}
      <div className="flex-1 w-full relative lg:py-4">
        <div className="w-full">
          {/* banner */}
          <div className="relative w-full  lg:p-4">
            <Image
              src={bannerImg}
              alt="Banner"
              className="object-cover w-full"
            />
          </div>

          {/* filter header */}
          <FilterHeader/>
           {/* <ProductGrid/> */}
           <ProductsGrid/>
        </div>
      </div>
    </main>
  );
}