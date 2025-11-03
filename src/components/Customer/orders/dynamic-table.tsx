'use client'
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Eye, Truck, Package } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from 'next/image';
import placeholder from "@/components/images/placeholder-product.webp"
import { CustomerOrderTracking } from './order-tracking';

// Type definitions
interface CartItem {
  itemCode: string;
  itemName: string;
  price: number;
  unit: string | null;
  quantity: number;
  discount: number;
  amount: number;
  picture: string;
  tax?: number;
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

export interface Order {
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

interface DynamicTableProps {
  data: Order[];
  itemsPerPage?: number;
  // onTrackOrder: (order: Order) => void;
  // onUpdateTracking: (order: Order) => void;
}

// Helper functions
const getStatusColor = (status: string): string => {
  if (!status) return 'bg-gray-500 text-white';

  switch (status.toLowerCase()) {
    case 'delivered':
    case 'completed':
    case 'paid':
    case 'success':
      return 'bg-green-500 text-white';
    case 'processing':
    case 'pending':
      return 'bg-blue-500 text-white';
    case 'shipped':
      return 'bg-orange-500 text-white';
    case 'cancelled':
    case 'failed':
    case 'draft':
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
      return <Eye className="w-3 h-3" />;
    case 'processing':
    case 'pending':
      return <Package className="w-3 h-3" />;
    case 'shipped':
      return <Truck className="w-3 h-3" />;
    case 'cancelled':
    case 'failed':
      return <Package className="w-3 h-3" />;
    default:
      return null;
  }
};

const getDisplayValue = (value: any): string => {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }
  return value.toString();
};

const DynamicTable: React.FC<DynamicTableProps> = ({
  data,
  itemsPerPage = 5,
  // onTrackOrder,
  // onUpdateTracking
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleTrackOrder = (order: Order) => {
    setTrackingOrder(order);
    setIsTrackingModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calculate order totals for the modal
  const calculateSubtotal = (order: Order) => {
    return order.cartItems?.reduce((sum, item) => sum + item.amount, 0) || 0;
  };

  const calculateTotalTax = (order: Order) => {
    return order.cartItems?.reduce((sum, item) => sum + (item.tax || 0), 0) || 0;
  };

  const calculateTotal = (order: Order) => {
    return calculateSubtotal(order) + calculateTotalTax(order) + (order.deliveryFee || 0);
  };

  type ColumnType<T> = {
    title: string;
    dataIndex: keyof T | string;
    key: string;
    width?: number;
    render?: (value: any, record: T) => React.ReactNode;
  };

  const columns: ColumnType<Order>[] = [
    {
      title: 'Product',
      dataIndex: 'cartItems',
      key: 'product',
      width: 200,
      render: (items, record) => {
        const cartItems = items as CartItem[];
        const firstItem = cartItems[0];
        return (
          <div className="flex items-center gap-3">
            <div className="w-13 h-10 relative rounded-md overflow-hidden">
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
              <p className="text-xs text-gray-500">Cart: {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
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
      render: (text, record) => (
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
      render: (text) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-blue-500 text-white text-xs">
              {typeof text === 'string' && text ? text.split(' ').map(n => n[0]).join('') : 'GC'}
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
      render: (text, record) => (
        <span className="text-sm font-semibold text-green-600">
          {record.ccy || 'N/A'} {(typeof text === 'number' ? text.toFixed(2) : '0.00')}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'orderSatus',
      key: 'status',
      width: 120,
      render: (text) => (
        <Badge className={`${getStatusColor(String(text))} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>
          {getStatusIcon(String(text))}
          {getDisplayValue(text)}
        </Badge>
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      key: 'payment',
      width: 120,
      render: (text) => (
        <Badge className={`${getStatusColor(String(text))} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>
          {getStatusIcon(String(text))}
          {getDisplayValue(text)}
        </Badge>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => handleTrackOrder(record)}
            title="Track Order"
          >
            <Truck className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => handleViewDetails(record)}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              {columns.map((column) => (
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
                {columns.map((column) => (
                  <td key={column.key} className="p-3 text-sm">
                    {column.render
                      ? column.render(item[column.dataIndex as keyof Order], item)
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
          <DialogHeader className='flex flex-col'>
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

                {/* Order Totals Calculation */}
                <div className="border-t-2 border-gray-300 pt-4 mt-6">
                  <div className="flex justify-end">
                    <div className="w-64">
                      <div className="flex justify-between py-2 text-gray-700">
                        <span>Subtotal:</span>
                        <span className="font-medium">
                          {selectedOrder.ccy} {calculateSubtotal(selectedOrder).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 text-gray-700">
                        <span>Tax:</span>
                        <span className="font-medium">
                          {selectedOrder.ccy} {calculateTotalTax(selectedOrder).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 text-gray-700">
                        <span>Delivery Fee:</span>
                        <span className="font-medium">
                          {selectedOrder.ccy} {selectedOrder.deliveryFee?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 text-lg font-bold text-green-600 border-t border-gray-300">
                        <span>Total:</span>
                        <span>
                          {selectedOrder.ccy} {calculateTotal(selectedOrder).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
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

      {trackingOrder && (
        <CustomerOrderTracking
          order={trackingOrder}
          isOpen={isTrackingModalOpen}
          onClose={() => {
            setIsTrackingModalOpen(false);
            setTrackingOrder(null);
          }}
        />
      )}
    </>
  );
};

export default DynamicTable;