// 'use client';

// import React, { useState, useRef } from 'react';
// import { toast } from 'react-toastify';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { X, Download, Upload } from 'lucide-react';

// interface UploadBulkModalProps {
//   open?: boolean;
//   onClose?: () => void;
//   uploadType: 'products' | 'categories';
// }

// const UploadBulkModal = ({ open, onClose, uploadType }: UploadBulkModalProps) => {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [fileError, setFileError] = useState<string | null>(null);

//   // Reset state when modal closes
//   React.useEffect(() => {
//     if (!open) {
//       setSelectedFile(null);
//       setFileError(null);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//     }
//   }, [open]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) {
//       setSelectedFile(null);
//       setFileError(null);
//       return;
//     }

//     const file = files[0];
//     const validExtensions = ['.xlsx', '.xls', '.csv'];
//     const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
//     if (!validExtensions.includes(fileExtension)) {
//       setFileError('Please select a valid Excel or CSV file');
//       setSelectedFile(null);
//       return;
//     }

//     if (file.size > 10 * 1024 * 1024) { // 10MB limit
//       setFileError('File size must be less than 10MB');
//       setSelectedFile(null);
//       return;
//     }

//     setSelectedFile(file);
//     setFileError(null);
//   };

//   const downloadTemplate = () => {
//     const templateFileName = uploadType === 'products' 
//       ? 'product-upload-template.xlsx' 
//       : 'category-upload-template.xlsx';
    
//     const templateUrl = `/templates/${templateFileName}`;
//     const link = document.createElement('a');
//     link.href = templateUrl;
//     link.download = templateFileName;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleSubmit = async () => {
//     if (!selectedFile) {
//       toast.error('Please select a file');
//       return;
//     }

//     setIsUploading(true);
//     try {
//       // Simulate upload process
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // Here you would typically make your API call
//       // const formData = new FormData();
//       // formData.append('file', selectedFile);
//       // formData.append('requestReference', new Date().getTime().toString());
//       // formData.append('fileType', uploadType === 'products' ? 'PRODUCT' : 'PRODUCT_CATEGORY');
      
//       // await axiosInstance.post('/your-upload-endpoint', formData);
      
//       toast.success(`${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)} uploaded successfully`);
//       onClose?.();
//     } catch (error: any) {
//       console.error(error);
//       toast.error(error.message || `Error uploading ${uploadType}`);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // Get appropriate text based on upload type
//   const getTitle = () => {
//     return uploadType === 'products' 
//       ? 'Bulk Upload Products' 
//       : 'Bulk Upload Categories';
//   };

//   const getButtonLabel = () => {
//     return uploadType === 'products' 
//       ? 'Upload Products' 
//       : 'Upload Categories';
//   };

//   const getFileTypeLabel = () => {
//     return uploadType === 'products' 
//       ? 'PRODUCT' 
//       : 'PRODUCT CATEGORY';
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-90">
//       <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-lg">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-900">
//             {getTitle()}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>
        
//         {/* Content */}
//         <div className="p-6">
//           <div className="mb-6">
//             <div className="flex items-center justify-between mb-2">
//               <Label>Upload File</Label>
//               <button
//                 type="button"
//                 onClick={downloadTemplate}
//                 className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
//               >
//                 <Download className="w-4 h-4 mr-1" />
//                 Download Template
//               </button>
//             </div>
            
//             <div className="relative">
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 accept=".xlsx,.xls,.csv"
//                 onChange={handleFileChange}
//                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-lg cursor-pointer"
//               />
//             </div>
            
//             {fileError && (
//               <p className="mt-2 text-sm text-red-600">{fileError}</p>
//             )}
            
//             {selectedFile && !fileError && (
//               <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//                 <p className="text-sm font-medium text-gray-900">Selected File: {selectedFile.name}</p>
//                 <p className="text-sm text-gray-600">Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
//                 <p className="text-sm text-gray-600">Type: {getFileTypeLabel()}</p>
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* Footer */}
//         <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
//           <Button
//             variant="outline"
//             onClick={onClose}
//             disabled={isUploading}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSubmit}
//             disabled={isUploading || !selectedFile}
//             className="flex items-center gap-2"
//           >
//             <Upload className="w-4 h-4" />
//             {isUploading ? 'Uploading...' : getButtonLabel()}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadBulkModal;

'use client';

import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Download, Upload } from 'lucide-react';

interface UploadBulkModalProps {
  open?: boolean;
  onClose?: () => void;
  uploadType: 'products' | 'categories';
}

const UploadBulkModal = ({ open, onClose, uploadType }: UploadBulkModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Reset state when modal closes
  React.useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setFileError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setSelectedFile(null);
      setFileError(null);
      return;
    }

    const file = files[0];
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setFileError('Please select a valid Excel or CSV file');
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setFileError('File size must be less than 10MB');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setFileError(null);
  };

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

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    setIsUploading(true);
    
    try {
      // First upload the file to get fileRef
      const fileUploadFormData = new FormData();
      fileUploadFormData.append('file', selectedFile);
      
      const fileUploadResponse = await fetch('/fileuploadservice/uploadfile', {
        method: 'POST',
        body: fileUploadFormData,
        headers: {
          'FileType': uploadType === 'products' ? 'PRODUCT' : 'PRODUCT_CATEGORY'
        },
      });

      if (!fileUploadResponse.ok) {
        throw new Error('File upload failed');
      }

      const fileUploadData = await fileUploadResponse.json();
      
      if (fileUploadData?.code !== '000') {
        throw new Error(fileUploadData?.desc || 'File upload failed');
      }

      const fileRef = fileUploadData.data?.fileRef;
      if (!fileRef) {
        throw new Error('File reference not received');
      }

      // Then make the bulk upload request with the fileRef
      const bulkUploadResponse = await fetch('/fileuploadservice/uploadfile?FILETYPE=BULK_UPLOAD', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestReference: new Date().getTime().toString(),
          fileType: uploadType === 'products' ? 'PRODUCT' : 'PRODUCT_CATEGORY',
          fileRef: fileRef
        }),
      });

      if (!bulkUploadResponse.ok) {
        throw new Error('Bulk upload failed');
      }

      const bulkUploadData = await bulkUploadResponse.json();
      
      if (bulkUploadData?.code !== '000') {
        throw new Error(bulkUploadData?.desc || `Error uploading ${uploadType}`);
      }
      
      toast.success(`${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)} uploaded successfully`);
      onClose?.();
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || `Error uploading ${uploadType}`);
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {getTitle()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <Label>Upload File</Label>
              <button
                type="button"
                onClick={downloadTemplate}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Download className="w-4 h-4 mr-1" />
                Download Template
              </button>
            </div>
            
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
            
            {fileError && (
              <p className="mt-2 text-sm text-red-600">{fileError}</p>
            )}
            
            {selectedFile && !fileError && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Selected File: {selectedFile.name}</p>
                <p className="text-sm text-gray-600">Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <p className="text-sm text-gray-600">Type: {getFileTypeLabel()}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isUploading || !selectedFile}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? 'Uploading...' : getButtonLabel()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadBulkModal;