
'use client';

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown, Search, PhoneCall, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import logo from "@/components/images/LogoOrange.png"
import { useCategories } from '@/app/hooks/useCategories'
import { useSearchParams, useRouter } from 'next/navigation'
import { CartIconWithBadge } from '@/utils/cart-with-badge'
import CartTriggerDesktop from '@/utils/cart-trigger'
import CustomerLoginModal from "../../src/components/ui/customer-login-modal";

const mainNavItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "About Us",
    href: "/about",
  },
  {
    title: "Shop",
    href: "/shop",
  },
  {
    title: "Blogs",
    href: "/blogs",
  },
  {
    title: "Contact",
    href: "/contact",
  },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading, error } = useCategories()
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedCategory = searchParams ? searchParams.get('category') || '' : ''
  const storeCode = searchParams ? searchParams.get('storeCode') || '' : ''

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    if (isMenuOpen) {
      setActiveSubmenu(null)
    }
  }

  const toggleSubmenu = (title: string) => {
    setActiveSubmenu(activeSubmenu === title ? null : title)
  }

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen)
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  const handleCategorySelect = (categoryName: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('category', categoryName)
    if (storeCode) {
      params.set('storeCode', storeCode)
    }
    router.push(`?${params.toString()}`)
    setIsCategoriesOpen(false)
    setIsMenuOpen(false)
  }

  return (
    <><header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white shadow-md" : "bg-white"
      )}
    >
      {/* Top announcement bar */}
      <div className="flex items-center justify-between bg-[#313133] text-white px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="flex items-center space-x-2">
              <svg width="24" height="14" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.375 8.196V10.263C23.375 10.7778 22.9564 11.1964 22.4416 11.1964H21.4432C21.2638 9.9562 20.1952 9.0046 18.9056 9.0046C17.6212 9.0046 16.5526 9.9562 16.3706 11.1964H7.879C7.6996 9.9562 6.631 9.0046 5.344 9.0046C4.057 9.0046 2.991 9.9562 2.809 11.1964H1.561C1.0462 11.1964 0.6276 10.7778 0.6276 10.263V8.196H23.375ZM7.0574 3.20395H6.5244L6.3294 4.2128H6.8468C7.1926 4.2128 7.4786 3.97615 7.4786 3.58095C7.4812 3.34175 7.3226 3.20395 7.0574 3.20395ZM20.8426 11.5682C20.8426 12.6368 19.9742 13.5052 18.9056 13.5052C17.8344 13.5052 16.966 12.6368 16.966 11.5682C16.966 10.497 17.8344 9.6286 18.9056 9.6286C19.9742 9.6286 20.8426 10.497 20.8426 11.5682ZM19.8754 11.5682C19.8754 11.0326 19.4386 10.601 18.9082 10.601C18.3726 10.601 17.941 11.0326 17.941 11.5682C17.941 12.1012 18.3726 12.5354 18.9082 12.5354C19.4386 12.5354 19.8754 12.0986 19.8754 11.5682ZM7.281 11.5682C7.281 12.6368 6.4152 13.5052 5.344 13.5052C4.2728 13.5052 3.407 12.6368 3.407 11.5682C3.407 10.497 4.2728 9.6286 5.344 9.6286C6.4152 9.6286 7.281 10.497 7.281 11.5682ZM6.3138 11.5682C6.3138 11.0326 5.8822 10.601 5.3466 10.601C4.811 10.601 4.3794 11.0326 4.3794 11.5682C4.3794 12.1012 4.811 12.5354 5.3466 12.5354C5.8822 12.5354 6.3138 12.0986 6.3138 11.5682ZM23.375 7.6786H0.625V1.42815C0.625 0.910751 1.0462 0.494751 1.5584 0.494751H15.6738C16.1912 0.494751 16.6072 0.913351 16.6072 1.42815V2.12235H18.461C18.7886 2.12235 19.1032 2.25235 19.3346 2.48375L23.0058 6.1134C23.2398 6.3474 23.3724 6.6646 23.3724 6.9974L23.375 7.6786ZM3.94 4.1192L4.1116 3.20395H5.3856L5.4818 2.69955H3.6306L3.004 5.9288H3.5864L3.8412 4.6236H4.915L5.0112 4.1192H3.94ZM7.346 4.569V4.5612C7.8322 4.4026 8.0818 3.92415 8.0818 3.48475C8.0818 3.15195 7.918 2.90235 7.645 2.78535C7.5124 2.72555 7.3538 2.70475 7.1822 2.70475H6.0408L5.4142 5.9314H5.9992L6.2306 4.7276H6.813L7.2212 5.9314H7.8478L7.4162 4.7354C7.3772 4.6158 7.346 4.569 7.346 4.569ZM10.9262 2.69955H8.9996L8.3678 5.9288H10.3724L10.4686 5.4244H9.0516L9.218 4.556H10.3048L10.4036 4.0516H9.3168L9.4806 3.20655H10.8274L10.9262 2.69955ZM13.5314 2.69955H11.6048L10.973 5.9288H12.9776L13.0738 5.4244H11.6568L11.8258 4.556H12.9126L13.0114 4.0516H11.922L12.0858 3.20655H13.43L13.5314 2.69955ZM21.5056 5.9834L18.6326 3.24035C18.604 3.21435 18.5676 3.19875 18.5312 3.19875H17.8552C17.7746 3.19875 17.7096 3.26375 17.7096 3.34435V6.0874C17.7096 6.168 17.7746 6.233 17.8552 6.233H21.4068C21.5368 6.2356 21.6018 6.0718 21.5056 5.9834Z" fill="white" />
              </svg>
              <p className="text-sm md:text-base">Free shipping on orders £100+</p>
            </div>
            <div className="hidden md:block">|</div>
            <div className="hidden md:block">
              <p className="text-sm">
                Fortitude IoT is one of the largest brand. <span className="underline font-medium">Show all products</span>
              </p>
            </div>
          </div>

          <Link href='/privacy' className="text-sm md:text-base hover:underline">
            <div className="text-sm md:text-base">
              Privacy Policy
            </div>
          </Link>

        </div>
      </div>

      {/* Main header content */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <Image
              src={logo}
              alt="Fortitude Logo"
              width={150}
              height={50}
              className="h-12 w-auto"
              priority />
          </Link>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="What are you looking for?"
                className="w-full md:w-[500px] lg:w-[700px] py-3 md:py-4 pl-12 pr-4 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#d8480b]" />
              <div className="absolute inset-y-0 right-0 flex items-center p-4 pointer-events-none bg-[#d8480b] rounded-r-full">
                <Search className="h-5 w-10 text-white" />
              </div>
            </div>
          </div>

          {/* Account and cart icons */}
          <div className="flex items-center space-x-4 md:space-x-8">
            <div className="hidden md:flex items-center space-x-2">
              <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.79 12.4048C13.9767 12.4048 15.1367 12.0557 16.1234 11.4016C17.1101 10.7476 17.8792 9.81792 18.3333 8.73026C18.7874 7.64261 18.9062 6.44578 18.6747 5.29113C18.4432 4.13648 17.8718 3.07587 17.0326 2.24341C16.1935 1.41096 15.1244 0.84405 13.9605 0.614376C12.7967 0.384702 11.5903 0.502579 10.4939 0.953101C9.39758 1.40362 8.46051 2.16655 7.80122 3.14542C7.14193 4.12428 6.79004 5.27511 6.79004 6.45238C6.79163 8.03057 7.42428 9.54367 8.54915 10.6596C9.67403 11.7756 11.1992 12.4032 12.79 12.4048ZM12.79 2.48413C13.5811 2.48413 14.3545 2.71686 15.0123 3.1529C15.6701 3.58894 16.1828 4.2087 16.4855 4.9338C16.7883 5.6589 16.8675 6.45679 16.7131 7.22655C16.5588 7.99632 16.1778 8.70339 15.6184 9.25836C15.059 9.81333 14.3463 10.1913 13.5704 10.3444C12.7944 10.4975 11.9902 10.4189 11.2593 10.1186C10.5284 9.81822 9.90369 9.3096 9.46416 8.65703C9.02464 8.00445 8.79004 7.23723 8.79004 6.45238C8.79004 5.39994 9.21147 4.3906 9.96161 3.6464C10.7118 2.90221 11.7291 2.48413 12.79 2.48413Z" fill="#313133" />
                <path d="M12.79 14.3889C10.4039 14.3915 8.11626 15.3331 6.429 17.0069C4.74175 18.6808 3.79269 20.9503 3.79004 23.3175C3.79004 23.5806 3.8954 23.8329 4.08293 24.019C4.27047 24.205 4.52482 24.3096 4.79004 24.3096C5.05526 24.3096 5.30961 24.205 5.49715 24.019C5.68468 23.8329 5.79004 23.5806 5.79004 23.3175C5.79004 21.4757 6.52754 19.7094 7.84029 18.407C9.15305 17.1047 10.9335 16.373 12.79 16.373C14.6465 16.373 16.427 17.1047 17.7397 18.407C19.0525 19.7094 19.79 21.4757 19.79 23.3175C19.79 23.5806 19.8954 23.8329 20.0829 24.019C20.2704 24.205 20.5248 24.3096 20.79 24.3096C21.0552 24.3096 21.3096 24.205 21.4971 24.019C21.6846 23.8329 21.79 23.5806 21.79 23.3175C21.7874 20.9503 20.8383 18.6808 19.151 17.0069C17.4638 15.3331 15.1761 14.3915 12.79 14.3889Z" fill="#313133" />
              </svg>
              <div className="flex flex-col items-start">
                <span
                  className="text-sm pointer cursor-pointer font-medium underline"
                  onClick={() => setIsOpen(true)}
                >
                  Login
                </span>
                <span className="text-sm font-medium">Account</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Cart icon that triggers the sheet */}
              <div onClick={toggleCart} className="cursor-pointer">
                <CartIconWithBadge onClick={toggleCart} />
              </div>

              {/* The actual sheet component */}
              <CartTriggerDesktop
                isOpen={isCartOpen}
                onOpenChange={setIsCartOpen} />

              <div className="hidden md:block">
                <span className="text-sm">Your cart</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <CartTriggerDesktop />
              <div className="hidden md:block">
                {/* <span className="text-sm">Your cart</span> */}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-charcoal z-20"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Secondary navigation bar */}
      <div className="container mx-auto px-6 py-4 border-t border-[#f2f4f7] border-b">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Categories dropdown */}
          <div className="relative">
            <button
              onClick={toggleCategories}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.1667 8.33335H15.8334C17.5 8.33335 18.3334 7.50002 18.3334 5.83335V4.16669C18.3334 2.50002 17.5 1.66669 15.8334 1.66669H14.1667C12.5 1.66669 11.6667 2.50002 11.6667 4.16669V5.83335C11.6667 7.50002 12.5 8.33335 14.1667 8.33335Z" stroke="#313133" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.16669 18.3334H5.83335C7.50002 18.3334 8.33335 17.5 8.33335 15.8334V14.1667C8.33335 12.5 7.50002 11.6667 5.83335 11.6667H4.16669C2.50002 11.6667 1.66669 12.5 1.66669 14.1667V15.8334C1.66669 17.5 2.50002 18.3334 4.16669 18.3334Z" stroke="#313133" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5.00002 8.33335C6.84097 8.33335 8.33335 6.84097 8.33335 5.00002C8.33335 3.15907 6.84097 1.66669 5.00002 1.66669C3.15907 1.66669 1.66669 3.15907 1.66669 5.00002C1.66669 6.84097 3.15907 8.33335 5.00002 8.33335Z" stroke="#313133" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 18.3334C16.841 18.3334 18.3334 16.841 18.3334 15C18.3334 13.1591 16.841 11.6667 15 11.6667C13.1591 11.6667 11.6667 13.1591 11.6667 15C11.6667 16.841 13.1591 18.3334 15 18.3334Z" stroke="#313133" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="font-medium">BROWSE ALL CATEGORIES</p>
              <ChevronDown className={`h-4 w-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Categories dropdown content */}
            {isCategoriesOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                {isLoading && (
                  <div className="p-4 text-center text-gray-500">Loading categories...</div>
                )}

                {error && (
                  <div className="p-4 text-center text-red-500">Error loading categories</div>
                )}

                {data?.categories && (
                  <ul className="py-2 max-h-80 overflow-y-auto">
                    {data.categories.map((category: { id: string; name: string; logo?: string; }) => (
                      <li key={category.id} className="hover:bg-gray-100">
                        <button
                          onClick={() => handleCategorySelect(category.name)}
                          className={`flex items-center gap-x-3 px-4 py-3 w-full text-left ${selectedCategory === category.name ? 'bg-gray-100 font-semibold' : ''}`}
                        >
                          {category.logo && (
                            <div className="w-5 h-5 relative flex-shrink-0">
                              <Image
                                src={category.logo}
                                alt={category.name || 'Category'}
                                fill
                                className="object-contain" />
                            </div>
                          )}
                          <span className="text-sm">{category.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="hidden md:block">|</div>

          {/* Main navigation - hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {mainNavItems.map((item) => (
              <div key={item.title} className="relative group">
                <Link
                  href={item.href}
                  className="text-charcoal hover:text-[#d8480b] font-medium flex items-center transition-colors duration-200"
                >
                  {item.title}
                  {/* {item.submenu && <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />} */}
                </Link>
              </div>
            ))}
          </nav>

          <div className="hidden md:block">|</div>

          {/* Contact info - hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <div className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-[#d8480b]" />
              <p className="text-sm">
                Call: (123) 123-4567
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#d8480b]" />
              <p className="text-sm">
                Email: example@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-10 md:hidden overflow-y-auto transition-transform duration-300 ease-in-out pt-32 px-6",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Mobile search bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d8480b]" />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        <div className="mb-6 border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium mb-3">Categories</h3>
          {isLoading && <div className="text-gray-500">Loading categories...</div>}
          {error && <div className="text-red-500">Error loading categories</div>}
          {data?.categories && (
            <ul className="space-y-2">
              {data.categories.map((category: { id: string; name: string; logo?: string; }) => (
                <li key={category.id}>
                  <button
                    onClick={() => handleCategorySelect(category.name)}
                    className={`flex items-center gap-x-3 py-2 w-full text-left ${selectedCategory === category.name ? 'font-semibold text-[#d8480b]' : ''}`}
                  >
                    {category.logo && (
                      <div className="w-5 h-5 relative flex-shrink-0">
                        <Image
                          src={category.logo}
                          alt={category.name || 'Category'}
                          fill
                          className="object-contain" />
                      </div>
                    )}
                    <span>{category.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mobile navigation */}
        <nav className="flex flex-col space-y-4">
          {mainNavItems.map((item) => (
            <div key={item.title} className="border-b border-gray-200 pb-4">
              <Link
                href={item.href}
                className="block text-lg font-medium text-charcoal hover:text-[#d8480b]"
                onClick={toggleMenu}
              >
                {item.title}
              </Link>
            </div>
          ))}
        </nav>

        {/* Mobile account actions */}
        <div className="mt-8 flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              className="w-full flex items-center gap-2"
              onClick={toggleMenu}
            >
              <svg width="20" height="20" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.79 12.4048C13.9767 12.4048 15.1367 12.0557 16.1234 11.4016C17.1101 10.7476 17.8792 9.81792 18.3333 8.73026C18.7874 7.64261 18.9062 6.44578 18.6747 5.29113C18.4432 4.13648 17.8718 3.07587 17.0326 2.24341C16.1935 1.41096 15.1244 0.84405 13.9605 0.614376C12.7967 0.384702 11.5903 0.502579 10.4939 0.953101C9.39758 1.40362 8.46051 2.16655 7.80122 3.14542C7.14193 4.12428 6.79004 5.27511 6.79004 6.45238C6.79163 8.03057 7.42428 9.54367 8.54915 10.6596C9.67403 11.7756 11.1992 12.4032 12.79 12.4048ZM12.79 2.48413C13.5811 2.48413 14.3545 2.71686 15.0123 3.1529C15.6701 3.58894 16.1828 4.2087 16.4855 4.9338C16.7883 5.6589 16.8675 6.45679 16.7131 7.22655C16.5588 7.99632 16.1778 8.70339 15.6184 9.25836C15.059 9.81333 14.3463 10.1913 13.5704 10.3444C12.7944 10.4975 11.9902 10.4189 11.2593 10.1186C10.5284 9.81822 9.90369 9.3096 9.46416 8.65703C9.02464 8.00445 8.79004 7.23723 8.79004 6.45238C8.79004 5.39994 9.21147 4.3906 9.96161 3.6464C10.7118 2.90221 11.7291 2.48413 12.79 2.48413Z" fill="#313133" />
                <path d="M12.79 14.3889C10.4039 14.3915 8.11626 15.3331 6.429 17.0069C4.74175 18.6808 3.79269 20.9503 3.79004 23.3175C3.79004 23.5806 3.8954 23.8329 4.08293 24.019C4.27047 24.205 4.52482 24.3096 4.79004 24.3096C5.05526 24.3096 5.30961 24.205 5.49715 24.019C5.68468 23.8329 5.79004 23.5806 5.79004 23.3175C5.79004 21.4757 6.52754 19.7094 7.84029 18.407C9.15305 17.1047 10.9335 16.373 12.79 16.373C14.6465 16.373 16.427 17.1047 17.7397 18.407C19.0525 19.7094 19.79 21.4757 19.79 23.3175C19.79 23.5806 19.8954 23.8329 20.0829 24.019C20.2704 24.205 20.5248 24.3096 20.79 24.3096C21.0552 24.3096 21.3096 24.205 21.4971 24.019C21.6846 23.8329 21.79 23.5806 21.79 23.3175C21.7874 20.9503 20.8383 18.6808 19.151 17.0069C17.4638 15.3331 15.1761 14.3915 12.79 14.3889Z" fill="#313133" />
              </svg>
              Account
            </button>
            <button
              className="w-full flex items-center gap-2"
              onClick={() => {
                toggleMenu();
                toggleCart();
              }}
            >
              <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.7901 6.15253H18.7901C18.7901 4.56123 18.158 3.03511 17.0327 1.90989C15.9075 0.784668 14.3814 0.152527 12.7901 0.152527C11.1988 0.152527 9.67265 0.784668 8.54743 1.90989C7.42221 3.03511 6.79007 4.56123 6.79007 6.15253H3.79007C2.99442 6.15253 2.23136 6.4686 1.66875 7.03121C1.10614 7.59382 0.79007 8.35688 0.79007 9.15253V19.1525C0.791657 20.4781 1.31895 21.7489 2.25629 22.6863C3.19363 23.6236 4.46448 24.1509 5.79007 24.1525H19.7901C21.1157 24.1509 22.3865 23.6236 23.3239 22.6863C24.2612 21.7489 24.7885 20.4781 24.7901 19.1525V9.15253C24.7901 8.35688 24.474 7.59382 23.9114 7.03121C23.3488 6.4686 22.5857 6.15253 21.7901 6.15253ZM12.7901 2.15253C13.851 2.15253 14.8684 2.57396 15.6185 3.3241C16.3687 4.07425 16.7901 5.09166 16.7901 6.15253H8.79007C8.79007 5.09166 9.2115 4.07425 9.96164 3.3241C10.7118 2.57396 11.7292 2.15253 12.7901 2.15253ZM22.7901 19.1525C22.7901 19.9481 22.474 20.7112 21.9114 21.2738C21.3488 21.8364 20.5857 22.1525 19.7901 22.1525H5.79007C4.99442 22.1525 4.23136 21.8364 3.66875 21.2738C3.10614 20.7112 2.79007 19.9481 2.79007 19.1525V9.15253C2.79007 8.88731 2.89543 8.63296 3.08296 8.44542C3.2705 8.25789 3.52485 8.15253 3.79007 8.15253H6.79007V10.1525C6.79007 10.4177 6.89543 10.6721 7.08296 10.8596C7.2705 11.0471 7.52485 11.1525 7.79007 11.1525C8.05529 11.1525 8.30964 11.0471 8.49718 10.8596C8.68471 10.6721 8.79007 10.4177 8.79007 10.1525V8.15253H16.7901V10.1525C16.7901 10.4177 16.8955 10.6721 17.083 10.8596C17.2705 11.0471 17.5249 11.1525 17.7901 11.1525C18.0553 11.1525 18.3097 11.0471 18.4972 10.8596C18.6847 10.6721 18.7901 10.4177 18.7901 10.1525V8.15253H21.7901C22.0553 8.15253 22.3097 8.25789 22.4972 8.44542C22.6847 8.63296 22.7901 8.88731 22.7901 9.15253V19.1525Z" fill="#313133" />
              </svg>
              Cart
            </button>
          </div>

          {/* Mobile contact info */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-[#d8480b]" />
              <p className="text-sm">
                Call: (123) 123-4567
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#d8480b]" />
              <p className="text-sm">
                Email: example@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <CartTriggerDesktop />
          </div>
        </div>
      )}
    </header>
      <CustomerLoginModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>

  )
}