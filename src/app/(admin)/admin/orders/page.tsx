'use client'
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, Download, Package, ShoppingCart, Truck, CheckCircle, Eye, Search, ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import useUser from '@/store/userStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from 'next/image';
import placeholder from "@/components/images/placeholder-product.webp"
import { Input } from "@/components/ui/input";

// Type definitions based on the API response
interface CartItem {
  itemCode: string;
  itemName: string;
  price: number;
  unit: string | null;
  quantity: number;
  discount: number;
  amount: number;
  picture: string;
}

interface DeliveryAddress {
  id: number;
  street: string;
  landmark: string | null;
  postCode: string | null;
  city: string | null;
  state: string;
  country: string | null;
  addressType: string;
}

interface Order {
  channel: string | null;
  cartId: string;
  orderDate: string;
  totalAmount: number;
  totalDiscount: number;
  deliveryOption: string;
  paymentMethod: string;
  couponCode: string | null;
  ccy: string;
  deliveryFee: number;
  geolocation: string | null;
  deviceId: string | null;
  orderSatus: string;
  paymentStatus: string;
  storeCode: string | null;
  customerName: string;
  username: string | null;
  deliveryAddress: DeliveryAddress;
  cartItems: CartItem[];
}

interface Column {
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
  render?: (value: any, record: Order, index: number) => React.ReactNode;
}

interface DynamicTableProps {
  columns: Column[];
  data: Order[];
  itemsPerPage?: number;
  onViewDetails: (order: Order) => void;
}

interface MobileOrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

const getStatusColor = (status: string): string => {
  if (!status) return 'bg-gray-500 text-white';
  
  switch (status.toLowerCase()) {
    case 'delivered':
    case 'completed':
      return 'bg-green-500 text-white';
    case 'processing':
    case 'pending':
      return 'bg-blue-500 text-white';
    case 'shipped':
      return 'bg-orange-500 text-white';
    case 'cancelled':
    case 'failed':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getStatusIcon = (status: string): React.ReactNode => {
  if (!status) return null;
  
  switch (status.toLowerCase()) {
    case 'delivered':
    case 'completed':
      return <CheckCircle className="w-3 h-3" />;
    case 'processing':
    case 'pending':
      return <Package className="w-3 h-3" />;
    case 'shipped':
      return <Truck className="w-3 h-3" />;
    case 'cancelled':
    case 'failed':
      return <ShoppingCart className="w-3 h-3" />;
    default:
      return null;
  }
};

// Helper function to handle empty values
const getDisplayValue = (value: any): string => {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }
  return value.toString();
};

// DynamicTable Component
const DynamicTable: React.FC<DynamicTableProps> = ({
  columns,
  data,
  itemsPerPage = 5,
  onViewDetails
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    onViewDetails(order);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Update columns to include the click handler
  const columnsWithHandler = columns.map(col => {
    if (col.key === 'actions') {
      return {
        ...col,
        render: (text: string, record: Order) => (
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => handleViewDetails(record)}
          >
            <Eye className="w-4 h-4" />
          </Button>
        )
      };
    }
    return col;
  });

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              {columnsWithHandler.map((column) => (
                <th
                  key={column.key}
                  className="text-left p-3 font-bold text-sm text-gray-700"
                  style={{ width: column.width ? `${column.width}px` : 'auto' }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={item.cartId}
                className={`border-b border-gray-200 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
              >
                {columnsWithHandler.map((column) => (
                  <td key={column.key} className="p-3 text-sm">
                    {column.render
                      ? column.render(item[column.dataIndex as keyof Order], item, index)
                      : getDisplayValue(item[column.dataIndex as keyof Order])
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
        <p className="text-sm text-gray-500">
          Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} Orders
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-xs"
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              className="w-8 h-8 p-0 text-xs"
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-xs"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Order Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.cartId || 'N/A'}</DialogTitle>
            <DialogDescription>
              Detailed information about the selected order
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Order Date:</p>
                  <p className="text-sm">{getDisplayValue(selectedOrder.orderDate)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Customer:</p>
                  <p className="text-sm">{getDisplayValue(selectedOrder.customerName)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Total Amount:</p>
                  <p className="text-sm font-semibold">
                    {selectedOrder.ccy || 'N/A'} {selectedOrder.totalAmount?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Payment Method:</p>
                  <p className="text-sm">{getDisplayValue(selectedOrder.paymentMethod)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Order Status:</p>
                  <Badge className={`${getStatusColor(selectedOrder.orderSatus)} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>
                    {getStatusIcon(selectedOrder.orderSatus)}
                    {getDisplayValue(selectedOrder.orderSatus)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Payment Status:</p>
                  <Badge className={`${getStatusColor(selectedOrder.paymentStatus)} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>
                    {getStatusIcon(selectedOrder.paymentStatus)}
                    {getDisplayValue(selectedOrder.paymentStatus)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Channel:</p>
                  <p className="text-sm">{getDisplayValue(selectedOrder.channel)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Delivery Option:</p>
                  <p className="text-sm">{getDisplayValue(selectedOrder.deliveryOption)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Coupon Code:</p>
                  <p className="text-sm">{getDisplayValue(selectedOrder.couponCode)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Delivery Fee:</p>
                  <p className="text-sm">
                    {selectedOrder.ccy || 'N/A'} {selectedOrder.deliveryFee?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 border rounded-lg">
                      <div className="w-12 h-12 relative rounded-md overflow-hidden">
                        <Image
                          src={item.picture || `${placeholder.src}`}
                          alt={item.itemName}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `${placeholder.src}`;
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{getDisplayValue(item.itemName)}</p>
                        <p className="text-xs text-gray-500">
                          Code: {getDisplayValue(item.itemCode)} | 
                          Qty: {getDisplayValue(item.quantity)} | 
                          {selectedOrder.ccy || 'N/A'} {item.price?.toFixed(2) || '0.00'} each
                        </p>
                      </div>
                      <div className="text-sm font-semibold">
                        {selectedOrder.ccy || 'N/A'} {item.amount?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.deliveryAddress && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-2">Delivery Address</h4>
                  <p className="text-sm">
                    {getDisplayValue(selectedOrder.deliveryAddress.street)}<br />
                    {selectedOrder.deliveryAddress.city && `${selectedOrder.deliveryAddress.city}, `}
                    {getDisplayValue(selectedOrder.deliveryAddress.state)}<br />
                    {selectedOrder.deliveryAddress.postCode && `${selectedOrder.deliveryAddress.postCode}, `}
                    {getDisplayValue(selectedOrder.deliveryAddress.country)}
                    {selectedOrder.deliveryAddress.landmark && ` (Landmark: ${selectedOrder.deliveryAddress.landmark})`}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

// Mobile Order Card Component
const MobileOrderCard: React.FC<MobileOrderCardProps> = ({ order, onViewDetails }) => {
  const firstItem = order.cartItems[0];

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">{getDisplayValue(order.cartId)}</p>
          <p className="text-xs text-gray-500">{getDisplayValue(order.orderDate)}</p>
        </div>
        <Badge className={`${getStatusColor(order.orderSatus)} text-xs px-2 py-1 flex items-center gap-1`}>
          {getStatusIcon(order.orderSatus)}
          {getDisplayValue(order.orderSatus)}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 relative rounded-md overflow-hidden">
          <Image
            src={firstItem.picture || `${placeholder.src}`}
            alt={firstItem.itemName}
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `${placeholder.src}`;
            }}
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{getDisplayValue(firstItem.itemName)}</p>
          <p className="text-xs text-gray-500">
            {order.cartItems.length} item{order.cartItems.length !== 1 ? 's' : ''} • {order.ccy || 'N/A'} {order.totalAmount?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="bg-blue-500 text-white text-xs">
              {order.customerName ? order.customerName.split(' ').map(n => n[0]).join('') : 'GC'}
            </AvatarFallback>
          </Avatar>
          <p className="text-xs text-gray-600">{getDisplayValue(order.customerName)}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="p-1"
          onClick={() => onViewDetails(order)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default function OrderHistory(): React.ReactElement {
  const { user } = useUser();
  const { data, isLoading, error } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: () => axiosInstance.request({
      url: '/store-dashboard/fetch-recent-orders',
      method: 'GET',
      params: {
        storeCode: user?.storeCode,
        entityCode: user?.entityCode
      }
    })
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Format API data for the table
  const orders: Order[] = data?.data?.data || [];

  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    order.cartId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.paymentMethod && order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const columns: Column[] = [
    {
      title: 'Product',
      dataIndex: 'cartItems',
      key: 'product',
      width: 200,
      render: (items: CartItem[], record: Order) => {
        const firstItem = items[0];
        return (
          <div className="flex items-center gap-3">
            <div className="w-20 h-10 relative rounded-md overflow-hidden">
              <Image
                src={firstItem.picture || `${placeholder.src}`}
                alt={firstItem.itemName}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `${placeholder.src}`;
                }}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{getDisplayValue(firstItem.itemName)}</p>
              <p className="text-xs text-gray-500">Cart: {items.length} item{items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Order ID & Date',
      dataIndex: 'cartId',
      key: 'id',
      width: 180,
      render: (text: string, record: Order) => (
        <div>
          <p className="text-sm font-semibold text-gray-900">{getDisplayValue(text)}</p>
          <p className="text-xs text-gray-500">{getDisplayValue(record.orderDate)}</p>
        </div>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customer',
      width: 150,
      render: (text: string) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-blue-500 text-white text-xs">
              {text ? text.split(' ').map(n => n[0]).join('') : 'GC'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900">{getDisplayValue(text)}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'amount',
      width: 100,
      render: (text: number, record: Order) => (
        <span className="text-sm font-semibold text-green-600">
          {record.ccy || 'N/A'} {text?.toFixed(2) || '0.00'}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'orderSatus',
      key: 'status',
      width: 120,
      render: (text: string) => (
        <Badge className={`${getStatusColor(text)} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>
          {getStatusIcon(text)}
          {getDisplayValue(text)}
        </Badge>
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      key: 'payment',
      width: 120,
      render: (text: string) => (
        <Badge className={`${getStatusColor(text)} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>
          {getStatusIcon(text)}
          {getDisplayValue(text)}
        </Badge>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: 80,
      render: (text: string, record: Order) => (
        <Button
          variant="ghost"
          size="sm"
          className="p-1"
          onClick={() => handleViewDetails(record)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Orders Management
              </h1>
              <p className="text-muted-foreground">
                View and manage customer orders
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{orders.length}</p>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Search and Actions */}
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" className="transition-smooth">
                Export Orders
              </Button>
              <Button variant="secondary" className="transition-smooth">
                Generate Report
              </Button>
            </div>
          </div>

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
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-gray-500">Loading orders...</p>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-red-500">Error loading orders</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-gray-500">No orders found</p>
                </div>
              ) : (
                <>
                  {/* Mobile view - Stack layout */}
                  <div className="block lg:hidden space-y-4">
                    {filteredOrders.map((order) => (
                      <MobileOrderCard
                        key={order.cartId}
                        order={order}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>

                  {/* Desktop view - Dynamic Table */}
                  <div className="hidden lg:block">
                    <DynamicTable
                      columns={columns}
                      data={filteredOrders}
                      onViewDetails={handleViewDetails}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}