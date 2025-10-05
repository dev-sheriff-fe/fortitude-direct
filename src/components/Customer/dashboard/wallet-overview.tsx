'use client'
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Activity,
  BarChart3,
  ShoppingCart,
  CircleDollarSign,
  Eye,
  EyeOff,
  Warehouse,
  Copy
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import { copyToClipboard, getCurrentDate } from '@/utils/helperfns';
import ng from '@/components/images/United Kingdom 4.png';
import uk from '@/components/images/United Kingdom 6.png';
import us from '@/components/images/us.png';
import gh from '@/components/images/gh.png';
import swap from '@/components/images/swap.png';
import send from '@/components/images/send.png';
import recieve from '@/components/images/recieve.png';
import paybills from '@/components/images/pay.png';
import Image from 'next/image';
import { color } from 'framer-motion';
import axiosCustomer from '@/utils/fetch-function-customer';
import useCustomer from '@/store/customerStore';
import { Button } from '@/components/ui/button';
import dollarSign from '@/assets/dollar-sign-icons-gold-circle-2184236.webp'


// Wallet data for the additional section


const quickMenuData = [
  {
    title: 'Send Money',
    icon: send,
  },
  {
    title: 'Recieve Money',
    icon: recieve,
  },
  {
    title: 'Swap Money',
    icon: swap,
  },
  {
    title: 'Pay Bills',
    icon: paybills,
  }
];

// Updated CurrenciesCard component to handle image flags
interface CurrenciesCardProps {
  currency: string;
  amount: string;
  flag: any;
  currencyCode: string;
  isActive?: boolean;
  className?: string;
  forceHideAmount?: boolean;
}

const CurrenciesCard: React.FC<CurrenciesCardProps> = ({
  currency,
  amount,
  flag,
  currencyCode,
  isActive = false,
  className,
  forceHideAmount = false
}) => {
  const [showAmount, setShowAmount] = React.useState(true);

  const toggleAmountVisibility = () => {
    setShowAmount(!showAmount);
  };

  const {customer} = useCustomer()

  console.log(customer);
  

  const displayAmount = forceHideAmount ? false : showAmount;
  return (
    <Card
      className={cn(
        'relative overflow-hidden border border-border rounded-xl transition-all duration-300 cursor-pointer group',
        'hover:shadow-lg hover:-translate-y-1',
        isActive
          ? 'bg-accent text-white'
          : 'bg-white text-foreground',
        className
      )}
    >
      {isActive && (
        <div className="absolute top-0 right-0 w-40 h-40 overflow-hidden">
          <div className="rounded-xl absolute top-4 -right-22 rotate-40 w-44 h-25 bg-white/20  transform origin-center"></div>
          <div className="rounded-xl absolute top-8 -right-24 rotate-40 w-44 h-30 bg-white/20  transform origin-center"></div>
        </div>
      )}

      {!isActive && (
        <div className="absolute top-0 right-0 w-40 h-40 overflow-hidden">
          <div className="rounded-xl absolute top-4 -right-22 rotate-40 w-44 h-25 bg-accent/30  transform origin-center"></div>
          <div className="rounded-xl absolute top-8 -right-24 rotate-40 w-44 h-30 bg-accent/30  transform origin-center"></div>
        </div>
      )}

      <CardContent className="p-5 relative z-10">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center mr-3 overflow-hidden">
            <Image
              src={flag || dollarSign}
              alt={`${currency} flag`}
              width={32}
              height={32}
              className="w-8 h-8 object-cover"
            />
          </div>
          <span className="text-sm font-medium">{currency}</span>
        </div>

        <div className="flex items-center gap-7 mb-2">
          <span className={cn(
            "text-xs",
            isActive ? "text-white" : "text-muted-foreground"
          )}>
            Available Balance
          </span>
          <button
            onClick={toggleAmountVisibility}
            className={cn(
              "transition-colors",
              isActive
                ? "text-white hover:text-muted"
                : "text-muted-foreground hover:text-foreground"
            )}
            disabled={forceHideAmount}
          >
            {displayAmount ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="mb-4">
          <p className="text-xl font-bold">
            {displayAmount ? amount : '••••••••'}
          </p>
        </div>

        <div>
          <Badge variant="secondary" className="text-xs">
            <span className={cn(
              "text-xs",
              isActive ? "text-black" : "text-muted-foreground"
            )}>
              {currencyCode}
            </span>
          </Badge>
        </div>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </CardContent>
    </Card>
  );
};

// CryptoCard component for crypto currencies
interface CryptoCardProps {
  currency: string;
  amount: string;
  icon: string;
  currencyCode: string;
  isActive?: boolean;
  change?: string;
  changePositive?: boolean;
  className?: string;
  forceHideAmount?: boolean;
  publicAddress?: string
}

const CryptoCard: React.FC<CryptoCardProps> = ({
  currency,
  amount,
  icon,
  currencyCode,
  isActive = false,
  change,
  changePositive,
  publicAddress,
  className,
  forceHideAmount = false
}) => {
  const [showAmount, setShowAmount] = React.useState(true);

  const toggleAmountVisibility = () => {
    setShowAmount(!showAmount);
  };

  const displayAmount = forceHideAmount ? false : showAmount;

  return (
    <Card
      className={cn(
        'relative overflow-hidden border border-border rounded-xl transition-all duration-300 cursor-pointer group',
        'hover:shadow-lg hover:-translate-y-1',
        isActive
          ? 'bg-accent text-white'
          : 'bg-white text-foreground',
        className
      )}
    >
      {isActive && (
        <div className="absolute top-0 right-0 w-40 h-40 overflow-hidden">
          <div className="rounded-xl absolute top-4 -right-22 rotate-40 w-44 h-25 bg-white/20  transform origin-center"></div>
          <div className="rounded-xl absolute top-8 -right-24 rotate-40 w-44 h-30 bg-white/10  transform origin-center"></div>
        </div>
      )}

      {!isActive && (
        <div className="absolute top-0 right-0 w-40 h-40 overflow-hidden">
          <div className="rounded-xl absolute top-4 -right-22 rotate-40 w-44 h-25 bg-accent/30  transform origin-center"></div>
          <div className="rounded-xl absolute top-8 -right-24 rotate-40 w-44 h-30 bg-accent/30  transform origin-center"></div>
        </div>
      )}

      <CardContent className="p-5 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center mr-3 overflow-hidden">
            <Image
              src={icon || dollarSign}
              alt={`${currency} icon`}
              width={32}
              height={32}
              className="w-8 h-8 object-cover"
            />
          </div>
            <span className="text-sm font-medium">{currency}</span>
          </div>
          <Button variant={'ghost'} onClick={()=>copyToClipboard(publicAddress!)}>
            <Copy className='w-5 h-5 text-white'/>
          </Button>
        </div>

        <div className="flex items-center gap-7 mb-2">
          <span className={cn(
            "text-xs",
            isActive ? "text-white" : "text-muted-foreground"
          )}>
            Holdings
          </span>
          <button
            onClick={toggleAmountVisibility}
            className={cn(
              "transition-colors",
              isActive
                ? "text-white hover:text-muted"
                : "text-muted-foreground hover:text-foreground"
            )}
            disabled={forceHideAmount}
          >
            {displayAmount ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="mb-2">
          <p className="text-xl font-bold">
            {displayAmount ? amount : '••••••••'}
          </p>
        </div>

        <div>
          <Badge variant="secondary" className="text-xs">
            <span className={cn(
              "text-xs",
              isActive ? "text-black" : "text-muted-foreground"
            )}>
              {currencyCode}
            </span>
          </Badge>
        </div>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function for class names
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export const WalletOverview = () => {
  const [hideAllBalances, setHideAllBalances] = useState(false);
  const [activeTab, setActiveTab] = useState<'fiat' | 'crypto'>('fiat');
  const { customer } = useCustomer()
  const { data, isLoading, error } = useQuery({
    queryKey: ['customer-dashboard-summary'],
    queryFn: () => axiosCustomer.request({
      method: 'GET',
      url: '/customer-dashboard/summary',
      params: {
        // startDate: getCurrentDate(),
        startDate: '01-01-2025',
        endDate: '12-09-2025',
        // merchantCode: user?.merchantCode,
        // datePeriod: getCurrentDate(),
        datePeriod: "",
        storeCode: customer?.storeCode || "STO445",
        username: customer?.username,
        entityCode: customer?.entityCode
      }
    })
  })

  const { data: balances, isLoading: balancesLoading, error: balancesError } = useQuery({
    queryKey: ['customer-balances'],
    queryFn: () => axiosCustomer.request({
      method: 'GET',
      url: '/customer-dashboard/balance',
      params: {
        storeCode: customer?.storeCode || 'STO445',
        username: customer?.username,
        entityCode: customer?.entityCode
      }
    })
  })



  const toggleAllBalances = () => {
    setHideAllBalances(!hideAllBalances);
  };

  const fiatBalances = balances?.data?.wallets
  const coinBalances = balances?.data?.coins

  const BalancesLoadingCards = ()=>(
    <div className="grid md:grid-cols-1 lg:grid-cols-4 gap-4 p-4">
      {
        [1, 2, 3, 4].map((item) => (
        <div key={item} className="animate-pulse h-[180px] bg-gray-200 rounded-md mb-2"></div>
    ))
      }
    </div>
  )

  
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Wallet Overview Section */}
      {/* Wallet Overview Section */}
      <div className="bg-background p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h3 className="text-base lg:text-lg font-semibold">Wallet Overview</h3>
        

          <div className="flex items-center gap-2">
            <Badge className='bg-accent/70 flex items-center gap-2 px-3 py-1.5 hover:bg-accent/70 transition-colors'>
              <span className="text-sm text-foreground text-black">Show Balances</span>

            <button
              onClick={toggleAllBalances}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
                hideAllBalances ? "bg-accent" : "bg-gray-300"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  hideAllBalances ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
                        </Badge>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mb-4 lg:mb-6 gap-7">
          <button
            className={`py-2 px-1 font-medium text-sm relative ${activeTab === 'fiat'
              ? 'text-accent'
              : 'text-muted-foreground hover:text-foreground'
              }`}
            onClick={() => setActiveTab('fiat')}
          >
            Fiat Currencies
            {activeTab === 'fiat' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"></span>
            )}
          </button>
          <button
            className={`py-2 px-1 font-medium text-sm relative ${activeTab === 'crypto'
              ? 'text-accent'
              : 'text-muted-foreground hover:text-foreground'
              }`}
            onClick={() => setActiveTab('crypto')}
          >
            Crypto Currencies
            {activeTab === 'crypto' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"></span>
            )}
          </button>
        </div>


        {/* Tab Content */}
        {activeTab === 'fiat' && (
          <>
            {
              balancesLoading && <BalancesLoadingCards/>
            }

             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
            
             {
              fiatBalances ? fiatBalances?.map((wallet: any, index: number) => (
              <CurrenciesCard
                key={index}
                currency={wallet.symbol}
                amount={wallet.balance}
                flag={wallet.logo}
                currencyCode={wallet.symbol}
                isActive={wallet.isActive}
                forceHideAmount={hideAllBalances}

              />
            )) : <p>No fiat balances available</p>
            }
          </div>
          </>
         
        )}

        {activeTab === 'crypto' && (
          <>
            {
              balancesLoading && <BalancesLoadingCards/>
            }
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
            {coinBalances ? coinBalances.map((wallet: any, index: number) => (
              <CryptoCard
                key={index}
                currency={wallet.symbol}
                amount={wallet.balance}
                icon={wallet.logo}
                currencyCode={wallet.symbol}
                isActive={wallet.isActive}
                publicAddress={wallet?.publicAddress}
                // change={wallet.change}
                // changePositive={wallet.changePositive}
                forceHideAmount={hideAllBalances}

              />
            ))
              : <p>No crypto balances available</p>}
          </div>
          </>
        )}
      </div>

      {/* Additional Wallet Data Section */}
      <div className="bg-background p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold mb-4 lg:mb-6">Quick Menus</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          {quickMenuData.map((item, index) => (
            // <Card key={index} className="border-border shadow-sm">
            // <CardContent className="flex justify-center items-center">
            <div className='bg-background border rounded-lg p-3 flex justify-center items-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer'>
              <div className="flex items-center justify-center">
                <div className="flex items-center justify-center gap-2 lg:gap-3 min-w-0">
                  <div className={`rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Image src={item.icon} alt={item.title} className="w-4 h-4 lg:w-5 lg:h-5 object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs lg:text-sm text-muted-foreground truncate">{item.title}</p>
                  </div>
                </div>
              </div>
            </div>
            //   </CardContent>
            // </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
