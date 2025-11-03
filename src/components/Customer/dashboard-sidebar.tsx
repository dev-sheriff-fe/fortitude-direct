'use client'
import React from 'react';
import {
  LayoutDashboard,
  Store,
  Sheet,
  Folder,
  Key,
  EyeOff,
  Send,
  ClipboardList,
  Clock,
  PiggyBank,
  LucideCurrency,
  CalendarClockIcon,
  Settings2Icon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';


const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/orders', icon: Clock },
  { name: 'Transactions', href: '/transactions', icon: PiggyBank },
  { name: 'My Credit Score', href: '/credit-score', icon: Sheet },
  { name: 'Send Money', href: '/send-money', icon: Send },
  {name: 'Manage Accounts', href: '/add-bank-account', icon: Settings2Icon},
  { name: 'Store Front', href: '/', icon: Store },
  { name: 'My Documents', href: '/documents', icon: Folder },
  { name: 'BNPL Payment Plan', href: '/payment-plan', icon: CalendarClockIcon },
  { name: 'Reports', href: '/reports', icon: ClipboardList },
  { name: 'API Key', href: '/api-key', icon: Key },
  { name: 'Change Password', href: '/reset-password', icon: EyeOff },
];

export const DashboardSidebar = () => {
  const pathname = usePathname()
  
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL;

  return (
    <div 
    className="w-full bg-accent h-full flex flex-col overflow-y-scroll"
    style={{
      scrollbarWidth: 'none',
      scrollbarColor: 'transparent',
    }}
    >
      <div className="p-4 lg:p-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center bg-white/20 p-2 rounded-md">
            <Image
              src={logoUrl || 'logo.png'}
              alt='logo'
              width={24}
              height={24}
              className='w-full h-auto object-contain'
            />
          </div>
        </div>
      </div>

      {/* Navigaon */}
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
      </nav>
    </div>
  );
};