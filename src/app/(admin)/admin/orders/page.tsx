// 'use client'
// import React, { useState } from 'react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { MoreHorizontal, Download, Package, ShoppingCart, Truck, CheckCircle, Eye, Search, ArrowLeft, Clock, XCircle } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import axiosInstance from '@/utils/fetch-function';
// import useUser from '@/store/userStore';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import Image from 'next/image';
// import placeholder from "@/components/images/placeholder-product.webp"
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { useForm } from 'react-hook-form';
// import { toast } from 'react-toastify';

// // Type definitions based on the API response
// interface CartItem {
//   itemCode: string;
//   itemName: string;
//   price: number;
//   unit: string | null;
//   quantity: number;
//   discount: number;
//   amount: number;
//   picture: string;
//   tax?: number; // Added for tax calculation
// }

// interface DeliveryAddress {
//   id: number;
//   street: string;
//   landmark: string | null;
//   postCode: string | null;
//   city: string | null;
//   state: string;
//   country: string | null;
//   addressType: string;
// }

// interface Order {
//   channel: string | null;
//   cartId: string;
//   orderDate: string;
//   totalAmount: number;
//   totalDiscount: number;
//   deliveryOption: string;
//   paymentMethod: string;
//   couponCode: string | null;
//   ccy: string;
//   deliveryFee: number;
//   geolocation: string | null;
//   deviceId: string | null;
//   orderSatus: string;
//   paymentStatus: string;
//   storeCode: string | null;
//   customerName: string;
//   username: string | null;
//   deliveryAddress: DeliveryAddress;
//   cartItems: CartItem[];
// }

// interface Column {
//   title: string;
//   dataIndex: string;
//   key: string;
//   width?: number;
//   render?: (value: any, record: Order, index: number) => React.ReactNode;
// }

// interface DynamicTableProps {
//   columns: Column[];
//   data: Order[];
//   itemsPerPage?: number;
//   onViewDetails: (order: Order) => void;
//   onTrackOrder: (order: Order) => void;
//   onUpdateTracking: (order: Order) => void;
// }

// interface MobileOrderCardProps {
//   order: Order;
//   onViewDetails: (order: Order) => void;
//   onTrackOrder: (order: Order) => void;
//   onUpdateTracking: (order: Order) => void;
// }

// // Tracking related interfaces
// interface TrackingStep {
//   id: number;
//   orderNo: string;
//   entityCode: string;
//   status: string;
//   activityDate: string;
//   activityType: 'PENDING' | 'PACKING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
//   comment?: string;
//   docLink?: string;
// }

// const statusIcons = {
//   PENDING: <Clock className="w-6 h-6" />,
//   PACKING: <Package className="w-6 h-6" />,
//   SHIPPED: <Truck className="w-6 h-6" />,
//   DELIVERED: <CheckCircle className="w-6 h-6" />,
//   CANCELLED: <XCircle className="w-6 h-6" />,
// };

// const statusColors = {
//   PENDING: 'bg-yellow-100 text-yellow-800',
//   PACKING: 'bg-blue-100 text-blue-800',
//   SHIPPED: 'bg-purple-100 text-purple-800',
//   DELIVERED: 'bg-green-100 text-green-800',
//   CANCELLED: 'bg-red-100 text-red-800',
//   COMPLETED: 'bg-green-100 text-green-800',
// };

// const getStatusColor = (status: string): string => {
//   if (!status) return 'bg-gray-500 text-white';

//   switch (status.toLowerCase()) {
//     case 'delivered':
//     case 'completed':
//       return 'bg-green-500 text-white';
//     case 'processing':
//     case 'pending':
//       return 'bg-blue-500 text-white';
//     case 'shipped':
//       return 'bg-orange-500 text-white';
//     case 'cancelled':
//     case 'failed':
//       return 'bg-red-500 text-white';
//     default:
//       return 'bg-gray-500 text-white';
//   }
// };

// const getStatusIcon = (status: string): React.ReactNode => {
//   if (!status) return null;

//   switch (status.toLowerCase()) {
//     case 'delivered':
//     case 'completed':
//       return <CheckCircle className="w-3 h-3" />;
//     case 'processing':
//     case 'pending':
//       return <Package className="w-3 h-3" />;
//     case 'shipped':
//       return <Truck className="w-3 h-3" />;
//     case 'cancelled':
//     case 'failed':
//       return <ShoppingCart className="w-3 h-3" />;
//     default:
//       return null;
//   }
// };

// // Helper function to handle empty values
// const getDisplayValue = (value: any): string => {
//   if (value === null || value === undefined || value === '') {
//     return 'N/A';
//   }
//   return value.toString();
// };

// // Order Tracking Component
// const OrderTracking: React.FC<{ order: Order; isOpen: boolean; onClose: () => void }> = ({
//   order,
//   isOpen,
//   onClose
// }) => {
//   const formatTrackingDate = (dateString: string) => {
//     if (!dateString) return "N/A";

//     try {
//       const [datePart, timePart, period] = dateString.split(' ');
//       const [day, month, year] = datePart.split('-').map(Number);
//       const [hours, minutes, seconds] = timePart.split(':').map(Number);

//       let adjustedHours = hours;
//       if (period === 'PM' && hours < 12) {
//         adjustedHours = hours + 12;
//       } else if (period === 'AM' && hours === 12) {
//         adjustedHours = 0;
//       }

//       const date = new Date(year, month - 1, day, adjustedHours, minutes, seconds);
//       const options: Intl.DateTimeFormatOptions = {
//         weekday: 'short',
//         year: 'numeric',
//         month: 'short',
//         minute: '2-digit',
//         hour12: true
//       };

//       return date.toLocaleString('en-US', options);
//     } catch (error) {
//       console.error('Error parsing date:', error);
//       return "Invalid Date";
//     }
//   };

//   const { data: trackingData, isFetching, isError } = useQuery({
//     queryKey: ['order-tracking', order.cartId],
//     queryFn: () => axiosInstance.request({
//       method: 'GET',
//       url: 'ecommerce/track-sale-order',
//       params: {
//         orderNo: order.cartId
//       }
//     }),
//     enabled: isOpen && !!order.cartId,
//     select: (response: any) => response.data,
//   });

//   // Calculate order totals
//   const calculateSubtotal = () => {
//     return order.cartItems?.reduce((sum, item) => sum + item.amount, 0) || 0;
//   };

//   const calculateTotalTax = () => {
//     return order.cartItems?.reduce((sum, item) => sum + (item.tax || 0), 0) || 0;
//   };

//   const calculateTotal = () => {
//     return calculateSubtotal() + calculateTotalTax() + (order.deliveryFee || 0);
//   };

//   const trackingInfo = trackingData?.orderTrackInfo;
//   const currentStatus = trackingInfo?.status || order.orderSatus;
//   const currentActivityType = trackingInfo?.activityType;
//   const isCancelled = currentActivityType === 'CANCELLED';
//   const isCompleted = currentStatus === 'COMPLETED';

//   const getStatusIndex = (status: string) => {
//     const statusOrder = ['PENDING', 'PACKING', 'SHIPPED', 'DELIVERED'];
//     return statusOrder.indexOf(status);
//   };

//   const renderStatusSteps = () => {
//     if (isCancelled) {
//       return (
//         <div className="flex items-start gap-4">
//           <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-red-500 text-white">
//             <XCircle className="w-5 h-5" />
//           </div>
//           <div className="flex-1 pt-1">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h4 className="font-medium text-gray-800">Cancelled</h4>
//                 {trackingInfo && (
//                   <p className="text-sm text-gray-500 mt-1">
//                     {formatTrackingDate(trackingInfo.activityDate)}
//                   </p>
//                 )}
//               </div>
//               <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                 Cancelled
//               </span>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     return ['PENDING', 'PACKING', 'SHIPPED', 'DELIVERED'].map((status, index) => {
//       const isCompletedStep = getStatusIndex(currentActivityType) >= index;
//       const isCurrent = status === currentActivityType;

//       return (
//         <div key={status} className="flex items-start gap-4">
//           <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
//             ${isCompletedStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
//             {isCompletedStep ? (
//               <CheckCircle className="w-5 h-5" />
//             ) : (
//               statusIcons[status as keyof typeof statusIcons] || <Package className="w-5 h-5" />
//             )}
//           </div>

//           <div className={`flex-1 pt-1 ${index === 3 ? '' : 'pb-6'}`}>
//             <div className="flex justify-between items-start">
//               <div>
//                 <h4 className={`font-medium ${isCompletedStep ? 'text-gray-800' : 'text-gray-500'}`}>
//                   {status.charAt(0) + status.slice(1).toLowerCase()}
//                 </h4>
//                 {isCurrent && trackingInfo && (
//                   <p className="text-sm text-gray-500 mt-1">
//                     {formatTrackingDate(trackingInfo.activityDate)}
//                   </p>
//                 )}
//               </div>
//               {isCurrent && (
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium 
//                   ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
//                   {isCompleted ? 'Completed' : 'In Progress'}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       );
//     });
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {isCancelled ? 'Order Cancelled' : isCompleted ? 'Order Completed' : 'Order Tracking'} - {order.cartId}
//           </DialogTitle>
//           <DialogDescription>
//             Detailed tracking information for this order
//           </DialogDescription>
//         </DialogHeader>

//         {isFetching ? (
//           <div className="text-center py-8">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//             <p className="mt-3 text-gray-600">Loading tracking information...</p>
//           </div>
//         ) : isError ? (
//           <div className="text-center py-8 text-red-500">
//             <p>Failed to load tracking information. Please try again later.</p>
//           </div>
//         ) : (
//           <div className="py-4">
//             {/* Order Summary */}
//             <div className="bg-gray-50 rounded-lg p-4 mb-6">
//               <div className="grid grid-cols-2 gap-4 md:gap-5">
//                 <div>
//                   <p className="text-sm text-gray-500">Order Date</p>
//                   <p className="font-medium">
//                     {formatTrackingDate(order.orderDate)}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Customer</p>
//                   <p className="font-medium">{order.customerName}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Total Amount</p>
//                   <p className="font-medium">{order.ccy} {calculateTotal().toFixed(2)}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Payment Method</p>
//                   <p className="font-medium">{order.paymentMethod}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Tracking Progress */}
//             <div className="mb-8">
//               <h3 className="text-lg font-semibold text-gray-700 mb-4">
//                 {isCancelled ? 'Cancellation Details' : isCompleted ? 'Completion Details' : 'Order Status'}
//               </h3>

//               <div className="relative">
//                 {!isCancelled && !isCompleted && (
//                   <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 -z-10"></div>
//                 )}
//                 <div className="space-y-8">
//                   {renderStatusSteps()}
//                 </div>
//               </div>
//             </div>

//             {/* Detailed Tracking Info */}
//             {trackingInfo && (
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-700 mb-4">Tracking Details</h3>
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <div className="flex justify-between items-start">
//                     <div className="flex items-start gap-3">
//                       <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
//                         ${statusColors[currentActivityType as keyof typeof statusColors] || 'bg-gray-100'}`}>
//                         {statusIcons[currentActivityType as keyof typeof statusIcons] || <Package className="w-5 h-5" />}
//                       </div>
//                       <div>
//                         <h4 className="font-medium text-gray-800">
//                           {currentActivityType?.charAt(0) + currentActivityType?.slice(1).toLowerCase()}
//                         </h4>
//                         <p className="text-sm text-gray-600 mt-1">
//                           {formatTrackingDate(trackingInfo.activityDate)}
//                         </p>
//                         {trackingInfo.comment && (
//                           <p className="text-sm text-gray-600 mt-2">{trackingInfo.comment}</p>
//                         )}
//                       </div>
//                     </div>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium 
//                       ${statusColors[currentStatus as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
//                       {currentStatus}
//                     </span>
//                   </div>
//                   {trackingInfo.docLink && (
//                     <a href={trackingInfo.docLink} target="_blank" rel="noopener noreferrer"
//                       className="inline-block text-sm text-blue-500 mt-2 hover:underline">
//                       View Document
//                     </a>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };

// const UpdateOrderTracking: React.FC<{
//   order: Order;
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess?: () => void;
// }> = ({ order, isOpen, onClose, onSuccess }) => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [isUploading, setIsUploading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     control,
//     setValue,
//     watch,
//     reset,
//     formState: { errors, isSubmitting }
//   } = useForm({
//     defaultValues: {
//       status: '',
//       activityType: '',
//       comment: '',
//       docLink: ''
//     }
//   });

//   // Activity type options
//   const activityTypeOptions = [
//     { id: 'PACKING', name: 'Packed' },
//     { id: 'SHIPPED', name: 'Shipped' },
//     { id: 'DELIVERED', name: 'Delivered' },
//     { id: 'CANCELLED', name: 'Cancelled' },
//   ];

//   // Status options
//   const statusOptions = [
//     { id: 'IN_PROGRESS', name: 'In Progress' },
//     { id: 'COMPLETED', name: 'Completed' },
//     { id: 'PENDING', name: 'Pending' },
//     { id: 'CANCELLED', name: 'Cancelled' },
//   ];

//   const activityIcons = {
//     PACKING: <Package className="w-5 h-5" />,
//     SHIPPED: <Truck className="w-5 h-5" />,
//     DELIVERED: <CheckCircle className="w-5 h-5" />,
//     CANCELLED: <XCircle className="w-5 h-5" />,
//   };

//   // Handle file upload
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       // Check file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error('File size must be less than 5MB');
//         return;
//       }

//       // Check file type
//       const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
//       if (!allowedTypes.includes(file.type)) {
//         toast.error('Please select a JPEG, PNG, or PDF file');
//         return;
//       }

//       setSelectedFile(file);
//       setValue('docLink', file.name);

//       // Create preview for images
//       if (file.type.startsWith('image/')) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           setPreviewUrl(e.target?.result as string);
//         };
//         reader.readAsDataURL(file);
//       } else {
//         setPreviewUrl(null);
//       }
//     }
//   };

//   // Upload file to server
//   const uploadFile = async (file: File): Promise<string> => {
//     // Simulate file upload - replace with your actual upload logic
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve(`https://example.com/uploads/${file.name}`);
//       }, 1000);
//     });
//   };

//   // Submit form
//   const onSubmit = async (data: any) => {
//     try {
//       setIsUploading(true);

//       let docLink = data.docLink;

//       // Upload file if selected
//       if (selectedFile) {
//         try {
//           docLink = await uploadFile(selectedFile);
//         } catch (error) {
//           toast.error('Failed to upload file');
//           return;
//         }
//       }

//       // Prepare payload
//       const payload = {
//         orderNo: order.cartId,
//         status: data.status,
//         activityType: data.activityType,
//         comment: data.comment,
//         docLink: docLink,
//         entityCode: order.storeCode
//       };

//       // Call API to update tracking
//       const response = await axiosInstance.request({
//         method: 'POST',
//         url: 'ecommerce/save-order-track',
//         data: payload
//       });

//       if (response.data?.code === '000') {
//         toast.success('Tracking updated successfully');
//         reset();
//         setSelectedFile(null);
//         setPreviewUrl(null);
//         onSuccess?.();
//         onClose();
//       } else {
//         toast.error(response.data?.desc || 'Failed to update tracking');
//       }
//     } catch (error: any) {
//       console.error('Error updating tracking:', error);
//       toast.error(error?.response?.data?.message || 'Error updating tracking');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const selectedActivityType = watch('activityType');

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="text-center">
//             Update Tracking for Order #{order.cartId}
//           </DialogTitle>
//           <DialogDescription className="text-center">
//             Update the order status and tracking information
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Order Summary */}
//           <div className="bg-gray-50 rounded-lg p-4">
//             <h4 className="font-medium mb-3">Order Summary</h4>
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div>
//                 <span className="text-gray-500">Customer:</span>
//                 <p className="font-medium">{order.customerName}</p>
//               </div>
//               <div>
//                 <span className="text-gray-500">Order Date:</span>
//                 <p className="font-medium">{order.orderDate}</p>
//               </div>
//               <div>
//                 <span className="text-gray-500">Current Status:</span>
//                 <Badge className={`${getStatusColor(order.orderSatus)} text-xs px-2 py-1 mt-1`}>
//                   {order.orderSatus}
//                 </Badge>
//               </div>
//               <div>
//                 <span className="text-gray-500">Items:</span>
//                 <p className="font-medium">{order.cartItems.length} items</p>
//               </div>
//             </div>
//           </div>

//           {/* Status Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Status */}
//             <div className="space-y-2">
//               <Label htmlFor="status">Status *</Label>
//               <select
//                 id="status"
//                 {...register('status', { required: 'Status is required' })}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select Status</option>
//                 {statusOptions.map((option) => (
//                   <option key={option.id} value={option.id}>
//                     {option.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.status && (
//                 <p className="text-red-500 text-sm">{errors.status.message as string}</p>
//               )}
//             </div>

//             {/* Activity Type */}
//             <div className="space-y-2">
//               <Label htmlFor="activityType">Activity Type *</Label>
//               <select
//                 id="activityType"
//                 {...register('activityType', { required: 'Activity type is required' })}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select Activity Type</option>
//                 {activityTypeOptions.map((option) => (
//                   <option key={option.id} value={option.id}>
//                     {option.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.activityType && (
//                 <p className="text-red-500 text-sm">{errors.activityType.message as string}</p>
//               )}
//             </div>
//           </div>

//           {/* Activity Icon Preview */}
//           {selectedActivityType && (
//             <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
//               <div className="flex-shrink-0">
//                 {activityIcons[selectedActivityType as keyof typeof activityIcons] ||
//                   <Package className="w-5 h-5" />}
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-blue-800">
//                   Selected: {activityTypeOptions.find(opt => opt.id === selectedActivityType)?.name}
//                 </p>
//                 <p className="text-xs text-blue-600">
//                   This will update the order's tracking status
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Comments */}
//           <div className="space-y-2">
//             <Label htmlFor="comment">Comments</Label>
//             <Textarea
//               id="comment"
//               {...register('comment')}
//               placeholder="Enter any comments about this update (optional)"
//               className="min-h-[100px] resize-none"
//             />
//           </div>

//           {/* File Upload */}
//           <div className="space-y-2">
//             <Label htmlFor="document">Upload Document</Label>
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
//               <input
//                 type="file"
//                 id="document"
//                 accept=".jpg,.jpeg,.png,.pdf"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//               <Label
//                 htmlFor="document"
//                 className="cursor-pointer block"
//               >
//                 <div className="flex flex-col items-center justify-center gap-2">
//                   <Package className="w-8 h-8 text-gray-400" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">
//                       {selectedFile ? selectedFile.name : 'Click to upload document'}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       PNG, JPG, PDF up to 5MB
//                     </p>
//                   </div>
//                 </div>
//               </Label>
//             </div>

//             {/* File Preview */}
//             {previewUrl && (
//               <div className="mt-3">
//                 <Label>Preview:</Label>
//                 <div className="mt-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
//                   {selectedFile?.type === 'application/pdf' ? (
//                     <div className="flex items-center gap-2">
//                       <Package className="w-8 h-8 text-red-500" />
//                       <div>
//                         <p className="text-sm font-medium">{selectedFile.name}</p>
//                         <p className="text-xs text-gray-500">PDF Document</p>
//                       </div>
//                     </div>
//                   ) : (
//                     <img
//                       src={previewUrl}
//                       alt="Document preview"
//                       className="max-w-full max-h-32 object-contain mx-auto rounded"
//                     />
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Selected File Info */}
//             {selectedFile && !previewUrl && (
//               <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-2">
//                 <p><strong>Selected:</strong> {selectedFile.name}</p>
//                 <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
//                 <p><strong>Type:</strong> {selectedFile.type}</p>
//               </div>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onClose}
//               disabled={isSubmitting || isUploading}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={isSubmitting || isUploading}
//               className="min-w-[120px]"
//             >
//               {(isSubmitting || isUploading) ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                   Updating...
//                 </>
//               ) : (
//                 'Update Tracking'
//               )}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// // DynamicTable Component
// const DynamicTable: React.FC<DynamicTableProps> = ({
//   columns,
//   data,
//   itemsPerPage = 5,
//   onViewDetails,
//   onTrackOrder,
//   onUpdateTracking
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const totalPages = Math.ceil(data.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentData = data.slice(startIndex, endIndex);

//   const handleViewDetails = (order: Order) => {
//     setSelectedOrder(order);
//     setIsModalOpen(true);
//     onViewDetails(order);
//   };

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   // Calculate order totals for the modal
//   const calculateSubtotal = (order: Order) => {
//     return order.cartItems?.reduce((sum, item) => sum + item.amount, 0) || 0;
//   };

//   const calculateTotalTax = (order: Order) => {
//     return order.cartItems?.reduce((sum, item) => sum + (item.tax || 0), 0) || 0;
//   };

//   const calculateTotal = (order: Order) => {
//     return calculateSubtotal(order) + calculateTotalTax(order) + (order.deliveryFee || 0);
//   };

//   // Update columns to include the click handlers
//   const columnsWithHandler = columns.map(col => {
//     if (col.key === 'actions') {
//       return {
//         ...col,
//         render: (text: string, record: Order) => (
//           <div className="flex items-center gap-1">
//             <Button
//               variant="ghost"
//               size="sm"
//               className="p-1"
//               onClick={() => onTrackOrder(record)}
//               title="Track Order"
//             >
//               <Truck className="w-4 h-4" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="sm"
//               className="p-1"
//               onClick={() => onUpdateTracking(record)}
//               title="Update Tracking"
//             >
//               <Package className="w-4 h-4" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="sm"
//               className="p-1"
//               onClick={() => handleViewDetails(record)}
//               title="View Details"
//             >
//               <Eye className="w-4 h-4" />
//             </Button>
//           </div>
//         )
//       };
//     }
//     return col;
//   });

//   return (
//     <>
//       <div className="w-full overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="border-b-2 border-gray-200">
//               {columnsWithHandler.map((column) => (
//                 <th
//                   key={column.key}
//                   className="text-left p-3 font-bold text-sm text-gray-700"
//                   style={{ width: column.width ? `${column.width}px` : 'auto' }}
//                 >
//                   {column.title}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {currentData.map((item, index) => (
//               <tr
//                 key={item.cartId}
//                 className={`border-b border-gray-200 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
//               >
//                 {columnsWithHandler.map((column) => (
//                   <td key={column.key} className="p-3 text-sm">
//                     {column.render
//                       ? column.render(item[column.dataIndex as keyof Order], item, index)
//                       : getDisplayValue(item[column.dataIndex as keyof Order])
//                     }
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
//         <p className="text-sm text-gray-500">
//           Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} Orders
//         </p>
//         <div className="flex items-center gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="text-xs"
//           >
//             Previous
//           </Button>

//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <Button
//               key={page}
//               variant={currentPage === page ? "default" : "outline"}
//               size="sm"
//               onClick={() => handlePageChange(page)}
//               className="w-8 h-8 p-0 text-xs"
//             >
//               {page}
//             </Button>
//           ))}

//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="text-xs"
//           >
//             Next
//           </Button>
//         </div>
//       </div>

//       {/* Order Details Modal */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader className='flex flex-col'>
//             <DialogTitle>Order Details - {selectedOrder?.cartId || 'N/A'}</DialogTitle>
//             <DialogDescription>
//               Detailed information about the selected order
//             </DialogDescription>
//           </DialogHeader>

//           {selectedOrder && (
//             <div className="py-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">Order Date:</p>
//                   <p className="text-sm">{getDisplayValue(selectedOrder.orderDate)}</p>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">Customer:</p>
//                   <p className="text-sm">{getDisplayValue(selectedOrder.customerName)}</p>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">Total Amount:</p>
//                   <p className="text-sm font-semibold">
//                     {selectedOrder.ccy || 'N/A'} {selectedOrder.totalAmount?.toFixed(2) || '0.00'}
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">Payment Method:</p>
//                   <p className="text-sm">{getDisplayValue(selectedOrder.paymentMethod)}</p>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">Order Status:</p>
//                   <Badge className={`${getStatusColor(selectedOrder.orderSatus)} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>
//                     {getStatusIcon(selectedOrder.orderSatus)}
//                     {getDisplayValue(selectedOrder.orderSatus)}
//                   </Badge>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">Payment Status:</p>
//                   <Badge className={`${getStatusColor(selectedOrder.paymentStatus)} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>
//                     {getStatusIcon(selectedOrder.paymentStatus)}
//                     {getDisplayValue(selectedOrder.paymentStatus)}
//                   </Badge>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">Channel:</p>
//                   <p className="text-sm">{getDisplayValue(selectedOrder.channel)}</p>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">Delivery Option:</p>
//                   <p className="text-sm">{getDisplayValue(selectedOrder.deliveryOption)}</p>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">Coupon Code:</p>
//                   <p className="text-sm">{getDisplayValue(selectedOrder.couponCode)}</p>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm font-medium">Delivery Fee:</p>
//                   <p className="text-sm">
//                     {selectedOrder.ccy || 'N/A'} {selectedOrder.deliveryFee?.toFixed(2) || '0.00'}
//                   </p>
//                 </div>
//               </div>

//               <div className="border-t pt-4">
//                 <h4 className="font-medium mb-3">Order Items</h4>
//                 <div className="space-y-3">
//                   {selectedOrder.cartItems.map((item, index) => (
//                     <div key={index} className="flex items-center gap-3 p-2 border rounded-lg">
//                       <div className="w-12 h-12 relative rounded-md overflow-hidden">
//                         <Image
//                           src={item.picture || `${placeholder.src}`}
//                           alt={item.itemName}
//                           fill
//                           className="object-cover"
//                           onError={(e) => {
//                             (e.target as HTMLImageElement).src = `${placeholder.src}`;
//                           }}
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium">{getDisplayValue(item.itemName)}</p>
//                         <p className="text-xs text-gray-500">
//                           Code: {getDisplayValue(item.itemCode)} |
//                           Qty: {getDisplayValue(item.quantity)} |
//                           {selectedOrder.ccy || 'N/A'} {item.price?.toFixed(2) || '0.00'} each
//                         </p>
//                       </div>
//                       <div className="text-sm font-semibold">
//                         {selectedOrder.ccy || 'N/A'} {item.amount?.toFixed(2) || '0.00'}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Order Totals Calculation */}
//                 <div className="border-t-2 border-gray-300 pt-4 mt-6">
//                   <div className="flex justify-end">
//                     <div className="w-64">
//                       <div className="flex justify-between py-2 text-gray-700">
//                         <span>Subtotal:</span>
//                         <span className="font-medium">
//                           {selectedOrder.ccy} {calculateSubtotal(selectedOrder).toFixed(2)}
//                         </span>
//                       </div>
//                       <div className="flex justify-between py-2 text-gray-700">
//                         <span>Tax:</span>
//                         <span className="font-medium">
//                           {selectedOrder.ccy} {calculateTotalTax(selectedOrder).toFixed(2)}
//                         </span>
//                       </div>
//                       <div className="flex justify-between py-2 text-gray-700">
//                         <span>Delivery Fee:</span>
//                         <span className="font-medium">
//                           {selectedOrder.ccy} {selectedOrder.deliveryFee?.toFixed(2) || '0.00'}
//                         </span>
//                       </div>
//                       <div className="flex justify-between py-3 text-lg font-bold text-green-600 border-t border-gray-300">
//                         <span>Total:</span>
//                         <span>
//                           {selectedOrder.ccy} {calculateTotal(selectedOrder).toFixed(2)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {selectedOrder.deliveryAddress && (
//                 <div className="border-t pt-4 mt-4">
//                   <h4 className="font-medium mb-2">Delivery Address</h4>
//                   <p className="text-sm">
//                     {getDisplayValue(selectedOrder.deliveryAddress.street)}<br />
//                     {selectedOrder.deliveryAddress.city && `${selectedOrder.deliveryAddress.city}, `}
//                     {getDisplayValue(selectedOrder.deliveryAddress.state)}<br />
//                     {selectedOrder.deliveryAddress.postCode && `${selectedOrder.deliveryAddress.postCode}, `}
//                     {getDisplayValue(selectedOrder.deliveryAddress.country)}
//                     {selectedOrder.deliveryAddress.landmark && ` (Landmark: ${selectedOrder.deliveryAddress.landmark})`}
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// // Mobile Order Card Component
// const MobileOrderCard: React.FC<MobileOrderCardProps> = ({
//   order,
//   onViewDetails,
//   onTrackOrder,
//   onUpdateTracking
// }) => {
//   const firstItem = order.cartItems[0];

//   return (
//     <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-semibold text-gray-900">{getDisplayValue(order.cartId)}</p>
//           <p className="text-xs text-gray-500">{getDisplayValue(order.orderDate)}</p>
//         </div>
//         <Badge className={`${getStatusColor(order.orderSatus)} text-xs px-2 py-1 flex items-center gap-1`}>
//           {getStatusIcon(order.orderSatus)}
//           {getDisplayValue(order.orderSatus)}
//         </Badge>
//       </div>

//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 relative rounded-md overflow-hidden">
//           <Image
//             src={firstItem.picture || `${placeholder.src}`}
//             alt={firstItem.itemName}
//             fill
//             className="object-cover"
//             onError={(e) => {
//               (e.target as HTMLImageElement).src = `${placeholder.src}`;
//             }}
//           />
//         </div>
//         <div className="flex-1">
//           <p className="text-sm font-medium text-gray-900">{getDisplayValue(firstItem.itemName)}</p>
//           <p className="text-xs text-gray-500">
//             {order.cartItems.length} item{order.cartItems.length !== 1 ? 's' : ''} • {order.ccy || 'N/A'} {order.totalAmount?.toFixed(2) || '0.00'}
//           </p>
//         </div>
//       </div>

//       <div className="flex items-center justify-between pt-2 border-t border-gray-200">
//         <div className="flex items-center gap-3">
//           <Avatar className="w-6 h-6">
//             <AvatarFallback className="bg-blue-500 text-white text-xs">
//               {order.customerName ? order.customerName.split(' ').map(n => n[0]).join('') : 'GC'}
//             </AvatarFallback>
//           </Avatar>
//           <p className="text-xs text-gray-600">{getDisplayValue(order.customerName)}</p>
//         </div>
//         <div className="flex items-center gap-1">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="p-1"
//             onClick={() => onTrackOrder(order)}
//             title="Track Order"
//           >
//             <Truck className="w-4 h-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="p-1"
//             onClick={() => onUpdateTracking(order)}
//             title="Update Tracking"
//           >
//             <Package className="w-4 h-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="p-1"
//             onClick={() => onViewDetails(order)}
//             title="View Details"
//           >
//             <Eye className="w-4 h-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function OrderHistory(): React.ReactElement {
//   const { user } = useUser();
//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ['recent-orders'],
//     queryFn: () => axiosInstance.request({
//       url: '/store-dashboard/fetch-recent-orders',
//       method: 'GET',
//       params: {
//         storeCode: user?.storeCode,
//         entityCode: user?.entityCode
//       }
//     })
//   });

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
//   const [isUpdateTrackingModalOpen, setIsUpdateTrackingModalOpen] = useState(false);

//   // Format API data for the table
//   const orders: Order[] = data?.data?.data || [];

//   // Filter orders based on search term
//   const filteredOrders = orders.filter(order =>
//     order.cartId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     order.orderDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (order.paymentMethod && order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const handleViewDetails = (order: Order) => {
//     setSelectedOrder(order);
//     setIsDetailsModalOpen(true);
//   };

//   const handleTrackOrder = (order: Order) => {
//     setSelectedOrder(order);
//     setIsTrackingModalOpen(true);
//   };

//   const handleUpdateTracking = (order: Order) => {
//     setSelectedOrder(order);
//     setIsUpdateTrackingModalOpen(true);
//   };

//   const handleUpdateSuccess = () => {
//     // Refetch orders to get updated data
//     refetch();
//   };

//   const columns: Column[] = [
//     {
//       title: 'Product',
//       dataIndex: 'cartItems',
//       key: 'product',
//       width: 200,
//       render: (items: CartItem[], record: Order) => {
//         const firstItem = items[0];
//         return (
//           <div className="flex items-center gap-3">
//             <div className="w-13 h-10 relative rounded-md overflow-hidden">
//               <Image
//                 src={firstItem.picture || `${placeholder.src}`}
//                 alt={firstItem.itemName}
//                 fill
//                 className="object-cover"
//                 onError={(e) => {
//                   (e.target as HTMLImageElement).src = `${placeholder.src}`;
//                 }}
//               />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-900">{getDisplayValue(firstItem.itemName)}</p>
//               <p className="text-xs text-gray-500">Cart: {items.length} item{items.length !== 1 ? 's' : ''}</p>
//             </div>
//           </div>
//         );
//       },
//     },
//     {
//       title: 'Order ID & Date',
//       dataIndex: 'cartId',
//       key: 'id',
//       width: 180,
//       render: (text: string, record: Order) => (
//         <div>
//           <p className="text-sm font-semibold text-gray-900">{getDisplayValue(text)}</p>
//           <p className="text-xs text-gray-500">{getDisplayValue(record.orderDate)}</p>
//         </div>
//       ),
//     },
//     {
//       title: 'Customer',
//       dataIndex: 'customerName',
//       key: 'customer',
//       width: 150,
//       render: (text: string) => (
//         <div className="flex items-center gap-3">
//           <Avatar className="w-8 h-8">
//             <AvatarFallback className="bg-blue-500 text-white text-xs">
//               {text ? text.split(' ').map(n => n[0]).join('') : 'GC'}
//             </AvatarFallback>
//           </Avatar>
//           <div>
//             <p className="text-sm font-medium text-gray-900">{getDisplayValue(text)}</p>
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: 'Amount',
//       dataIndex: 'totalAmount',
//       key: 'amount',
//       width: 100,
//       render: (text: number, record: Order) => (
//         <span className="text-sm font-semibold text-green-600">
//           {record.ccy || 'N/A'} {text?.toFixed(2) || '0.00'}
//         </span>
//       ),
//     },
//     {
//       title: 'Status',
//       dataIndex: 'orderSatus',
//       key: 'status',
//       width: 120,
//       render: (text: string) => (
//         <Badge className={`${getStatusColor(text)} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>
//           {getStatusIcon(text)}
//           {getDisplayValue(text)}
//         </Badge>
//       ),
//     },
//     {
//       title: 'Payment',
//       dataIndex: 'paymentStatus',
//       key: 'payment',
//       width: 120,
//       render: (text: string) => (
//         <Badge className={`${getStatusColor(text)} text-xs px-2 py-1 flex items-center gap-1 w-fit`}>
//           {getStatusIcon(text)}
//           {getDisplayValue(text)}
//         </Badge>
//       ),
//     },
//     {
//       title: 'Actions',
//       dataIndex: 'actions',
//       key: 'actions',
//       width: 120,
//       render: (text: string, record: Order) => (
//         <div className="flex items-center gap-1">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="p-1"
//             onClick={() => handleTrackOrder(record)}
//             title="Track Order"
//           >
//             <Truck className="w-4 h-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="p-1"
//             onClick={() => handleUpdateTracking(record)}
//             title="Update Tracking"
//           >
//             <Package className="w-4 h-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="p-1"
//             onClick={() => handleViewDetails(record)}
//             title="View Details"
//           >
//             <Eye className="w-4 h-4" />
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-subtle">
//       <div className="container mx-auto p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-foreground mb-2">
//                 Orders Management
//               </h1>
//               <p className="text-muted-foreground">
//                 View and manage customer orders
//               </p>
//             </div>
//           </div>
//           <div className="text-right">
//             <p className="text-2xl font-bold text-foreground">{orders.length}</p>
//             <p className="text-sm text-muted-foreground">Total Orders</p>
//           </div>
//         </div>

//         <div className="space-y-6">
//           {/* Search and Actions */}
//           <div className="flex items-center justify-between">
//             <div className="relative flex-1 max-w-sm">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search orders..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>

//             <div className="flex items-center gap-2">
//               <Button variant="outline" className="transition-smooth">
//                 Export Orders
//               </Button>
//               <Button variant="secondary" className="transition-smooth">
//                 Generate Report
//               </Button>
//             </div>
//           </div>

//           <Card className="border-gray-200 shadow-sm">
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-base lg:text-lg font-semibold text-gray-900">
//                   Recent Orders
//                 </CardTitle>
//                 <Button variant="outline" size="sm" className="gap-2">
//                   <Download className="w-4 h-4" />
//                   <span className="hidden sm:inline">Export</span>
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               {isLoading ? (
//                 <div className="flex justify-center items-center h-40">
//                   <p className="text-gray-500">Loading orders...</p>
//                 </div>
//               ) : error ? (
//                 <div className="flex justify-center items-center h-40">
//                   <p className="text-red-500">Error loading orders</p>
//                 </div>
//               ) : orders.length === 0 ? (
//                 <div className="flex justify-center items-center h-40">
//                   <p className="text-gray-500">No orders found</p>
//                 </div>
//               ) : (
//                 <>
//                   {/* Mobile view - Stack layout */}
//                   <div className="block lg:hidden space-y-4">
//                     {filteredOrders.map((order) => (
//                       <MobileOrderCard
//                         key={order.cartId}
//                         order={order}
//                         onViewDetails={handleViewDetails}
//                         onTrackOrder={handleTrackOrder}
//                         onUpdateTracking={handleUpdateTracking}
//                       />
//                     ))}
//                   </div>

//                   {/* Desktop view - Dynamic Table */}
//                   <div className="hidden lg:block">
//                     <DynamicTable
//                       columns={columns}
//                       data={filteredOrders}
//                       onViewDetails={handleViewDetails}
//                       onTrackOrder={handleTrackOrder}
//                       onUpdateTracking={handleUpdateTracking}
//                     />
//                   </div>
//                 </>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Order Tracking Modal */}
//       {selectedOrder && (
//         <OrderTracking
//           order={selectedOrder}
//           isOpen={isTrackingModalOpen}
//           onClose={() => setIsTrackingModalOpen(false)}
//         />
//       )}

//       {/* Update Tracking Modal */}
//       {selectedOrder && (
//         <UpdateOrderTracking
//           order={selectedOrder}
//           isOpen={isUpdateTrackingModalOpen}
//           onClose={() => setIsUpdateTrackingModalOpen(false)}
//           onSuccess={handleUpdateSuccess}
//         />
//       )}
//     </div>
//   );
// }

'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Search, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import useUser from '@/store/userStore';
import DynamicTable from '../../../../components/Admin/orders/dynamic-table';
import { OrderTracking, UpdateOrderTracking } from '../../../../components/Admin/orders/order-tracking';
import MobileOrderCard from '../../../../components/Admin/orders/mobile-order-card';

// Type definitions (keep only what's needed for the main component)
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
  const { user } = useUser();
  const { data, isLoading, error, refetch } = useQuery({
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
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isUpdateTrackingModalOpen, setIsUpdateTrackingModalOpen] = useState(false);

  const orders: Order[] = data?.data?.data || [];
  const filteredOrders = orders.filter(order =>
    order.cartId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.paymentMethod && order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleTrackOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsTrackingModalOpen(true);
  };

  const handleUpdateTracking = (order: Order) => {
    setSelectedOrder(order);
    setIsUpdateTrackingModalOpen(true);
  };

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
                        onTrackOrder={handleTrackOrder}
                        onUpdateTracking={handleUpdateTracking}
                      />
                    ))}
                  </div>

                  {/* Desktop view - Dynamic Table */}
                  <div className="hidden lg:block">
                    <DynamicTable
                      data={filteredOrders}
                      onTrackOrder={handleTrackOrder}
                      onUpdateTracking={handleUpdateTracking}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Tracking Modal */}
      {selectedOrder && (
        <OrderTracking
          order={selectedOrder}
          isOpen={isTrackingModalOpen}
          onClose={() => setIsTrackingModalOpen(false)}
        />
      )}

      {/* Update Tracking Modal */}
      {selectedOrder && (
        <UpdateOrderTracking
          order={selectedOrder}
          isOpen={isUpdateTrackingModalOpen}
          onClose={() => setIsUpdateTrackingModalOpen(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}