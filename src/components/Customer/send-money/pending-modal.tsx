import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axiosInstance from "@/utils/fetch-function";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface SuccessModalProps {
  onLogin: () => void;
  onCancel: () => void;
  payloadInfo: any
}

export const PendingModal = ({ onLogin, onCancel, payloadInfo }: SuccessModalProps) => {
    const {mutate,isPending} = useMutation({
        mutationFn: ()=>axiosInstance({
            url: 'tran-master/tsq',
            params: {
                externalRefNo: payloadInfo?.externalRefNo
            }
        }),
        onSuccess: (data)=>{
            if (data?.data?.responseCode!=='000') {
                toast?.error(data?.data?.responseMessage)
                return
            }

            toast.success(data?.data?.responseMessage)
        },
        onError: ()=>{
            toast.error('something went wrong')
        }
    })
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Clock className="w-16 h-16 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold">Transaction Processing</h2>
          
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="flex gap-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button disabled = {isPending} onClick={()=>mutate()} className="flex-1 bg-accent">
              {isPending ? `Please wait..` : `Check Transaction Status`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};