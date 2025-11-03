'use client'
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye } from "lucide-react";
import { Product } from "./products-manager";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const ProductsTable = ({ 
  products, 
  onEdit, 
  onViewDetails,
  itemsPerPage = 5,
  currentPage = 1,
  onPageChange 
}: ProductsTableProps) => {
  const getDisplayValue = (value: any): string => {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    return value.toString();
  };

  const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
    return `${currency} ${amount?.toFixed(2) || '0.00'}`;
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "picture",
      key: "image",
      width: 80,
      render: (picture: string, record: Product) => (
        <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
          {picture ? (
            <img 
              src={picture} 
              alt={record.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-full h-full flex items-center justify-center text-muted-foreground text-xs ${picture ? 'hidden' : ''}`}>
            No Image
          </div>
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string, record: Product) => (
        <div>
          <p className="font-medium text-foreground">{getDisplayValue(name)}</p>
          <p className="text-xs text-muted-foreground">Code: {getDisplayValue(record.code)}</p>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 150,
      render: (category: string) => (
        <Badge variant="secondary">{getDisplayValue(category)}</Badge>
      ),
    },
    {
      title: "Sale Price",
      dataIndex: "salePrice",
      key: "salePrice",
      width: 120,
      render: (price: number, record: Product) => (
        <span className="text-sm font-semibold text-green-600">
          {formatCurrency(price, record.ccy)}
        </span>
      ),
    },
    {
      title: "Cost Price",
      dataIndex: "costPrice",
      key: "costPrice",
      width: 120,
      render: (price: number, record: Product) => (
        <span className="text-sm">
          {formatCurrency(price, record.ccy)}
        </span>
      ),
    },
    {
      title: "Stock",
      dataIndex: "qtyInStore",
      key: "qtyInStore",
      width: 100,
      render: (stock: number, record: Product) => (
        <span className="text-sm font-medium">
          {`${stock || 0}qty`} {`${record.unit || ''}unit`}
        </span>
      ),
    },
    {
      title: "Barcode",
      dataIndex: "barCode",
      key: "barCode",
      width: 120,
      render: (barCode: string) => (
        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
          {getDisplayValue(barCode)}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record: Product) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => onViewDetails(record)}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => onEdit(record)}
            title="Edit Product"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left p-3 font-bold text-sm text-gray-700"
                  style={{ width: column.width ? `${column.width}px` : 'auto' }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b border-gray-200 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
              >
                {columns.map((column) => (
                  <td key={column.key} className="p-3 text-sm">
                    {column.render
                      ? column.render(item[column.dataIndex as keyof Product], item)
                      : getDisplayValue(item[column.dataIndex as keyof Product])
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(endIndex, products.length)} of {products.length} Products
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-xs"
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="w-8 h-8 p-0 text-xs"
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;