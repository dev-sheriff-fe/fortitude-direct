'use client'
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Headphones, 
  CreditCard,
  DollarSign,
  PiggyBank,
  Wallet,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  Target,
  ShoppingCart,
  Banknote,
  CircleDollarSign
} from 'lucide-react';
import { CreditCard as CreditCardComponent } from './CreditCard';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import { getCurrentDate } from '@/utils/helperfns';
import useUser from '@/store/userStore';

const currencyWallets = [
  {
    currency: 'GBP',
    amount: '£103,101.86',
    flag: '🇬🇧',
    change: '+2.5%',
    variant: 'primary' as const
  },
  {
    currency: 'USD',
    amount: '$103,101.86',
    flag: '🇺🇸',
    change: '+1.8%',
    variant: 'secondary' as const
  },
  {
    currency: 'NGN',
    amount: '₦103,101.86',
    flag: '🇳🇬',
    change: '+3.2%',
    variant: 'accent' as const
  },
  {
    currency: 'CNY',
    amount: '¥103,101.86',
    flag: '🇨🇳',
    change: '-0.5%',
    variant: 'success' as const
  }
];

const walletData = [
  {
    title: 'Fiat Balance',
    amount: '$1,864,000',
    change: '+12% this week',
    icon: CreditCard,
    color: 'bg-blue-500'
  },
  {
    title: 'Total Transactions',
    amount: '1,864,000',
    change: '+8% this week',
    icon: TrendingUp,
    color: 'bg-green-500'
  },
  {
    title: 'Active Users',
    amount: '1,864,000',
    change: '+15% this week',
    icon: Users,
    color: 'bg-purple-500'
  },
  {
    title: 'Support Tickets',
    amount: '1,864,000',
    change: '-5% this week',
    icon: Headphones,
    color: 'bg-red-500'
  }
];

// Icon and color mapping function
const getIconAndColor = (title: string, index: number) => {
  const titleLower = title.toLowerCase();
  
  // Define mapping based on common financial terms
  const mappings = [
    {
      keywords: ['revenue', 'income', 'earnings', 'sales', 'turnover'],
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      keywords: ['users', 'customers', 'clients', 'members', 'subscribers'],
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      keywords: ['support', 'tickets', 'help', 'service', 'assistance'],
      icon: Headphones,
      color: 'bg-purple-500'
    },
    {
      keywords: ['transactions', 'payments', 'transfers', 'orders'],
      icon: CreditCard,
      color: 'bg-indigo-500'
    },
    {
      keywords: ['profit', 'margin', 'gain', 'surplus'],
      icon: DollarSign,
      color: 'bg-emerald-500'
    },
    {
      keywords: ['savings', 'deposits', 'reserves'],
      icon: PiggyBank,
      color: 'bg-cyan-500'
    },
    {
      keywords: ['wallet', 'balance', 'funds', 'account'],
      icon: Wallet,
      color: 'bg-orange-500'
    },
    {
      keywords: ['expenses', 'costs', 'spending', 'outgoing'],
      icon: TrendingDown,
      color: 'bg-red-500'
    },
    {
      keywords: ['growth', 'increase', 'rise'],
      icon: ArrowUpRight,
      color: 'bg-teal-500'
    },
    {
      keywords: ['decline', 'decrease', 'fall', 'drop'],
      icon: ArrowDownRight,
      color: 'bg-rose-500'
    },
    {
      keywords: ['activity', 'volume', 'frequency'],
      icon: Activity,
      color: 'bg-violet-500'
    },
    {
      keywords: ['analytics', 'metrics', 'stats', 'data'],
      icon: BarChart3,
      color: 'bg-slate-500'
    },
    {
      keywords: ['target', 'goal', 'objective', 'aim'],
      icon: Target,
      color: 'bg-amber-500'
    },
    {
      keywords: ['orders', 'purchases', 'shopping', 'cart'],
      icon: ShoppingCart,
      color: 'bg-pink-500'
    },
    {
      keywords: ['cash', 'money', 'currency', 'banknote'],
      icon: Banknote,
      color: 'bg-yellow-500'
    }
  ];

  // Find matching mapping
  const match = mappings.find(mapping =>
    mapping.keywords.some(keyword => titleLower.includes(keyword))
  );

  if (match) {
    return { icon: match.icon, color: match.color };
  }

  // Default fallback icons and colors based on index
  const defaultMappings = [
    { icon: CircleDollarSign, color: 'bg-blue-500' },
    { icon: TrendingUp, color: 'bg-green-500' },
    { icon: Users, color: 'bg-purple-500' },
    { icon: Activity, color: 'bg-orange-500' },
    { icon: BarChart3, color: 'bg-cyan-500' },
    { icon: Wallet, color: 'bg-indigo-500' },
    { icon: Target, color: 'bg-rose-500' },
    { icon: CreditCard, color: 'bg-emerald-500' }
  ];

  return defaultMappings[index % defaultMappings.length];
};

export const WalletOverview = () => {
  const {user} = useUser()
  const {data, isLoading, error} = useQuery({
    queryKey:['dashboard-summary'],
    queryFn: ()=>axiosInstance.request({
      method:'GET',
      url: '/dashboard/summary',
      params: {
        startDate: getCurrentDate(),
        endDate: '',
        merchantCode: user?.merchantCode,
        datePeriod: getCurrentDate() 
      }
    })
  })

  const {data:balances, isLoading:balancesLoading, error:balancesError} = useQuery({
    queryKey:['wallet-balances'],
    queryFn: ()=>axiosInstance.request({
      method:'GET',
      url: '/coinwallet/balance',
      params: {
        username: user?.username,
        entityCode: user?.entityCode
      }
    })
  })

  console.log(balances);
  

  // Enhanced figures with icons and colors
  const enhancedFigures = data?.data?.figures?.map((item: any, index: number) => {
    const { icon, color } = getIconAndColor(item.title, index);
    return {
      ...item,
      icon,
      color
    };
  }) || [];

  console.log(data)
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6">
        {walletData.map((item, index) => (
          <Card key={index} className="border-border shadow-sm">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                  <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs lg:text-sm text-muted-foreground truncate">{item.title}</p>
                    <p className="text-lg lg:text-2xl font-bold text-foreground">{item.amount}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 lg:mt-4">
                <Badge variant="secondary" className="text-xs">
                  {item.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Currency Wallets */}
      <div className="bg-background rounded-lg p-4 lg:p-6 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h3 className="text-base lg:text-lg font-semibold">Wallet Overview</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6">
          {currencyWallets.map((wallet, index) => (
            <CreditCardComponent
              key={index}
              currency={wallet.currency}
              amount={wallet.amount}
              flag={wallet.flag}
              change={wallet.change}
              variant={wallet.variant}
            />
          ))}
        </div>
      </div>
    </div>
  );
};