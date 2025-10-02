import React from "react";
import Table from "rc-table";
import type { ColumnsType } from "rc-table/lib/interface";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Star } from "lucide-react";
import { PaymentMethod } from "@/types";

interface PaymentMethodsTableProps {
  data: PaymentMethod[];
  onEdit: (method: PaymentMethod) => void;
  onDelete: (code: string) => void;
}

export const PaymentMethodsTable: React.FC<PaymentMethodsTableProps> = ({
  data,
  onEdit,
  onDelete,
}) => {
  const columns: ColumnsType<PaymentMethod> = [
    {
      title: "Payment Method",
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center p-2 shadow-soft">
            <img
              src={record.logo}
              alt={record.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="font-semibold text-foreground flex items-center gap-2">
              {record.name}
              {record.isRecommended && (
                <Star className="w-4 h-4 fill-accent text-accent" />
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {record.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "paymentType",
      key: "paymentType",
      width: 150,
      render: (type: string) => (
        <Badge variant="secondary" className="font-medium">
          {type.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      title: "Provider",
      dataIndex: "serviceProvider",
      key: "serviceProvider",
      width: 150,
      render: (provider: string) => (
        <span className="text-sm text-muted-foreground">
          {provider.replace(/_/g, " ")}
        </span>
      ),
    },
    // {
    //   title: "Fee",
    //   dataIndex: "fee",
    //   key: "fee",
    //   width: 120,
    //   render: (_, record) => (
    //     <span className="text-sm font-medium text-foreground">
    //       {record.feeType === "PERCENT" ? `${record.fee}%` : `£${record.fee}`}
    //     </span>
    //   ),
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <Badge
          variant={status === "ACTIVE" ? "default" : "secondary"}
          className={
            status === "ACTIVE"
              ? "bg-success text-success-foreground"
              : "bg-muted text-muted-foreground"
          }
        >
          {status}
        </Badge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(record)}
            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
          >
            <Edit className="h-4 w-4" />
          </Button>
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(record.code)}
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button> */}
        </div>
      ),
    },
  ];

  return (
    <div className="rc-table-wrapper rounded-lg border border-border overflow-hidden shadow-soft">
      <Table
        columns={columns}
        data={data}
        rowKey="code"
        className="payment-methods-table"
        rowClassName={() => "hover:bg-muted/50 transition-colors"}
      />
    </div>
  );
};
