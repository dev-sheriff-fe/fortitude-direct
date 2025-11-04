'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Search, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import DynamicTable from '@/components/Customer/orders/dynamic-table';
import { OrderTracking } from '@/components/Admin/orders/order-tracking';
import MobileOrderCard from '@/components/Customer/orders/mobile-order-card';
import useCustomer from '@/store/customerStore';
import axiosCustomer from '@/utils/fetch-function-customer';
import { CustomerOrderTracking } from '@/components/Customer/orders/order-tracking';

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

export default function OrderHistory(): React.ReactElement {
  const { customer } = useCustomer()
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['customer-recent-orders'],
    queryFn: () => axiosCustomer.request({
      url: '/customer-dashboard/fetch-recent-orders',
      method: 'GET',
      // params: {
      //   storeCode: customer?.storeCode || process.env.NEXT_PUBLIC_STORE_CODE,
      //   entityCode: customer?.entityCode
      // }
    })
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  const orders: Order[] = data?.data?.data || [];
  const filteredOrders = orders.filter(order =>
    order.cartId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.paymentMethod && order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleTrackOrder = (order: Order) => {
    setTrackingOrder(order);
    setIsTrackingModalOpen(true);
  };

  //   const handleUpdateTracking = (order: Order) => {
  //     setSelectedOrder(order);
  //     setIsUpdateTrackingModalOpen(true);
  //   };

  const handleUpdateSuccess = () => {
    refetch();
  };

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
                View and manage your orders
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
                  <div className="block lg:hidden space-y-4">
                    {filteredOrders.map((order) => (
                      <MobileOrderCard
                        key={order.cartId}
                        order={order}
                        onTrackOrder={handleTrackOrder}
                      />
                    ))}
                  </div>

                  <div className="hidden lg:block">
                    <DynamicTable
                      data={filteredOrders}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

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
    </div>
  );
}