'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Download, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import axiosInstance from "@/utils/fetch-function";
import useUser from '@/store/userStore';

interface UploadBulkFormProps {
  uploadType: 'product_images' | 'category_images';
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FileUploadResponse {
  code: string;
  desc: string;
  data?: {
    fileRef: string;
  };
}

interface BulkUploadRequest {
  requestReference: string;
  fileType: string;
  fileRef: string;
  entityCode?: string;
  storeCode?: string;
}

interface ImagePreview {
  id: string;
  url: string;
  file: File;
  code: string;
}

const UploadBulkImagesForm = ({ uploadType, onSuccess, onCancel }: UploadBulkFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const { user } = useUser();

  const { register, handleSubmit } = useForm();

  const downloadTemplate = () => {
    const templateFileName = 'image-upload-instructions.pdf';
    const templateUrl = `/templates/${templateFileName}`;
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = templateFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCodeFromFileName = (fileName: string): string => {
    return fileName.replace(/\.[^/.]+$/, "");
  };

  const validateFile = (file: File) => {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      return 'Please select a valid image file (JPG, PNG, GIF, WEBP)';
    }

    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImagePreviews: ImagePreview[] = [];
    
    Array.from(files).forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }
      
      const previewUrl = URL.createObjectURL(file);
      const code = getCodeFromFileName(file.name);
      
      newImagePreviews.push({
        id: Math.random().toString(36).substr(2, 9),
        url: previewUrl,
        file: file,
        code: code
      });
    });
    
    setImagePreviews(prev => [...prev, ...newImagePreviews]);
  };

  const removeImagePreview = (id: string) => {
    setImagePreviews(prev => {
      const previewToRemove = prev.find(p => p.id === id);
      if (previewToRemove) {
        URL.revokeObjectURL(previewToRemove.url);
      }
      return prev.filter(p => p.id !== id);
    });
  };

  const onSubmit = async () => {
    if (imagePreviews.length === 0) {
      toast.error('Please select at least one image to upload');
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = imagePreviews.map(async (imagePreview) => {
        const fileUploadFormData = new FormData();
        fileUploadFormData.append('file', imagePreview.file);

        const codeParamName = uploadType === 'product_images' ? 'productCode' : 'categoryCode';
        
        const headers = {
          'x-source-code': 'WEB',
          'FileType': uploadType === 'product_images' ? 'PRODUCT_IMAGE' : 'PRODUCT_CATEGORY_IMAGE',
          'Content-Type': 'multipart/form-data'
        };

        const fileUploadResponse = await axiosInstance.post<FileUploadResponse>(
          '/fileuploadservice/uploadfile',
          fileUploadFormData,
          {
            headers,
            params: {
              entityCode: user?.entityCode,
              storeCode: user?.storeCode,
              FILETYPE: uploadType === 'product_images' ? 'PRODUCT_IMAGE' : 'PRODUCT_CATEGORY_IMAGE',
              [codeParamName]: imagePreview.code
            }
          }
        );

        if (fileUploadResponse.data?.code !== '000') {
          throw new Error(fileUploadResponse.data?.desc || 'Image upload failed');
        }

        const fileRef = fileUploadResponse.data.data?.fileRef;
        if (!fileRef) {
          throw new Error('File reference not received');
        }

        const bulkUploadRequest: BulkUploadRequest = {
          requestReference: new Date().getTime().toString(),
          fileType: uploadType === 'product_images' ? 'PRODUCT_IMAGE' : 'PRODUCT_CATEGORY_IMAGE',
          fileRef: fileRef,
          entityCode: '',
          storeCode: ''
        };

        const bulkUploadResponse = await axiosInstance.post(
          '/fileuploadservice/uploadfile?FILETYPE=BULK_UPLOAD',
          bulkUploadRequest,
          {
            headers: {
              'x-source-code': 'WEB',
              'Content-Type': 'application/json'
            }
          }
        );

        if (bulkUploadResponse.data?.code !== '000') {
          throw new Error(bulkUploadResponse.data?.desc || `Error uploading image`);
        }

        return bulkUploadResponse.data;
      });

      await Promise.all(uploadPromises);
      toast.success(`${imagePreviews.length} images uploaded successfully`);

      imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
      setImagePreviews([]);
      onSuccess?.();
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.desc || error.message || `Error uploading ${uploadType}`;
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const getTitle = () => {
    return uploadType === 'product_images' 
      ? 'Upload Product Images' 
      : 'Upload Category Images';
  };

  const getButtonLabel = () => {
    return 'Upload Images';
  };

  const getFileTypeLabel = () => {
    return uploadType === 'product_images' 
      ? 'PRODUCT IMAGE' 
      : 'PRODUCT CATEGORY IMAGE';
  };

  const handleCancel = () => {
    imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    setImagePreviews([]);
    onCancel?.();
  };

  return (
    <div className="space-y-6">
      <DialogHeader className='flex flex-col items-start'>
        <DialogTitle className="text-2xl font-bold text-center">
          {getTitle()}
        </DialogTitle>
        <DialogDescription className="text-center">
          Upload images for {uploadType === 'product_images' ? 'products' : 'categories'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="file" className="text-sm font-medium">
              Upload Images
            </Label>
            <button
              type="button"
              onClick={downloadTemplate}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Download className="w-4 h-4 mr-1" />
              Download Instructions
            </button>
          </div>

          <div className="space-y-2">
            <input
              type="file"
              id="file"
              accept="image/*"
              multiple={true}
              onChange={handleFileInputChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-lg cursor-pointer"
            />

            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Selected Images: {imagePreviews.length}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {imagePreviews.map((preview) => (
                    <div key={preview.id} className="relative group">
                      <img 
                        src={preview.url} 
                        alt="Preview" 
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImagePreview(preview.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <p className="text-xs truncate mt-1">{preview.file.name}</p>
                      <p className="text-xs text-gray-500 truncate">Code: {preview.code}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isUploading || imagePreviews.length === 0}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? 'Uploading...' : getButtonLabel()}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UploadBulkImagesForm;