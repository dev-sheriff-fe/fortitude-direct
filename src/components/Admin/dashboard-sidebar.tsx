'use client'
import React from 'react';
import { 
  LayoutDashboard, 
  Send, 
  Wallet, 
  History, 
  Users, 
  TrendingUp, 
  UserCog, 
  CreditCard, 
  Settings,
  FileText,
  Star,
  Box,
  Bus,
  ClipboardList,
  StoreIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import logo from '@/assets/farham_logo.png'
import Image from 'next/image';
import useUser from '@/store/userStore';

const navigationItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Inventories', href: '/inventories', icon: Box },
  { name: 'Orders', href: '/orders', icon: Bus },
  { name: 'Report', href: '/report', icon: ClipboardList },
];

export const DashboardSidebar = () => {
    const pathname = usePathname()
    const {user} = useUser()
  return (
    <div className="w-64 bg-accent/90 h-full flex flex-col">
      {/* Logo */}
      <div className="p-4 lg:p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 lg:w-6 lg:h-6 rounded-lg flex items-center justify-center">
            <Image
            src={logo}
            alt='logo'
            className='w-full h-auto object-contain'
            />
          </div>
          <span className="text-white font-semibold text-base lg:text-lg">Help2Pay</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 lg:py-6 px-3 lg:px-4">
        <ul className="space-y-1 lg:space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={
                  cn(
                    'flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm lg:text-base',
                    pathname === item?.href && 'bg-white text-accent shadow-sm'
                  )
                }
              >
                <item.icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                <span className="font-medium truncate">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
                href={`/?storeCode=${user?.storeCode}`}
                className={
                  cn(
                    'flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm lg:text-base',
                  )
                }

                target='_blank'
              >
                <StoreIcon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                <span className="font-medium truncate">My store</span>
              </Link>
      </nav>

      {/* KYC Document */}
      {/* <div className="p-3 lg:p-4 mx-3 lg:mx-4 mb-4 lg:mb-6 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-start gap-2 lg:gap-3">
          <div className="flex items-center gap-1 flex-shrink-0">
            <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-warning" />
            <Star className="w-3 h-3 lg:w-4 lg:h-4 text-warning" />
          </div>
          <div className="min-w-0">
            <h4 className="text-white font-medium text-xs lg:text-sm">KYC Document</h4>
            <p className="text-white/60 text-xs mt-1 leading-relaxed">
              Complete your KYC process to unlock full payment processing features.
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
};