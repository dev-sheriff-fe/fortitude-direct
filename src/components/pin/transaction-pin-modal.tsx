"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import useCustomer from "@/store/customerStore";
import { logout } from '@/utils/auth-utils-customer'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import axiosCustomer from "@/utils/fetch-function-customer";
import { log } from "console";

interface SetPinFormData {
  newPin: string;
  confirmPin: string;
}

interface TransactionPinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransactionPinModal = ({ isOpen, onClose }: TransactionPinModalProps) => {
  const { customer } = useCustomer();
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<SetPinFormData>({
    defaultValues: {
      newPin: "",
      confirmPin: ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: SetPinFormData) => {
      const payload = {
        username: customer?.username || "",
        newPin: data.newPin,
        entityCode: customer?.entityCode || "",
        channel: "WEB",
        // deviceId: typeof window !== 'undefined' ? localStorage.getItem('deviceId') || 'web-app' : 'web-app'
      };

      const response = await axiosCustomer.post('/ecommerce/setPIN', payload);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.code === "000") {
        toast.success("Transaction PIN set successfully! You will be logged out in 5 seconds...");
        reset();
        onClose();
      } else {
        toast.error(data.message || "Failed to set transaction PIN");
      }
    },
    onSettled: () => {
      setIsLoggingOut(true);
      setTimeout(() => {
        logout();
        setIsLoggingOut(false);
      }, 5000);
    },
    onError: (error: any) => {
      console.error('Error setting PIN:', error);
      toast.error(error.response?.data?.message || "Failed to set transaction PIN");
    },
  });

  const onSubmit = (data: SetPinFormData) => {
    if (data.newPin !== data.confirmPin) {
      toast.error("PINs do not match");
      return;
    }

    if (data.newPin.length !== 4) {
      toast.error("PIN must be 4 digits");
      return;
    }

    mutation.mutate(data);
  };

  const watchNewPin = watch("newPin");
  const watchConfirmPin = watch("confirmPin");

  const truncateUsername = (username: string | undefined) => {
    if (!username) return "N/A";
    // if (username.length <= 8) return username;
    const firstPart = username.slice(0, 7);
    const lastPart = username.slice(-4);
    return `${firstPart}***${lastPart}`;
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col mb-4">
          <DialogTitle className="text-center text-xl">
            Set Transaction PIN
          </DialogTitle>
          <DialogDescription className="text-center">
            Secure your transactions with a 4-digit PIN
          </DialogDescription>
        </DialogHeader>

        <Card className="bg-muted/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Account Details</CardTitle>
            <CardDescription>
              PIN will be set for this account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-7 text-sm justify-between">
              <div>
                <Label className="text-xs text-muted-foreground">Username</Label>
                <p className="font-medium">{truncateUsername(customer?.username)}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Tier</Label>
                <p className="font-medium">{customer?.customerTier || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="newPin" className="text-sm font-medium">
              New PIN
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="newPin"
                type={showNewPin ? "text" : "password"}
                maxLength={4}
                className="pl-10 pr-10"
                placeholder="Enter 4-digit PIN"
                {...register("newPin", {
                  required: "PIN is required",
                  pattern: {
                    value: /^\d{4}$/,
                    message: "PIN must be exactly 4 digits"
                  }
                })}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPin(!showNewPin)}
              >
                {showNewPin ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.newPin && (
              <p className="text-sm text-destructive">{errors.newPin.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="confirmPin" className="text-sm font-medium">
              Confirm PIN
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPin"
                type={showConfirmPin ? "text" : "password"}
                maxLength={4}
                className="pl-10 pr-10"
                placeholder="Confirm 4-digit PIN"
                {...register("confirmPin", {
                  required: "Please confirm your PIN",
                  validate: value =>
                    value === watchNewPin || "PINs do not match"
                })}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPin(!showConfirmPin)}
              >
                {showConfirmPin ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPin && (
              <p className="text-sm text-destructive">{errors.confirmPin.message}</p>
            )}
          </div>

          <div className="rounded-lg bg-muted/50 p-3">
            <h4 className="text-xs font-medium mb-2">PIN Requirements:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Must be exactly 4 digits</li>
              <li>• Numbers only (0-9)</li>
              <li>• Do not share your PIN with anyone</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={mutation.isPending || !watchNewPin || !watchConfirmPin}
            >
              {mutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Setting PIN...
                </>
              ) : (
                "Set PIN"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionPinModal;