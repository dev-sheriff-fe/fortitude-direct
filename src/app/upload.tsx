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
  uploadType: 'products' | 'categories';
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface UploadFormData {
  file: FileList;
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

const UploadBulkForm = ({ uploadType, onSuccess, onCancel }: UploadBulkFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const {user} = useUser()
  const { register, handleSubmit, watch, formState: { errors }, setValue, resetField } = useForm<UploadFormData>({
    mode: 'onChange'
  });

  const selectedFile = watch('file')?.[0];

  const downloadTemplate = () => {
    const templateFileName = uploadType === 'products'
      ? 'product-upload-template.xlsx'
      : 'category-upload-template.xlsx';

    const templateUrl = `/templates/${templateFileName}`;
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = templateFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validateFile = (file: File) => {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      return 'Please select a valid Excel or CSV file';
    }

    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const onSubmit = async (data: UploadFormData) => {
    const file = data.file[0];
    const validationError = validateFile(file);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsUploading(true);

    try {
      // First upload the file to get fileRef
      const fileUploadFormData = new FormData();
      fileUploadFormData.append('file', file);

      // Set appropriate headers
      const headers = {
        'x-source-code': 'WEB',
        'FileType': uploadType === 'products' ? 'PRODUCT' : 'PRODUCT_CATEGORY',
        'Content-Type': 'multipart/form-data'
      };

      // Upload file endpoint
      const fileUploadResponse = await axiosInstance.post<FileUploadResponse>(
        '/fileuploadservice/uploadfile',
        fileUploadFormData,
        {
          headers,
          params: {
            entityCode: 'H2P',
            storeCode: user?.storeCode || 'STO445',
            FILETYPE: uploadType === 'products' ? 'PRODUCT' : 'PRODUCT_CATEGORY',

          }
        }
      );

      if (fileUploadResponse.data?.code !== '000') {
        throw new Error(fileUploadResponse.data?.desc || 'File upload failed');
      }

      const fileRef = fileUploadResponse.data.data?.fileRef;
      if (!fileRef) {
        throw new Error('File reference not received');
      }

      // Then make the bulk upload request with the fileRef
      const bulkUploadRequest: BulkUploadRequest = {
        requestReference: new Date().getTime().toString(),
        fileType: uploadType === 'products' ? 'PRODUCT' : 'PRODUCT_CATEGORY',
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
        throw new Error(bulkUploadResponse.data?.desc || `Error uploading ${uploadType}`);
      }

      toast.success(`${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)} uploaded successfully`);

      // Reset the form after successful upload
      resetField('file');
      onSuccess?.();
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.desc || error.message || `Error uploading ${uploadType}`;
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Get appropriate text based on upload type
  const getTitle = () => {
    return uploadType === 'products'
      ? 'Bulk Upload Products'
      : 'Bulk Upload Categories';
  };

  const getButtonLabel = () => {
    return uploadType === 'products'
      ? 'Upload Products'
      : 'Upload Categories';
  };

  const getFileTypeLabel = () => {
    return uploadType === 'products'
      ? 'PRODUCT'
      : 'PRODUCT CATEGORY';
  };

  // Clear file selection when canceling
  const handleCancel = () => {
    resetField('file');
    onCancel?.();
  };

  return (
    <div className="space-y-6">
      <DialogHeader className='flex flex-col items-start'>
        <DialogTitle className="text-2xl font-bold text-center">
          {getTitle()}
        </DialogTitle>
        <DialogDescription className="text-center">
          Upload a file to bulk {uploadType === 'products' ? 'add products' : 'create categories'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="file" className="text-sm font-medium">
              Upload File
            </Label>
            <button
              type="button"
              onClick={downloadTemplate}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Download className="w-4 h-4 mr-1" />
              Download Template
            </button>
          </div>

          <div className="space-y-2">
            <input
              type="file"
              id="file"
              accept=".xlsx,.xls,.csv"
              {...register('file', {
                required: 'Please select a file to upload',
                validate: {
                  validFile: (files) => {
                    if (!files || files.length === 0) return 'Please select a file';
                    const file = files[0];
                    return validateFile(file) || true;
                  }
                }
              })}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-lg cursor-pointer"
            />

            {errors.file && (
              <p className="text-sm text-red-600 mt-1">{errors.file.message}</p>
            )}

            {selectedFile && !errors.file && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Selected File: {selectedFile.name}</p>
                <p className="text-sm text-gray-600">Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <p className="text-sm text-gray-600">Type: {getFileTypeLabel()}</p>
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
            disabled={isUploading || !selectedFile}
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

export default UploadBulkForm;