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
import { Category } from "./categories-manager";

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
}

const CategoriesTable = ({ categories, onEdit }: CategoriesTableProps) => {
  const columns: ColumnsType<Category> = [
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      width: 80,
      render: (logo: string, record: Category) => (
        <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
          {logo ? (
            <img 
              src={logo} 
              alt={record.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              No Logo
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string, record: Category) => (
        <div>
          <p className="font-medium text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">Code: {record.code}</p>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 250,
      render: (description: string) => (
        <p className="text-sm text-muted-foreground truncate max-w-[200px]" title={description}>
          {description || "No description"}
        </p>
      ),
    },
    {
      title: "Sector",
      dataIndex: "sector",
      key: "sector",
      width: 120,
      render: (sector: string) => (
        <Badge variant="secondary">{sector || "General"}</Badge>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      key: "qty",
      width: 100,
      render: (qty: string) => (
        <span className="text-sm font-medium">{qty || "N/A"}</span>
      ),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      width: 200,
      render: (tags: string) => (
        <div className="flex flex-wrap gap-1">
          {tags ? (
            tags.split(',').slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag.trim()}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">No tags</span>
          )}
          {tags && tags.split(',').length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.split(',').length - 3} more
            </Badge>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      fixed: "right" as const,
      render: (_, record: Category) => (
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
        data={categories}
        rowKey="id"
        scroll={{ x: 1200 }}
        className=""
        emptyText={
          <div className="text-center py-8">
            <p className="text-muted-foreground">No categories found</p>
          </div>
        }
        />
    </div>
  );
};

export default CategoriesTable;