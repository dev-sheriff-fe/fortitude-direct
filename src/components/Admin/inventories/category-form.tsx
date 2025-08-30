import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Save } from "lucide-react";
import { Category } from "./categories-manager";
import FileUpload from "./file-input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/utils/fetch-function";
import { Controller, useForm } from "react-hook-form";
import { useFileUpload } from "@/app/hooks/useUpload";
import { fileUrlFormatted } from "@/utils/helperfns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryFormProps {
  category?: Category; // Existing category for edit mode
  mode?: 'create' | 'edit'; // Explicit mode specification
  onSuccess?: () => void; // Callback after successful operation
  onCancel?: () => void; // Callback for cancel action
}

export const sectorOptions = [
  { label: 'Electronics', value: 'electronics' },
  { label: 'Clothing & Fashion', value: 'clothing' },
  { label: 'Food & Beverages', value: 'food' },
  { label: 'Home & Garden', value: 'home' },
  { label: 'Health & Beauty', value: 'health' },
  { label: 'Sports & Recreation', value: 'sports' },
  { label: 'Books & Media', value: 'books' },
  { label: 'Automotive', value: 'automotive' },
  { label: "Cosmetics", value: 'cosmetics' },
  { label: 'Other', value: 'other' }
];

const topCategoryOptions = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Tertiary', value: 'tertiary' }
];

const CategoryForm = ({ 
  category, 
  mode = category ? 'edit' : 'create',
  onSuccess,
  onCancel 
}: CategoryFormProps) => {
  const { register, watch, handleSubmit, control, reset, formState: { errors } } = useForm<Category>({
    defaultValues: {
      id: 0,
      code: "",
      name: "",
      description: "",
      sector: "",
      logo: "",
      tags: "",
      topCategory: "",
      qty: ""
    }
  });

  const queryClient = useQueryClient();
  const { fileUrl, handleFileChange } = useFileUpload();
  
  const isEditMode = mode === 'edit' || !!category;
  const watchedImageURL = watch("logo");

  // Reset form when category prop changes (for edit mode)
  useEffect(() => {
    if (category && isEditMode) {
      const categoryObj = {
        id: category.id,
        code: category.code,
        name: category.name,
        description: category.description,
        sector: category.sector,
        logo: category.logo,
        tags: category.tags,
        topCategory: category.topCategory,
        qty: category.qty
      };
      reset(categoryObj);
    } else if (!isEditMode) {
      // Reset to default values for create mode
      reset({
        id: 0,
        code: "",
        name: "",
        description: "",
        sector: "",
        logo: "",
        tags: "",
        topCategory: "",
        qty: ""
      });
    }
  }, [category, reset, isEditMode]);

  const { mutate: saveCategory, isPending } = useMutation({
    mutationFn: (data: any) => {
      const endpoint = isEditMode ? "/products/update-product-category" : "/products/save-product-category";
      return axiosInstance.request({
        method: isEditMode ? "PUT" : "POST",
        url: endpoint,
        data: data,
      });
    },
    onSuccess: (data) => {
      if (data?.data?.code !== "000") {
        toast.error(`Error ${isEditMode ? 'updating' : 'saving'} category`);
      } else {
        toast.success(`Category ${isEditMode ? 'updated' : 'created'} successfully`);
        
        // Invalidate and refetch categories
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        
        if (onSuccess) {
          onSuccess();
        }
        
        // Reset form only in create mode
        if (!isEditMode) {
          reset();
        }
      }
    },
    onError: (error: any) => {
      console.log(error);
      const action = isEditMode ? 'updating' : 'creating';
      
      if (error?.response?.data) {
        if (error.response.status === 400) {
          toast.error('Bad request: ' + (error.response.data.message || 'Unknown error'));
        } else if (error.response.status === 422) {
          toast.error(`Error ${action} category`);
        } else if (error.response.status === 500) {
          toast.error(`Error ${action} category`);
        }
      } else {
        toast.error(`Error ${action} category`);
      }
    },
  });

  const onSubmitForm = async (values: Category) => {
    try {
      const payload = {
        id: isEditMode ? category?.id : 0,
        code: values?.code,
        name: values?.name,
        logo: fileUrl ? fileUrlFormatted(fileUrl) : (fileUrlFormatted(values?.logo) || ""),
        tags: values?.tags,
        description: values?.description,
        topCategory: values?.topCategory,
        sector: values?.sector,
        qty: values?.qty,
      };

      await saveCategory(payload);
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
            {isEditMode ? 'Edit Category' : 'Create New Category'}
          </h2>
          <p className="text-muted-foreground">
            {isEditMode ? 'Update category information' : 'Add a new category to organize your products'}
          </p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmitForm)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Category name is required" })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Category Code *</Label>
                <Input
                  id="code"
                  {...register("code", { required: "Category code is required" })}
                />
                {errors.code && (
                  <p className="text-sm text-red-500">{errors.code.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Classification */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">Classification</h3>
              
              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Controller
                  name="sector"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectorOptions?.map((sector, index: number) => (
                          <SelectItem key={index} value={sector.value}>
                            {sector.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topCategory">Top Category</Label>
                <Controller
                  name="topCategory"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category level" />
                      </SelectTrigger>
                      <SelectContent>
                        {topCategoryOptions?.map((category, index: number) => (
                          <SelectItem key={index} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qty">Quantity/Unit</Label>
                <Input
                  id="qty"
                  {...register("qty")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  {...register("tags")}
                  placeholder="Separate tags with commas"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logo Upload */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Category Logo</h3>
            <FileUpload
              onFileSelect={handleFileChange}
              currentFileUrl={watchedImageURL}
              accept="image/*"
              label="Category Logo"
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
            {isPending ? 'Processing...' : (isEditMode ? "Update Category" : "Create Category")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;