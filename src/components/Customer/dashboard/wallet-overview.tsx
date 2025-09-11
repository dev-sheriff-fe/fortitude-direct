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

// Simplified currency wallets with image flags
const currencyWallets = [
  {
    currency: 'United Kingdom Pound',
    amount: '£103,101.86',
    flag: uk,
    isActive: true,
    currencyCode: 'GBP',
  },
  {
    currency: 'United States Dollar',
    amount: '$103,101.86',
    flag: us,
    currencyCode: 'USD',
    isActive: false,
  },
  {
    currency: 'Nigerian naira',
    amount: '₦103,101.86',
    flag: ng,
    isActive: false,
    currencyCode: 'NGN',
  },
  {
    currency: 'Ghanaian cedi',
    amount: '₵103,101.86',
    flag: gh,
    currencyCode: 'GHC',
    isActive: false,
  }
];

// Crypto wallets data
const cryptoWallets = [
  {
    currency: 'Bitcoin',
    amount: '0.5234',
    icon: '₿',
    currencyCode: 'BTC',
    isActive: true,
    change: '+2.5%',
    changePositive: true,
  },
  {
    currency: 'Ethereum',
    amount: '4.321',
    icon: 'Ξ',
    currencyCode: 'ETH',
    isActive: false,
    change: '-1.2%',
    changePositive: false,
  },
  {
    currency: 'USD Coin',
    amount: '12,345.67',
    icon: '💲',
    currencyCode: 'USDC',
    isActive: false,
    change: '+0.1%',
    changePositive: true,
  },
  {
    currency: 'Litecoin',
    amount: '15.789',
    icon: 'Ł',
    currencyCode: 'LTC',
    isActive: false,
    change: '+5.3%',
    changePositive: true,
  }
];

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
              src={flag}
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
              src={icon}
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
    queryKey: ['dashboard-summary'],
    queryFn: () => axiosCustomer.request({
      method: 'GET',
      url: '/store-dashboard/summary',
      params: {
        // startDate: getCurrentDate(),
        startDate: '01-01-2025',
        endDate: '02-09-2025',
        // merchantCode: user?.merchantCode,
        // datePeriod: getCurrentDate(),
        datePeriod: "",
        storeCode: "STO445",
        username: customer?.username,
        entityCode: customer?.entityCode
      }
    })
  })

  const { data: balances, isLoading: balancesLoading, error: balancesError } = useQuery({
    queryKey: ['wallet-balances'],
    queryFn: () => axiosCustomer.request({
      method: 'GET',
      url: '/coinwallet/balance',
      params: {
        username: customer?.username,
        entityCode: customer?.entityCode
      }
    })
  })

  

  const { data: storeBalances } = useQuery({
    queryKey: ['recent-trans'],
    queryFn: () => axiosCustomer.request({
      url: '/store-dashboard/fetchRecentTrans',
      method: 'GET',
      params: {
        storeCode: "STO445",
        entityCode: customer?.entityCode
      }
    })
  })

  const { data: storeBalan } = useQuery({
    queryKey: ['recent-tras'],
    queryFn: () => axiosCustomer.request({
      url: '/store-dashboard/fetch-recent-orders',
      method: 'GET',
      params: {
        storeCode: "STO445",
        entityCode: customer?.entityCode
      }
    })
  })


  const toggleAllBalances = () => {
    setHideAllBalances(!hideAllBalances);
  };

  const fiatBalances = balances?.data?.wallets
  const coinBalances = balances?.data?.coins

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Wallet Overview Section */}
      {/* Wallet Overview Section */}
      <div className="bg-background p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h3 className="text-base lg:text-lg font-semibold">Wallet Overview</h3>
          {/* Toggle Button */}
          {/* <button
            onClick={toggleAllBalances}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-border hover:bg-muted/50 transition-colors"
          >
            {hideAllBalances ? (
              <>
                <Eye className="w-4 h-4" />
                Show Balances
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                Hide All Balances
              </>
            )}
          </button> */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
            {fiatBalances?.map((wallet:any, index:any) => (
              <CurrenciesCard
                key={index}
                currency={wallet.symbol}
                amount={wallet.balance}
                flag={wallet.logo}
                currencyCode={wallet.symbol}
                isActive={wallet.isActive}
                forceHideAmount={hideAllBalances}
              />
            ))}
          </div>
        )}

        {activeTab === 'crypto' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
            {coinBalances?.map((wallet:any, index:number) => (
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
            ))}
          </div>
        )}
      </div>

      {/* Additional Wallet Data Section */}
      <div className="bg-background p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold mb-4 lg:mb-6">Quick Menus</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          {quickMenuData.map((item, index) => (
            // <Card key={index} className="border-border shadow-sm">
            // <CardContent className="flex justify-center items-center">
            <div className='bg-background border border-border rounded-lg p-3 flex justify-center items-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer'>
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

      {/* Additional Wallet Data Section
      {/* <div className="bg-background p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold mb-4 lg:mb-6">Financial Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
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
      </div>
    </div>
  );
}; */}

    </div>
  );
};
