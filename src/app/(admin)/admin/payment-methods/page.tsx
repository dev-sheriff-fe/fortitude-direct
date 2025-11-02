'use client'
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard } from "lucide-react";
import { PaymentMethod, PaymentMethodsResponse } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { PaymentMethodsTable } from "@/components/Admin/payment-methods/payment-methods-table";
import { PaymentMethodModal } from "@/components/Admin/payment-methods/payment-method-modal";
import axiosInstance from "@/utils/fetch-function";
import useUser from "@/store/userStore";

const PaymentMethods: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<PaymentMethod | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => axiosInstance.request<PaymentMethodsResponse>({
      url: '/payment-methods/fetch',
      method: 'GET',
      params: {
        storeCode: user?.storeCode || process.env.NEXT_PUBLIC_STORE_CODE
      }
    })
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) => axiosInstance.request({
      url: '/payment-methods/save',
      method: 'POST',
      params: {
        storeCode: user?.storeCode || process.env.NEXT_PUBLIC_STORE_CODE
      },
      data
    }),
    onSuccess: (data) => {
      if (data?.data?.code !== '000') {
        toast({
          title: 'Error',
          description: data?.data?.desc || 'Failed to save payment method',
        })
        return
      }

      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast({
        title: "Success",
        description: editData
          ? "Payment method updated successfully"
          : "Payment method created successfully",
      });
      setModalOpen(false);
      setEditData(null);
      return
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save payment method",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (code: string): Promise<void> => {
      // Simulate API call
      console.log("Deleting payment method:", code);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast({
        title: "Success",
        description: "Payment method deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete payment method",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (method: PaymentMethod) => {
    setEditData(method);
    setModalOpen(true);
  };

  const handleDelete = (code: string) => {
    if (confirm("Are you sure you want to delete this payment method?")) {
      deleteMutation.mutate(code);
    }
  };

  const handleAddNew = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paymentMethods = data?.data?.list || [];
  const totalRecords = paymentMethods.length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  Payment Methods
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your store's payment options
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{totalRecords}</p>
                <p className="text-sm text-muted-foreground">Total Methods</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-elevated p-6">
          <div className="flex float-right py-4">
            <Button
              onClick={handleAddNew}
              className="bg-accent text-white hover:opacity-90 transition-opacity shadow-elevated"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Payment Method
            </Button>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <PaymentMethodsTable
              data={paymentMethods}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        <PaymentMethodModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditData(null);
          }}
          editData={editData}
          saveMutation={saveMutation}
        />
      </div>
    </div>
  );
};

export default PaymentMethods;