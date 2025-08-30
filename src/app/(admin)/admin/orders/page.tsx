'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import OrderDetails from "@/components/Admin/orders/order-details";
import OrdersTable from "@/components/Admin/orders/orders-table";


export interface OrderItem {
  itemName: string;
  itemLogo: string;
  itemCode: string;
  tax: number;
  unitPrice: number;
  qty: number;
  amount: number;
}

export interface Order {
  id: string;
  refNo: string;
  amount: number;
  code3: string;
  orderNo: string;
  status: string;
  paymentMethod: string;
  dateCreated: string;
  category: string;
  customerName: string;
  subTotal: number;
  tax: number;
  total: number;
  orderItemInfos: OrderItem[];
  code?: string;
  desc?: string;
  nextURL?: string;
  listData?: any[];
}

// Mock data based on the API response format
const mockOrders: Order[] = [
  {
    id: "1",
    refNo: "REF001",
    amount: 299.99,
    code3: "USD",
    orderNo: "ORD-2024-001",
    status: "completed",
    paymentMethod: "credit_card",
    dateCreated: "2024-01-15T10:30:00Z",
    category: "Electronics",
    customerName: "John Doe",
    subTotal: 259.99,
    tax: 40.00,
    total: 299.99,
    orderItemInfos: [
      {
        itemName: "Wireless Headphones",
        itemLogo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
        itemCode: "WH001",
        tax: 25.00,
        unitPrice: 129.99,
        qty: 2,
        amount: 259.98
      }
    ]
  },
  {
    id: "2",
    refNo: "REF002",
    amount: 150.50,
    code3: "USD",
    orderNo: "ORD-2024-002",
    status: "pending",
    paymentMethod: "paypal",
    dateCreated: "2024-01-14T14:20:00Z",
    category: "Fashion",
    customerName: "Jane Smith",
    subTotal: 135.50,
    tax: 15.00,
    total: 150.50,
    orderItemInfos: [
      {
        itemName: "Cotton T-Shirt",
        itemLogo: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop",
        itemCode: "TS001",
        tax: 15.00,
        unitPrice: 45.50,
        qty: 3,
        amount: 136.50
      }
    ]
  },
  {
    id: "3",
    refNo: "REF003",
    amount: 89.99,
    code3: "USD",
    orderNo: "ORD-2024-003",
    status: "processing",
    paymentMethod: "bank_transfer",
    dateCreated: "2024-01-13T09:15:00Z",
    category: "Books",
    customerName: "Mike Johnson",
    subTotal: 79.99,
    tax: 10.00,
    total: 89.99,
    orderItemInfos: [
      {
        itemName: "JavaScript Programming Book",
        itemLogo: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&h=100&fit=crop",
        itemCode: "BK001",
        tax: 10.00,
        unitPrice: 79.99,
        qty: 1,
        amount: 79.99
      }
    ]
  },
  {
    id: "4",
    refNo: "REF004",
    amount: 459.99,
    code3: "USD",
    orderNo: "ORD-2024-004",
    status: "delivered",
    paymentMethod: "credit_card",
    dateCreated: "2024-01-12T16:45:00Z",
    category: "Home & Garden",
    customerName: "Sarah Wilson",
    subTotal: 399.99,
    tax: 60.00,
    total: 459.99,
    orderItemInfos: [
      {
        itemName: "Smart Home Speaker",
        itemLogo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        itemCode: "SH001",
        tax: 35.00,
        unitPrice: 199.99,
        qty: 2,
        amount: 399.98
      }
    ]
  },
  {
    id: "5",
    refNo: "REF005",
    amount: 75.25,
    code3: "USD",
    orderNo: "ORD-2024-005",
    status: "cancelled",
    paymentMethod: "digital_wallet",
    dateCreated: "2024-01-11T11:30:00Z",
    category: "Sports",
    customerName: "David Brown",
    subTotal: 65.25,
    tax: 10.00,
    total: 75.25,
    orderItemInfos: [
      {
        itemName: "Yoga Mat",
        itemLogo: "https://images.unsplash.com/photo-1506629905607-46e3ab2d2b57?w=100&h=100&fit=crop",
        itemCode: "YM001",
        tax: 10.00,
        unitPrice: 65.25,
        qty: 1,
        amount: 65.25
      }
    ]
  }
];

const Orders = () => {
  const [orders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const filteredOrders = orders.filter(order =>
    order.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.refNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {/* <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button> */}
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

          {/* Orders Table */}
          <OrdersTable 
            orders={filteredOrders} 
            onViewOrder={handleViewOrder}
          />

          {/* Order Details Dialog */}
          <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
            <DialogContent className="min-w-[80vw] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
              </DialogHeader>
              {selectedOrder && (
                <OrderDetails order={selectedOrder} />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Orders;