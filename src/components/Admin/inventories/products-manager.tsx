'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Search, Grid, List, Upload, Eye, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProductsTable from "./products-table";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/fetch-function";
import useUser from "@/store/userStore";
import UploadBulkForm from "../../upload/upload";
import UploadImage from "../../upload/upload-images";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import placeholder from "@/components/images/placeholder-product.webp";

export interface Product {
  productId: string;
  productName: string;
  productDescription: string;
  code: string;
  id: string;
  productCategory: string;
  productCode: string;
  productPrice: string;
  stockQuantity: number;
  unitQuantity: string;
  imageURL: string;
  costPrice: string;
  storeId: string;
  barCode: string;
  brand: string;
  ccy: string;
  picture: string;
  name: string;
  description: string;
  category: string;
  qtyInStore: number;
  salePrice: number;
  oldPrice: number;
  pictureList: string[];
  color: string | null;
  itemSize: string | null;
  model: string | null;
  expiryDate: string | null;
  unit: string;
  usdPrice: number;
}

interface ProductsManagerProps {
  onCountChange?: (count: number) => void;
}

const ProductsManager = ({ onCountChange }: ProductsManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isBulkUploadImagesOpen, setIsBulkUploadImagesOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const editParam = searchParams.get('edit');
    const idParam = searchParams.get('id');

    if (editParam === 'true' && idParam) {
      setIsEditMode(true);
      setEditingProductId(idParam);
      router.push(`/admin/inventories/create-product?edit=true&id=${idParam}`);
    }
  }, [searchParams, router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => {
      return axiosInstance.request({
        method: "GET",
        url: '/ecommerce/products/list',
        params: {
          name: '',
          storeCode: user?.storeCode,
          entityCode: user?.entityCode,
          tag: '',
          pageNumber: 1,
          pageSize: 200
        }
      }).then(response => response.data);
    }
  });

  useEffect(() => {
    if (data?.products && onCountChange) {
      onCountChange(data.products.length);
    }
  }, [data?.products, onCountChange]);

  const filteredProducts = data?.products?.filter((product: Product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barCode?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEditDetails = (product: Product) => {
    router.push(`/admin/inventories/create-product?edit=true&id=${product.id}`);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const getDisplayValue = (value: any): string => {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    return value.toString();
  };

  const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
    return `${currency} ${amount?.toFixed(2) || '0.00'}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-500">Error loading products</p>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "table")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Table
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Bulk Upload Button */}
          <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
            <DialogTrigger asChild>
              <Button className="transition-smooth" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle></DialogTitle>
              </DialogHeader>
              <UploadBulkForm
                uploadType="products"
                onSuccess={() => setIsBulkUploadOpen(false)}
                onCancel={() => setIsBulkUploadOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Bulk Image product Button */}
          <Dialog open={isBulkUploadImagesOpen} onOpenChange={setIsBulkUploadImagesOpen}>
            <DialogTrigger asChild>
              <Button className="transition-smooth" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload Images
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle></DialogTitle>
              </DialogHeader>
              <UploadImage
                uploadType="product_images"
                onSuccess={() => setIsBulkUploadImagesOpen(false)}
                onCancel={() => setIsBulkUploadImagesOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Add Product Button */}
          <Link href="/admin/inventories/create-product" passHref>
            <Button className="transition-smooth" variant="secondary">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Products Content */}
      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product: Product) => (
            <Card key={product.id} className="group hover:shadow-elegant transition-smooth">
              <CardHeader className="pb-4">
                {product.picture && (
                  <div className="w-full h-48 bg-muted rounded-lg overflow-hidden mb-4">
                    <img
                      src={product.picture}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground">Code: {product.code || 'NIL'}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="font-semibold">{formatCurrency(product.salePrice, product.ccy)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Stock</span>
                  <span className="font-medium">{product.qtyInStore} {product.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <span className="text-sm">{product.category}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewDetails(product)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 bg-accent text-white hover:bg-accent-foreground"
                    onClick={() => handleEditDetails(product)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <ProductsTable
          products={filteredProducts}
          onEdit={handleEditDetails}
          onViewDetails={handleViewDetails}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Product Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className='flex flex-col'>
            <DialogTitle>Product Details - {selectedProduct?.name || 'N/A'}</DialogTitle>
            <DialogDescription>
              Detailed information about the selected product
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="py-4 space-y-6">
              {/* Product Image and Basic Info */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  {selectedProduct.picture ? (
                    <div className="w-48 h-48 bg-muted rounded-lg overflow-hidden">
                      <Image
                        src={selectedProduct.picture}
                        alt={selectedProduct.name}
                        width={192}
                        height={192}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = placeholder.src;
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{getDisplayValue(selectedProduct.name)}</h3>
                  <p className="text-sm text-muted-foreground mb-4">Code: {getDisplayValue(selectedProduct.code)}</p>
                  <p className="text-sm mb-4">{getDisplayValue(selectedProduct.description)}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Category</p>
                      <p className="text-sm">{getDisplayValue(selectedProduct.category)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Brand</p>
                      <p className="text-sm">{getDisplayValue(selectedProduct.brand)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Pricing & Inventory</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Sale Price</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(selectedProduct.salePrice, selectedProduct.ccy)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Cost Price</p>
                    <p className="text-sm">{formatCurrency(selectedProduct.costPrice, selectedProduct.ccy)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Old Price</p>
                    <p className="text-sm text-muted-foreground line-through">
                      {formatCurrency(selectedProduct.oldPrice, selectedProduct.ccy)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Stock</p>
                    <p className="text-sm font-medium">
                      {selectedProduct.qtyInStore} {selectedProduct.unit}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Additional Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Barcode</p>
                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded inline-block">
                      {getDisplayValue(selectedProduct.barCode)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Color</p>
                    <p className="text-sm">{getDisplayValue(selectedProduct.color)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Size</p>
                    <p className="text-sm">{getDisplayValue(selectedProduct.itemSize)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Model</p>
                    <p className="text-sm">{getDisplayValue(selectedProduct.model)}</p>
                  </div>
                  {selectedProduct.expiryDate && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Expiry Date</p>
                      <p className="text-sm">{getDisplayValue(selectedProduct.expiryDate)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Images */}
              {selectedProduct.pictureList && selectedProduct.pictureList.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Additional Images</h4>
                  <div className="flex gap-2 overflow-x-auto">
                    {selectedProduct.pictureList.map((picture, index) => (
                      <div key={index} className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={picture}
                          alt={`${selectedProduct.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {filteredProducts.length === 0 && !searchTerm && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Plus className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No products yet</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first product</p>
          <div className="flex gap-3 justify-center">
            <Link href="/admin/inventories/create-product" passHref>
              <Button className="transition-smooth" variant="secondary">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
            <Button onClick={() => setIsBulkUploadOpen(true)} variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
          </div>
        </div>
      )}

      {/* No Search Results */}
      {filteredProducts.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            No products match your search term "{searchTerm}"
          </p>
          <Button
            onClick={() => setSearchTerm("")}
            variant="secondary"
          >
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;