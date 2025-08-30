import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { Product } from "./products-manager";
import FileUpload from "./file-input";
import { useForm, Controller } from "react-hook-form";
import { useFileUpload } from "@/app/hooks/useUpload";
import { useProductMutation } from "./shared-hooks.tsx/useProductMutation";
import { useCategories } from "@/app/hooks/useCategories";
import useUser from "@/store/userStore";
import { fileUrlFormatted } from "@/utils/helperfns";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  product?: any; // Existing product for edit mode
  mode?: 'create' | 'edit'; // Explicit mode specification
  onSuccess?: () => void; // Callback after successful operation
  onCancel?: () => void; // Callback for cancel action
}

const ProductForm = ({ 
  product, 
  mode = product ? 'edit' : 'create',
  onSuccess,
  onCancel 
}: ProductFormProps) => {
  const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm<Product>({
    defaultValues: {
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
      storeId: "",
      barCode: "",
      brand: "",
      ccy: "NGN" // Default to NGN as per your original code
    }
  });

  const { mutate, isPending } = useProductMutation();
  const { data: categories } = useCategories();
  const { user } = useUser();
  const { fileUrl, handleFileChange } = useFileUpload();

  const watchedImageURL = watch("imageURL");
  const isEditMode = mode === 'edit' || !!product;

  // Reset form when product prop changes (for edit mode)
  useEffect(() => {
    if (product && isEditMode) {
      const productObj = {
        productId: product?.id || product?.productId,
        productName: product?.name || product?.productName,
        productDescription: product?.description || product?.productDescription,
        productCategory: product?.category || product?.productCategory,
        productCode: product?.code || product?.productCode,
        productPrice: product?.salePrice || product?.productPrice,
        stockQuantity: product?.qtyInStore || product?.stockQuantity || 0,
        unitQuantity: product?.unit || product?.unitQuantity,
        imageURL: product?.picture || product?.imageURL,
        costPrice: product?.costPrice,
        storeId: product?.storeId,
        barCode: product?.barCode,
        brand: product?.brand,
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
        storeId: "",
        barCode: "",
        brand: "",
        ccy: "NGN"
      });
    }
  }, [product, reset, isEditMode]);

  const onSubmitForm = async (values: Product) => {
    try {
      const payload = {
        productId: isEditMode ? product?.id : null,
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

      await mutate(payload);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {isEditMode ? 'Edit Product' : 'Create New Product'}
          </h2>
          <p className="text-muted-foreground">
            {isEditMode ? 'Update product information' : 'Add a new product to your inventory'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  {...register("productName", { required: "Product name is required" })}
                />
                {errors.productName && (
                  <p className="text-sm text-red-500">{errors.productName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="productDescription">Description</Label>
                <Textarea
                  id="productDescription"
                  {...register("productDescription")}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productCategory">Category</Label>
                <Controller
                  name="productCategory"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
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
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  {...register("brand")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Codes and IDs */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">Codes & IDs</h3>
              
              <div className="space-y-2">
                <Label htmlFor="productCode">Product Code *</Label>
                <Input
                  id="productCode"
                  {...register("productCode", { required: "Product code is required" })}
                />
                {errors.productCode && (
                  <p className="text-sm text-red-500">{errors.productCode.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="barCode">Bar Code</Label>
                <Input
                  id="barCode"
                  {...register("barCode")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">Pricing</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productPrice">Selling Price *</Label>
                  <Input
                    id="productPrice"
                    type="number"
                    step="0.01"
                    {...register("productPrice", { 
                      required: "Selling price is required",
                      min: { value: 0, message: "Price must be positive" }
                    })}
                  />
                  {errors.productPrice && (
                    <p className="text-sm text-red-500">{errors.productPrice.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    {...register("costPrice", {
                      min: { value: 0, message: "Cost price must be positive" }
                    })}
                  />
                  {errors.costPrice && (
                    <p className="text-sm text-red-500">{errors.costPrice.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ccy">Currency</Label>
                <Controller
                  name="ccy"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
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
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">Inventory</h3>
              
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  {...register("stockQuantity", { 
                    required: "Stock quantity is required",
                    min: { value: 0, message: "Stock quantity must be non-negative" },
                    valueAsNumber: true
                  })}
                />
                {errors.stockQuantity && (
                  <p className="text-sm text-red-500">{errors.stockQuantity.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitQuantity">Unit</Label>
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
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Product Image</h3>
            <FileUpload
              onFileSelect={handleFileChange}
              currentFileUrl={watchedImageURL}
              accept="image/*"
              label="Product Image"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            className="transition-smooth bg-accent text-white" 
            variant="secondary"
            disabled={isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {isPending ? 'Processing...' : (isEditMode ? "Update Product" : "Create Product")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;