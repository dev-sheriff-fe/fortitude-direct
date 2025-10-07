'use client'
import React from 'react';
import {
  LayoutDashboard,
  Box,
  StoreIcon,
  UsersRoundIcon,
  Clock,
  Settings,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import useUser from '@/store/userStore';

const navigationItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Inventories', href: '/admin/inventories', icon: Box },
  { name: 'BNPL Customers', href: '/admin/bnpl-customers', icon: UsersRoundIcon },
  { name: 'Payment Methods', href: '/admin/payment-methods', icon: CreditCard },
  { name: 'Orders', href: '/admin/orders', icon: Clock },
  { name: 'Stores', href: '/admin/stores', icon: StoreIcon },
  { name: 'Staffs', href: '/admin/staffs', icon: UsersRoundIcon },
  { name: 'Reports', href: '/admin/reports', icon: LayoutDashboard },
  { name: 'Store Settings', href: '/admin/settings', icon: Settings },
];

export const DashboardSidebar = () => {
  const pathname = usePathname()
  const { user } = useUser()

  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL;

  return (
    <div className="w-full bg-accent h-full flex flex-col">
      <div className="p-4 lg:p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center bg-white/20 p-2 rounded-md">
            <Image
              src={logoUrl || 'logo.png'}
              alt='logo'
              width={24}
              height={24}
              className='w-full max-w-[150px] h-auto object-contain'
            />
          </div>
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
    </div>
  );
};