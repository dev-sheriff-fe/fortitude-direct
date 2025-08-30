// hooks/useProductMutation.ts

import axiosInstance from '@/utils/fetch-function';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

export const useProductMutation = () => {
  const router = useRouter();

  return useMutation(
   {
     mutationFn: (data: any) => axiosInstance.request({
      method: "POST",
      url: "stock-management/save-update",
      data: data,
    }),
      onSuccess: (data) => {
        if (data?.data?.code !== '000') {
          toast.error(data?.data?.desc || 'Error saving product');
          return;
        }
        
        const message = 'Product updated successfully'
        toast.success(message);
        router.refresh();
      },
      onError: (error: any) => {
        console.error('Product mutation error:', error);
        
        if (error?.response?.data) {
          if (error.response.status === 400) {
            toast.error('Bad request: ' + (error.response.data.message || 'Unknown error'));
          } else if (error.response.status === 422) {
            toast.error(`Error saving product`);
          } else if (error.response.status === 500) {
            toast.error(`Error saving product`);
          }
        } else {
          toast.error(`Error saving product`);
        }
    }
   }
  );
};