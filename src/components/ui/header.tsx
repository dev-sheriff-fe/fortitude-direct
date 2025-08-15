"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Search, Menu } from "lucide-react"

export function Header() {
  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-bold text-gray-900">PickBazar</span>
          </div>
          <div className="w-10"></div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between px-6 lg:px-8 py-3">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-white rounded-sm transform rotate-45"></div>
              </div>
              <span className="text-2xl font-bold text-gray-900">PickBazar</span>
            </div>

            {/* Gadget Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium">
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
            </DropdownMenu>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Shops
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Offers
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Contact
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium">
                  Pages
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="p-2">Page options...</div>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-gray-700 hover:text-gray-900">
              <Search className="h-5 w-5" />
            </Button>
            <Button className="bg-accent hover:bg-teal-700 text-white px-6 py-2 rounded-md font-medium">
              Join
            </Button>
            <Button className="bg-accent hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium">
              Become a Seller
            </Button>
          </div>
        </div>
      </header>
    </>
  )
}