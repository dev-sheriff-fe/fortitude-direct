import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  onLogin: () => void;
  onCancel: () => void;
}

export const SuccessModal = ({ onLogin, onCancel }: SuccessModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-success" />
          </div>
          <h2 className="text-2xl font-bold">Transaction Successful</h2>
          <p className="text-muted-foreground">
            Your account Has been confirmed, you can proceed to Login
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button onClick={onLogin} className="w-full">
            Login
          </Button>

          <div className="text-center">
            <span className="text-muted-foreground">Didn't Get an E-mail? </span>
            <Button variant="link" className="p-0 h-auto text-primary">
              Resend
            </Button>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onLogin} className="flex-1">
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};