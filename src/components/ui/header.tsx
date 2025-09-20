"use client"

import { Suspense, useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Search, Menu, X, User, LogIn } from "lucide-react"
import { Input } from "./input"
import SearchInput from "./search-input"
import Image from "next/image"
import h2p_logo from '@/assets/farham_logo.png'
import Link from "next/link"
import CustomerLoginModal from "./customer-login-modal"

import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { getAuthCredentials, logout } from "@/utils/auth-utils-customer"
import useCustomer from "@/store/customerStore"

export function Header() {
  const [openSearch,setOpenSearch] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { token, permissions } = getAuthCredentials();
  const isUserAuthenticated = !!token && Array.isArray(permissions) && permissions.length > 0;
  
  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 relative rounded-lg flex items-center justify-center">
                <Image
                src={h2p_logo}
                alt="H2P Logo"
                fill
                className="object-cover"
                />
              </div>
            
          </div>
          <div className="">
            {
              isUserAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                      <Avatar className="w-8 h-8 lg:w-10 lg:h-10">
                          <AvatarImage src="/lovable-uploads/02ad6048-41c8-4298-9103-f9760c690183.png" />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                          <User className="w-4 h-4 lg:w-5 lg:h-5" />
                          </AvatarFallback>
                      </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Link href={`/dashboard`} target="_blank">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={()=>logout()}>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ):

              (
                <>
                <Button 
                className="bg-accent hover:bg-accent-foreground text-white p-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Link href={`/customer-onboarding`} target="_blank">
                  <LogIn className="w-5 h-5" />
                </Link>
              </Button>
                </>
              )
            }
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between px-6 lg:px-8 py-3">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 relative rounded-lg flex items-center justify-center">
                <Image
                src={h2p_logo}
                alt="H2P Logo"
                fill
                />
              </div>
            </div>

            {/* Gadget Dropdown */}
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2  font-medium">
                  <div className="w-5 h-5 rounded-full border-2 border-accent flex items-center justify-center">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                  </div>
                  Gadget
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="p-2">Gadgets</div>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Shops
            </a>
            <Link href="/apply-bnpl" className="text-gray-700 hover:text-gray-900 font-medium">
              BNPL
            </Link>

             <Link href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Offers
            </Link>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Contact
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-gray-700 hover:text-gray-900" onClick={() => setOpenSearch(true)}>
              <Search className="h-5 w-5" />
            </Button>
            <Link href={`/admin-login`} target="_blank">
              <Button className="bg-accent hover:bg-accent-foreground text-white px-4 py-2 rounded-md font-medium">
              Become a Seller
            </Button>
            </Link>
            {
              isUserAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                      <Avatar className="w-8 h-8 lg:w-10 lg:h-10">
                          <AvatarImage src="/lovable-uploads/02ad6048-41c8-4298-9103-f9760c690183.png" />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                          <User className="w-4 h-4 lg:w-5 lg:h-5" />
                          </AvatarFallback>
                      </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Link href={`/dashboard`} target="_blank">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={()=>logout()}>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ):

              (
                <>
                <Button 
                  className="bg-accent hover:bg-accent-foreground text-white px-6 py-2 rounded-md font-medium"
                  >
                    <Link href={`/customer-onboarding`} target="_blank">
                      Join
                    </Link>
                  </Button>
                </>
              )
            }
          </div>
        </div>
        {/* Mobile Search Input */}
        {
          openSearch && <Suspense>
            <SearchInput
            onClose={() => setOpenSearch(false)}
          />
          </Suspense>
        }
      </header>
      <CustomerLoginModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}

