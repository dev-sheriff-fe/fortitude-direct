'use client'
import React from 'react';
import Table from 'rc-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Download, Package, ShoppingCart, Truck, CheckCircle } from 'lucide-react';
import 'rc-table/assets/index.css';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import useUser from '@/store/userStore';

// Type definitions
interface Order {
  id: string;
  date: string;
  customer: string;
  product: string;
  quantity: number;
  amount: string;
  status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled';
  avatar: string;
  category: string;
}

interface MobileOrderCardProps {
  order: Order;
}

const orders: Order[] = [
  {
    id: 'ORD001',
    date: '06/12/2025 11:00AM',
    customer: 'Joshua Johnson',
    product: 'iPhone 15 Pro Max',
    quantity: 1,
    amount: '$1,299.00',
    status: 'Delivered',
    avatar: '',
    category: 'Electronics'
  },
  {
    id: 'ORD002',
    date: '06/12/2025 10:30AM',
    customer: 'Sarah Williams',
    product: 'Nike Air Max 270',
    quantity: 2,
    amount: '$300.00',
    status: 'Processing',
    avatar: '',
    category: 'Fashion'
  },
  {
    id: 'ORD003',
    date: '06/12/2025 09:15AM',
    customer: 'Michael Chen',
    product: 'MacBook Pro 16"',
    quantity: 1,
    amount: '$2,499.00',
    status: 'Shipped',
    avatar: '',
    category: 'Electronics'
  },
  {
    id: 'ORD004',
    date: '06/12/2025 08:45AM',
    customer: 'Emma Davis',
    product: 'Wireless Headphones',
    quantity: 1,
    amount: '$199.99',
    status: 'Cancelled',
    avatar: '',
    category: 'Electronics'
  },
  {
    id: 'ORD005',
    date: '06/12/2025 08:00AM',
    customer: 'David Brown',
    product: 'Gaming Chair',
    quantity: 1,
    amount: '$450.00',
    status: 'Delivered',
    avatar: '',
    category: 'Furniture'
  }
];

const getStatusColor = (status: Order['status']): string => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'bg-green-500 text-white';
    case 'processing':
      return 'bg-blue-500 text-white';
    case 'shipped':
      return 'bg-orange-500 text-white';
    case 'cancelled':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getStatusIcon = (status: Order['status']): React.ReactNode => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return <CheckCircle className="w-3 h-3" />;
    case 'processing':
      return <Package className="w-3 h-3" />;
    case 'shipped':
      return <Truck className="w-3 h-3" />;
    case 'cancelled':
      return <ShoppingCart className="w-3 h-3" />;
    default:
      return null;
  }
};

export default function TransactionHistory(): React.ReactElement {
  const {user} = useUser()
  const {data} = useQuery({
    queryKey: ['recent-trans'],
    queryFn: () =>axiosInstance.request({
      url: '/store-dashboard/fetchRecentTrans',
      method: 'GET',
      params: {
        storeCode: user?.storeCode,
        entityCode: user?.entityCode
      }
    })
  })

  console.log(data);
  
  const columns = [
    {
      title: 'Order ID & Date',
      dataIndex: 'id',
      key: 'id',
      width: 180,
      render: (text: string, record: Order) => (
        <div>
          <p className="text-sm font-semibold text-gray-900">{text}</p>
          <p className="text-xs text-gray-500">{record.date}</p>
        </div>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      width: 200,
      render: (text: string, record: Order) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-blue-500 text-white text-xs">
              {text.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900">{text}</p>
            <p className="text-xs text-gray-500">{record.category}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      width: 200,
      render: (text: string, record: Order) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{text}</p>
          <p className="text-xs text-gray-500">Qty: {record.quantity}</p>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (text: string) => (
        <span className="text-sm font-semibold text-green-600">{text}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (text: Order['status']) => (
        <Badge className={`${getStatusColor(text)} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>
          {getStatusIcon(text)}
          {text}
        </Badge>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (text: string, record: Order) => (
        <Button variant="ghost" size="sm" className="p-1">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  // Mobile card view for responsive design
  const MobileOrderCard: React.FC<MobileOrderCardProps> = ({ order }) => (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">{order.id}</p>
          <p className="text-xs text-gray-500">{order.date}</p>
        </div>
        <Badge className={`${getStatusColor(order.status)} text-xs px-2 py-1 flex items-center gap-1`}>
          {getStatusIcon(order.status)}
          {order.status}
        </Badge>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-blue-500 text-white text-xs">
              {order.customer.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900">{order.customer}</p>
            <p className="text-xs text-gray-500">{order.category}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="p-1">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <div>
          <p className="text-sm font-medium text-gray-900">{order.product}</p>
          <p className="text-xs text-gray-500">Qty: {order.quantity}</p>
        </div>
        <span className="text-sm font-semibold text-green-600">{order.amount}</span>
      </div>
    </div>
  );

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base lg:text-lg font-semibold text-gray-900">
            Recent Orders
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mobile view - Stack layout */}
        <div className="block lg:hidden space-y-4">
          {orders.map((order) => (
            <MobileOrderCard key={order.id} order={order} />
          ))}
        </div>

        {/* Desktop view - RC Table with custom styles to remove borders */}
        <div className="hidden lg:block">
          <Table
            columns={columns}
            data={orders}
            rowKey="id"
            className="w-full"
            tableLayout="fixed"
            rowClassName={() => 'hover:bg-gray-50 transition-colors'}
          />
        </div>
        
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
          {/* <p className="text-sm text-gray-500">
            Showing 1 to 5 of 50 Orders
          </p> */}
          {/* <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled className="text-xs">
              Previous
            </Button>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((page: number) => (
                <Button
                  key={page}
                  variant={page === 1 ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0 text-xs"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Next
            </Button>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}