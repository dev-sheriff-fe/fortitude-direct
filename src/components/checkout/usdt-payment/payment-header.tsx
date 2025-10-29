"use client"

interface PaymentHeaderProps {
  amount: number
  orderNo: string
}

export default function PaymentHeader({ amount, orderNo }: PaymentHeaderProps) {
  return (
    <div className="mb-8 rounded-lg bg-card p-6 shadow-sm border border-border">
      <div className="space-y-4">
        {/* Amount Display */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Amount</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">
              {amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xl font-semibold text-accent">USDT</span>
          </div>
        </div>

        {/* Order Number */}
        <div className="pt-2 border-t border-border">
          <p className="text-sm font-medium text-muted-foreground mb-1">Order Number</p>
          <p className="text-lg font-mono text-primary">{orderNo}</p>
        </div>
      </div>
    </div>
  )
}
