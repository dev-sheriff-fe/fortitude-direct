"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Save, 
  X, 
  Package, 
  Barcode, 
  DollarSign, 
  Warehouse, 
  ImageIcon,
  Tag,
  BookOpen,
  Box,
  Hash,
  ArrowLeft
} from "lucide-react";
import FileUpload from "@/components/Admin/inventories/file-input";
import { useForm, Controller } from "react-hook-form";
import { useFileUpload } from "@/app/hooks/useUpload";
import { useProductMutation } from "@/components/Admin/inventories/shared-hooks.tsx/useProductMutation";
import { useCategories } from "@/app/hooks/useCategories";
import useUser from "@/store/userStore";
import { fileUrlFormatted } from "@/utils/helperfns";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/fetch-function";
import { toast } from "sonner";

interface ProductFormData {
  productId: string;
  productName: string;
  productDescription: string;
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
}

interface CreateProductPageProps {
  product?: any;
  mode?: 'create' | 'edit';
}

const CreateProductPage = ({ product, mode = product ? 'edit' : 'create' }: CreateProductPageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(mode === 'edit');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<ProductFormData>();
  
  const { mutate: saveProduct, isPending } = useProductMutation();
  const { data: categories } = useCategories();
  const { user } = useUser();
  const { fileUrl, handleFileChange } = useFileUpload();

  const watchedImageURL = watch("imageURL");

  // Check if we're in edit mode from URL params
  useEffect(() => {
    const editParam = searchParams.get('edit');
    const idParam = searchParams.get('id');
    
    if (editParam === 'true' && idParam) {
      setIsEditMode(true);
      setEditingProductId(idParam);
    }
  }, [searchParams]);

  // Fetch product details for editing
  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product-detail', editingProductId],
    queryFn: () => axiosInstance.request({
      url: '/ecommerce/products/list?name=&storeCode=STO445&entityCode=H2P&tag=&pageNumber=1&pageSize=200',
      method: 'GET',
      params: {
        code: editingProductId
      }
    }),
    enabled: !!editingProductId && isEditMode,
  });

  // Populate form when product data is fetched
  useEffect(() => {
    if (productData?.data && isEditMode) {
      const product = productData.data;
      const productObj = {
        productId: product?.id || product?.productId || "",
        productName: product?.name || product?.productName || "",
        productDescription: product?.description || product?.productDescription || "",
        productCategory: product?.category || product?.productCategory || "",
        productCode: product?.code || product?.productCode || "",
        productPrice: product?.salePrice || product?.productPrice || "",
        stockQuantity: product?.qtyInStore || product?.stockQuantity || 0,
        unitQuantity: product?.unit || product?.unitQuantity || "",
        imageURL: product?.picture || product?.imageURL || "",
        costPrice: product?.costPrice || "",
        storeId: product?.storeId || user?.storeCode || "",
        barCode: product?.barCode || "",
        brand: product?.brand || "",
        ccy: product?.ccy || 'NGN'
      };
      reset(productObj);
    } else if (!isEditMode) {
      // Reset to default values for create mode
      reset({
        productId: "",
        productName: "",
        productDescription: "",
        productCategory: "",
        productCode: "",
        productPrice: "",
        stockQuantity: 0,
        unitQuantity: "",
        imageURL: "",
        costPrice: "",
        storeId: user?.storeCode || "",
        barCode: "",
        brand: "",
        ccy: "NGN"
      });
    }
  }, [productData, isEditMode, user, reset]);

  const onSubmitForm = async (values: ProductFormData) => {
    try {
      const payload = {
        productId: isEditMode ? (editingProductId || product?.id || product?.productId) : null,
        productName: values?.productName,
        productDescription: values?.productDescription,
        productCategory: values?.productCategory,
        productCode: values?.productCode,
        productPrice: values?.productPrice,
        stockQuantity: values?.stockQuantity,
        unitQuantity: values?.unitQuantity,
        base64Image: "",
        imageURL: fileUrl ? fileUrlFormatted(fileUrl) : (fileUrlFormatted(values?.imageURL) || ""),
        costPrice: values?.costPrice,
        storeId: user?.storeCode || '',
        barCode: values?.barCode,
        brand: values?.brand,
        ccy: values?.ccy || 'NGN'
      };

      await saveProduct(payload);
      toast.success(isEditMode ? 'Product updated successfully' : 'Product created successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} product`);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inventories
        </Button>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-center mb-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
            <Package className="h-8 w-8 text-accent-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-accent-foreground">
            {isEditMode ? 'Edit Product' : 'Create New Product'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEditMode ? 'Update product information' : 'Add a new product to your inventory'}
          </p>
        </div>
      </div>


      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <Card className="border-accent/20 border-2 shadow-md">
            <CardHeader className=" pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-accent-foreground">
                <Tag className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>Product identity and classification</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="productName" className="flex items-center gap-1 text-sm font-medium">
                  <span>Product Name</span>
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="productName"
                    className="pl-10"
                    {...register("productName", { required: "Product name is required" })}
                  />
                </div>
                {errors.productName && (
                  <p className="text-sm text-destructive mt-1">{errors.productName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="productDescription" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="productDescription"
                  {...register("productDescription")}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productCategory" className="text-sm font-medium">Category</Label>
                <Controller
                  name="productCategory"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.categories?.map((category: any, index: number) => (
                          <SelectItem key={index} value={category.code}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand" className="text-sm font-medium">Brand</Label>
                <Input
                  id="brand"
                  {...register("brand")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Codes and IDs */}
          <Card className="border-accent/20 border-2 shadow-md">
            <CardHeader className=" pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-accent-foreground">
                <Barcode className="h-5 w-5" />
                Codes & IDs
              </CardTitle>
              <CardDescription>Product identification codes</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="productCode" className="flex items-center gap-1 text-sm font-medium">
                  <span>Product Code</span>
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="productCode"
                    className="pl-10"
                    {...register("productCode", { required: "Product code is required" })}
                  />
                </div>
                {errors.productCode && (
                  <p className="text-sm text-destructive mt-1">{errors.productCode.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="barCode" className="text-sm font-medium">Bar Code</Label>
                <div className="relative">
                  <Barcode className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="barCode"
                    className="pl-10"
                    {...register("barCode")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-accent/20 border-2 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-accent-foreground">
                <DollarSign className="h-5 w-5" />
                Pricing
              </CardTitle>
              <CardDescription>Product pricing information</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productPrice" className="flex items-center gap-1 text-sm font-medium">
                    <span>Selling Price</span>
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="productPrice"
                      type="number"
                      step="0.01"
                      className="pl-10"
                      {...register("productPrice", { 
                        required: "Selling price is required",
                        min: { value: 0, message: "Price must be positive" }
                      })}
                    />
                  </div>
                  {errors.productPrice && (
                    <p className="text-sm text-destructive mt-1">{errors.productPrice.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costPrice" className="text-sm font-medium">Cost Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="costPrice"
                      type="number"
                      step="0.01"
                      className="pl-10"
                      {...register("costPrice", {
                        min: { value: 0, message: "Cost price must be positive" }
                      })}
                    />
                  </div>
                  {errors.costPrice && (
                    <p className="text-sm text-destructive mt-1">{errors.costPrice.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ccy" className="text-sm font-medium">Currency</Label>
                <Controller
                  name="ccy"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NGN">NGN</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card className="border-accent/20 border-2 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-accent-foreground">
                <Warehouse className="h-5 w-5" />
                Inventory
              </CardTitle>
              <CardDescription>Stock and quantity information</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="stockQuantity" className="flex items-center gap-1 text-sm font-medium">
                  <span>Stock Quantity</span>
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Box className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="stockQuantity"
                    type="number"
                    className="pl-10"
                    {...register("stockQuantity", { 
                      required: "Stock quantity is required",
                      min: { value: 0, message: "Stock quantity must be non-negative" },
                      valueAsNumber: true
                    })}
                  />
                </div>
                {errors.stockQuantity && (
                  <p className="text-sm text-destructive mt-1">{errors.stockQuantity.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitQuantity" className="text-sm font-medium">Unit</Label>
                <Input
                  id="unitQuantity"
                  {...register("unitQuantity")}
                  placeholder="e.g., pieces, kg, liters"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Image Upload */}
        <Card className="mt-8 border-accent/20 border-2 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-accent-foreground">
              <ImageIcon className="h-5 w-5" />
              Product Image
            </CardTitle>
            <CardDescription>Upload a product image</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <FileUpload
              onFileSelect={handleFileChange}
              currentFileUrl={watchedImageURL}
              accept="image/*"
              label="Product Image"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-8 mt-8 border-t border-accent/20">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-accent hover:bg-accent/90 text-white flex items-center gap-2 px-6 py-2" 
            disabled={isPending}
          >
            <Save className="h-4 w-4" />
            {isPending ? 'Processing...' : (isEditMode ? "Update Product" : "Create Product")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductPage;