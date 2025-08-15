// page.tsx
import CategoriesDesktop from "@/components/gadgets/categories-desktop";
import bannerImg from '@/assets/Gadget-banners.webp'
import Image from "next/image";
import FilterHeader from "@/components/gadgets/filter-header";
import ProductsGrid from "@/components/gadgets/products-grid";

export default async function Home() {
  return (
    <main className="w-full flex-1 flex">
      {/* Categories desktop - Fixed sidebar */}
        <CategoriesDesktop />
      {/* Main content area - Scrollable */}
      <div className="flex-1 w-full ">
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