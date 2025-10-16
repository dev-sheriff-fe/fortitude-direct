'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Order } from './dynamic-table'

// Tracking related interfaces
interface TrackingStep {
  id: number;
  orderNo: string;
  entityCode: string;
  status: string;
  activityDate: string;
  activityType: 'PENDING' | 'PACKING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  comment?: string;
  docLink?: string;
}

interface OrderTrackingProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

interface UpdateOrderTrackingProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const statusIcons = {
  PENDING: <Clock className="w-6 h-6" />,
  PACKING: <Package className="w-6 h-6" />,
  SHIPPED: <Truck className="w-6 h-6" />,
  DELIVERED: <CheckCircle className="w-6 h-6" />,
  CANCELLED: <XCircle className="w-6 h-6" />,
};

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PACKING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-green-100 text-green-800',
};

// Order Tracking Component
export const OrderTracking: React.FC<OrderTrackingProps> = ({
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

  const { data: trackingData, isFetching, isError } = useQuery({
    queryKey: ['order-tracking', order.cartId],
    queryFn: () => axiosInstance.request({
      method: 'GET',
      url: 'ecommerce/track-sale-order',
      params: {
        orderNo: order.cartId
      }
    }),
    enabled: isOpen && !!order.cartId,
    select: (response: any) => response.data,
  });

  // Calculate order totals
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

  const getStatusIndex = (status: string) => {
    const statusOrder = ['PENDING', 'PACKING', 'SHIPPED', 'DELIVERED'];
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

    return ['PENDING', 'PACKING', 'SHIPPED', 'DELIVERED'].map((status, index) => {
      const isCompletedStep = getStatusIndex(currentActivityType) >= index;
      const isCurrent = status === currentActivityType;

      return (
        <div key={status} className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
            ${isCompletedStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
            {isCompletedStep ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              statusIcons[status as keyof typeof statusIcons] || <Package className="w-5 h-5" />
            )}
          </div>

          <div className={`flex-1 pt-1 ${index === 3 ? '' : 'pb-6'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h4 className={`font-medium ${isCompletedStep ? 'text-gray-800' : 'text-gray-500'}`}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
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
        <DialogHeader>
          <DialogTitle>
            {isCancelled ? 'Order Cancelled' : isCompleted ? 'Order Completed' : 'Order Tracking'} - {order.cartId}
          </DialogTitle>
          <DialogDescription>
            Detailed tracking information for this order
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
            {/* Order Summary */}
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

            {/* Tracking Progress */}
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

            {/* Detailed Tracking Info */}
            {trackingInfo && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Tracking Details</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
                        ${statusColors[currentActivityType as keyof typeof statusColors] || 'bg-gray-100'}`}>
                        {statusIcons[currentActivityType as keyof typeof statusIcons] || <Package className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {currentActivityType?.charAt(0) + currentActivityType?.slice(1).toLowerCase()}
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Update Order Tracking Component
export const UpdateOrderTracking: React.FC<UpdateOrderTrackingProps> = ({ 
  order, 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      status: '',
      activityType: '',
      comment: '',
      docLink: ''
    }
  });

  // Activity type options
  const activityTypeOptions = [
    { id: 'PACKING', name: 'Packed' },
    { id: 'SHIPPED', name: 'Shipped' },
    { id: 'DELIVERED', name: 'Delivered' },
    { id: 'CANCELLED', name: 'Cancelled' },
  ];

  // Status options
  const statusOptions = [
    { id: 'IN_PROGRESS', name: 'In Progress' },
    { id: 'COMPLETED', name: 'Completed' },
    { id: 'PENDING', name: 'Pending' },
    { id: 'CANCELLED', name: 'Cancelled' },
  ];

  const activityIcons = {
    PACKING: <Package className="w-5 h-5" />,
    SHIPPED: <Truck className="w-5 h-5" />,
    DELIVERED: <CheckCircle className="w-5 h-5" />,
    CANCELLED: <XCircle className="w-5 h-5" />,
  };

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

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a JPEG, PNG, or PDF file');
        return;
      }

      setSelectedFile(file);
      setValue('docLink', file.name);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  // Upload file to server
  const uploadFile = async (file: File): Promise<string> => {
    // Simulate file upload - replace with your actual upload logic
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`https://example.com/uploads/${file.name}`);
      }, 1000);
    });
  };

  // Submit form
  const onSubmit = async (data: any) => {
    try {
      setIsUploading(true);

      let docLink = data.docLink;

      // Upload file if selected
      if (selectedFile) {
        try {
          docLink = await uploadFile(selectedFile);
        } catch (error) {
          toast.error('Failed to upload file');
          return;
        }
      }

      // Prepare payload
      const payload = {
        orderNo: order.cartId,
        status: data.status,
        activityType: data.activityType,
        comment: data.comment,
        docLink: docLink,
        entityCode: order.storeCode
      };

      // Call API to update tracking
      const response = await axiosInstance.request({
        method: 'POST',
        url: 'ecommerce/save-order-track',
        data: payload
      });

      if (response.data?.code === '000') {
        toast.success('Tracking updated successfully');
        reset();
        setSelectedFile(null);
        setPreviewUrl(null);
        onSuccess?.();
        onClose();
      } else {
        toast.error(response.data?.desc || 'Failed to update tracking');
      }
    } catch (error: any) {
      console.error('Error updating tracking:', error);
      toast.error(error?.response?.data?.message || 'Error updating tracking');
    } finally {
      setIsUploading(false);
    }
  };

  const selectedActivityType = watch('activityType');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            Update Tracking for Order #{order.cartId}
          </DialogTitle>
          <DialogDescription className="text-center">
            Update the order status and tracking information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-3">Order Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Customer:</span>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <span className="text-gray-500">Order Date:</span>
                <p className="font-medium">{order.orderDate}</p>
              </div>
              <div>
                <span className="text-gray-500">Current Status:</span>
                <Badge className={`${getStatusColor(order.orderSatus)} text-xs px-2 py-1 mt-1`}>
                  {order.orderSatus}
                </Badge>
              </div>
              <div>
                <span className="text-gray-500">Items:</span>
                <p className="font-medium">{order.cartItems.length} items</p>
              </div>
            </div>
          </div>

          {/* Status Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                {...register('status', { required: 'Status is required' })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                {statusOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message as string}</p>
              )}
            </div>

            {/* Activity Type */}
            <div className="space-y-2">
              <Label htmlFor="activityType">Activity Type *</Label>
              <select
                id="activityType"
                {...register('activityType', { required: 'Activity type is required' })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Activity Type</option>
                {activityTypeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              {errors.activityType && (
                <p className="text-red-500 text-sm">{errors.activityType.message as string}</p>
              )}
            </div>
          </div>

          {/* Activity Icon Preview */}
          {selectedActivityType && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                {activityIcons[selectedActivityType as keyof typeof activityIcons] ||
                  <Package className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Selected: {activityTypeOptions.find(opt => opt.id === selectedActivityType)?.name}
                </p>
                <p className="text-xs text-blue-600">
                  This will update the order's tracking status
                </p>
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comment">Comments</Label>
            <Textarea
              id="comment"
              {...register('comment')}
              placeholder="Enter any comments about this update (optional)"
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="document">Upload Document</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                id="document"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Label
                htmlFor="document"
                className="cursor-pointer block"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Package className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedFile ? selectedFile.name : 'Click to upload document'}
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF up to 5MB
                    </p>
                  </div>
                </div>
              </Label>
            </div>

            {/* File Preview */}
            {previewUrl && (
              <div className="mt-3">
                <Label>Preview:</Label>
                <div className="mt-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
                  {selectedFile?.type === 'application/pdf' ? (
                    <div className="flex items-center gap-2">
                      <Package className="w-8 h-8 text-red-500" />
                      <div>
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">PDF Document</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Document preview"
                      className="max-w-full max-h-32 object-contain mx-auto rounded"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Selected File Info */}
            {selectedFile && !previewUrl && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-2">
                <p><strong>Selected:</strong> {selectedFile.name}</p>
                <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <p><strong>Type:</strong> {selectedFile.type}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting || isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="min-w-[120px]"
            >
              {(isSubmitting || isUploading) ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Tracking'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderTracking;