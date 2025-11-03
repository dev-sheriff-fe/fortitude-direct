'use client'
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosCustomer from '@/utils/fetch-function-customer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TrackingStep {
  id: number;
  orderNo: string;
  entityCode: string;
  status: string;
  activityDate: string;
  activityType: 'PENDING' | 'PACKING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'PAYMENT_RECEIVED' | 'ORDER_REVIEW' | 'SHIPPING' | 'IN_TRANSIT';
  comment?: string;
  docLink?: string;
}

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

interface CustomerOrderTrackingProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_MAPPING = {
  PENDING: { label: 'Pending', icon: <Clock className="w-6 h-6" /> },
  PAYMENT_RECEIVED: { label: 'Payment Received', icon: <CheckCircle className="w-6 h-6" /> },
  ORDER_REVIEW: { label: 'Order Review', icon: <Clock className="w-6 h-6" /> },
  PACKING: { label: 'Packing', icon: <Package className="w-6 h-6" /> },
  SHIPPING: { label: 'Shipping', icon: <Truck className="w-6 h-6" /> },
  IN_TRANSIT: { label: 'In Transit', icon: <Truck className="w-6 h-6" /> },
  SHIPPED: { label: 'Shipped', icon: <Truck className="w-6 h-6" /> },
  DELIVERED: { label: 'Delivered', icon: <CheckCircle className="w-6 h-6" /> },
  CANCELLED: { label: 'Cancelled', icon: <XCircle className="w-6 h-6" /> },
  COMPLETED: { label: 'Completed', icon: <CheckCircle className="w-6 h-6" /> }
};

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAYMENT_RECEIVED: 'bg-green-100 text-green-800',
  ORDER_REVIEW: 'bg-blue-100 text-blue-800',
  PACKING: 'bg-blue-100 text-blue-800',
  SHIPPING: 'bg-purple-100 text-purple-800',
  IN_TRANSIT: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-green-100 text-green-800',
};

export const CustomerOrderTracking: React.FC<CustomerOrderTrackingProps> = ({
  order,
  isOpen,
  onClose
}) => {
  const formatTrackingDate = (dateString: string) => {
    if (!dateString) return "N/A";

    try {
      const [datePart, timePart, period] = dateString.split(' ');
      const [day, month, year] = datePart.split('-').map(Number);
      const [hours, minutes, seconds] = timePart.split(':').map(Number);

      let adjustedHours = hours;
      if (period === 'PM' && hours < 12) {
        adjustedHours = hours + 12;
      } else if (period === 'AM' && hours === 12) {
        adjustedHours = 0;
      }

      const date = new Date(year, month - 1, day, adjustedHours, minutes, seconds);
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        minute: '2-digit',
        hour12: true
      };

      return date.toLocaleString('en-US', options);
    } catch (error) {
      console.error('Error parsing date:', error);
      return "Invalid Date";
    }
  };

  const { data: trackingData, isFetching, isError, refetch } = useQuery({
    queryKey: ['customer-order-tracking', order.cartId],
    queryFn: () => axiosCustomer.request({
      method: 'GET',
      url: 'ecommerce/track-sale-order',
      params: {
        orderNo: order.cartId
      }
    }),
    enabled: isOpen && !!order.cartId,
    select: (response: any) => response.data,
  });

  React.useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  const calculateSubtotal = () => {
    return order.cartItems?.reduce((sum: number, item: { amount: number }) => sum + item.amount, 0) || 0;
  };

  const calculateTotalTax = () => {
    return order.cartItems?.reduce((sum: number, item: { tax?: number }) => sum + (item.tax || 0), 0) || 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTotalTax() + (order.deliveryFee || 0);
  };

  const trackingInfo = trackingData?.orderTrackInfo;
  const currentStatus = trackingInfo?.status || order.orderSatus;
  const currentActivityType = trackingInfo?.activityType;
  const isCancelled = currentActivityType === 'CANCELLED';
  const isCompleted = currentStatus === 'COMPLETED';

  const getStatusProgression = () => {
    const allStatuses = ['PENDING', 'PAYMENT_RECEIVED', 'ORDER_REVIEW', 'PACKING', 'SHIPPING', 'IN_TRANSIT', 'DELIVERED'];
    
    if (isCancelled) {
      return ['CANCELLED'];
    }
    
    return allStatuses;
  };

  const getStatusIndex = (status: string) => {
    const statusOrder = getStatusProgression();
    return statusOrder.indexOf(status);
  };

  const renderStatusSteps = () => {
    if (isCancelled) {
      return (
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-red-500 text-white">
            <XCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 pt-1">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-800">Cancelled</h4>
                {trackingInfo && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formatTrackingDate(trackingInfo.activityDate)}
                  </p>
                )}
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Cancelled
              </span>
            </div>
          </div>
        </div>
      );
    }

    const statusProgression = getStatusProgression();
    
    return statusProgression.map((status, index) => {
      const currentIndex = getStatusIndex(currentActivityType || 'PENDING');
      const isCompletedStep = currentIndex >= index;
      const isCurrent = status === currentActivityType;
      const statusConfig = STATUS_MAPPING[status as keyof typeof STATUS_MAPPING] || { label: status, icon: <Package className="w-5 h-5" /> };

      return (
        <div key={status} className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
            ${isCompletedStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
            {isCompletedStep ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              statusConfig.icon
            )}
          </div>

          <div className={`flex-1 pt-1 ${index === statusProgression.length - 1 ? '' : 'pb-6'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h4 className={`font-medium ${isCompletedStep ? 'text-gray-800' : 'text-gray-500'}`}>
                  {statusConfig.label}
                </h4>
                {isCurrent && trackingInfo && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formatTrackingDate(trackingInfo.activityDate)}
                  </p>
                )}
              </div>
              {isCurrent && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                  ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                  {isCompleted ? 'Completed' : 'In Progress'}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className='flex flex-col'>
          <DialogTitle>
            {isCancelled ? 'Order Cancelled' : isCompleted ? 'Order Completed' : 'Order Tracking'} - {order.cartId}
          </DialogTitle>
          <DialogDescription>
            Track your order status and delivery progress
          </DialogDescription>
        </DialogHeader>

        {isFetching ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-600">Loading tracking information...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500">
            <p>Failed to load tracking information. Please try again later.</p>
          </div>
        ) : (
          <div className="py-4">
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 md:gap-5">
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">
                    {formatTrackingDate(order.orderDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium">{order.ccy} {calculateTotal().toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">{order.paymentMethod}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {isCancelled ? 'Cancellation Details' : isCompleted ? 'Completion Details' : 'Order Status'}
              </h3>

              <div className="relative">
                {!isCancelled && !isCompleted && (
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 -z-10"></div>
                )}
                <div className="space-y-8">
                  {renderStatusSteps()}
                </div>
              </div>
            </div>

            {trackingInfo && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Latest Update</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
                        ${statusColors[currentActivityType as keyof typeof statusColors] || 'bg-gray-100'}`}>
                        {STATUS_MAPPING[currentActivityType as keyof typeof STATUS_MAPPING]?.icon || <Package className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {STATUS_MAPPING[currentActivityType as keyof typeof STATUS_MAPPING]?.label || currentActivityType}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatTrackingDate(trackingInfo.activityDate)}
                        </p>
                        {trackingInfo.comment && (
                          <p className="text-sm text-gray-600 mt-2">{trackingInfo.comment}</p>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${statusColors[currentStatus as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                      {currentStatus}
                    </span>
                  </div>
                  {trackingInfo.docLink && (
                    <a href={trackingInfo.docLink} target="_blank" rel="noopener noreferrer"
                      className="inline-block text-sm text-blue-500 mt-2 hover:underline">
                      View Document
                    </a>
                  )}
                </div>
              </div>
            )}

            {order.deliveryAddress && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Delivery Address</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm">
                    {order.deliveryAddress.street}<br />
                    {order.deliveryAddress.city && `${order.deliveryAddress.city}, `}
                    {order.deliveryAddress.state}<br />
                    {order.deliveryAddress.postCode && `${order.deliveryAddress.postCode}, `}
                    {order.deliveryAddress.country}
                    {order.deliveryAddress.landmark && (
                      <span className="block mt-1 text-gray-500">
                        Landmark: {order.deliveryAddress.landmark}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomerOrderTracking;