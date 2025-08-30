import { useState } from "react";
import Table from "rc-table";
import type { ColumnsType } from "rc-table/lib/interface";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "./products-manager";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

const ProductsTable = ({ products, onEdit }: ProductsTableProps) => {
  const renderText = (text:string)=> text?<p className="font-medium">{text}</p>:<p className="text-xs text-muted-foreground">N/A</p>
  const columns: ColumnsType<Product> = [
    {
      title: "Image",
      dataIndex: "picture",
      key: "image",
      width: 80,
      render: (imageURL: string, record: Product) => (
        <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
          {imageURL ? (
            <img 
              src={imageURL} 
              alt={record.productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              No Image
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string) => (
        renderText(name)
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 150,
      render: (category: string) => (
        <Badge variant="secondary">{renderText(category)}</Badge>
      ),
    },

    {
      title: "Sale Price",
      dataIndex: "salePrice",
      key: "salePrice",
      width: 100,
      render: (price: string, record: Product) => (
        renderText(`${record.ccy} ${price || "0"}`)
      ),
    },
    {
      title: "Cost Price",
      dataIndex: "costPrice",
      key: "costPrice",
      width: 100,
      render: (price: string, record: Product) => (
        renderText(`${record.ccy} ${price || "0"}`)
      ),
    },
    {
      title: "Quantity",
      dataIndex: "qtyInStore",
      key: "qtyInStore",
      width: 100,
      render: (stock: number, record: Product) => (
        renderText(`${stock || 0} ${record.unitQuantity || ''}`)
      ),
    },
    {
      title: "Bar Code",
      dataIndex: "barCode",
      key: "barCode",
      width: 120,
      render: (barCode: string) => (
        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
          {barCode || "N/A"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      fixed: "right" as const,
      render: (_, record: Product) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(record)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="bg-card rounded-lg border">
      <Table
        columns={columns}
        data={products}
        rowKey="productId"
        scroll={{ x: 1200 }}
        className=""
        emptyText={
          <div className="text-center py-8">
            <p className="text-muted-foreground">No products found</p>
          </div>
        }
        />
    </div>
  );
};

export default ProductsTable;