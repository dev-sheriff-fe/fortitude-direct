// 'use client'
// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Download, FileText, Loader2, Calendar, Filter, RefreshCw } from 'lucide-react';
// import { useQuery, useMutation } from '@tanstack/react-query';
// import axiosInstance from '@/utils/fetch-function';
// import useUser from '@/store/userStore';
// import DynamicReportTable from './dynamic-table';

// interface ReportDefinition {
//   id: string;
//   code: string;
//   name: string;
//   description: string;
//   category: string;
//   hasFilters: boolean;
//   requiresDateRange: boolean;
// }

// interface ReportFilter {
//   startDate?: string;
//   endDate?: string;
//   status?: string;
//   transactionType?: string;
//   walletId?: string;
//   merchantCode?: string;
//   terminalId?: string;
//   keyword?: string;
// }

// interface ReportData {
//   [key: string]: any;
// }

// interface GenerateReportProps {
//   report: ReportDefinition;
//   isOpen: boolean;
//   onClose: () => void;
//   filters: ReportFilter;
// }

// const GenerateReport: React.FC<GenerateReportProps> = ({
//   report,
//   isOpen,
//   onClose,
//   filters
// }) => {
//   const { user } = useUser();
//   const [localFilters, setLocalFilters] = useState<ReportFilter>(filters);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // Fetch report data
//   const { 
//     data: reportData, 
//     isLoading, 
//     error, 
//     refetch,
//     isFetching 
//   } = useQuery({
//     queryKey: ['report-data', report.code, localFilters, currentPage],
//     queryFn: () => axiosInstance.request({
//       url: '/reports/generate',
//       method: 'POST',
//       data: {
//         reportCode: report.code,
//         filters: localFilters,
//         entityCode: user?.entityCode,
//         page: currentPage,
//         limit: itemsPerPage
//       }
//     }),
//     enabled: isOpen,
//     select: (response: any) => ({
//       data: response.data?.data || [],
//       totalCount: response.data?.totalCount || 0,
//       currentPage: response.data?.currentPage || 1,
//       totalPages: response.data?.totalPages || 1
//     })
//   });

//   // Download report mutation
//   const downloadMutation = useMutation({
//     mutationFn: () => axiosInstance.request({
//       url: '/reports/download',
//       method: 'POST',
//       data: {
//         reportCode: report.code,
//         filters: localFilters,
//         entityCode: user?.entityCode,
//         format: 'PDF'
//       },
//       responseType: 'blob'
//     }),
//     onSuccess: (response) => {
//       // Create download link
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${report.code}_${new Date().toISOString().split('T')[0]}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     },
//     onError: (error: any) => {
//       console.error('Download failed:', error);
//     }
//   });

//   const handleDownload = () => {
//     downloadMutation.mutate();
//   };

//   const handleApplyFilters = (newFilters: ReportFilter) => {
//     setLocalFilters(newFilters);
//     setCurrentPage(1);
//     refetch();
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleRefresh = () => {
//     refetch();
//   };

//   const totalRecords = reportData?.totalCount || 0;
//   const currentData = reportData?.data || [];
//   const totalPages = reportData?.totalPages || 1;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <DialogTitle className="flex items-center gap-2">
//                 <FileText className="w-5 h-5 text-blue-600" />
//                 {report.name}
//               </DialogTitle>
//               <DialogDescription>
//                 {report.description}
//               </DialogDescription>
//             </div>
//             <div className="flex items-center gap-2">
//               <Badge variant="outline" className="text-sm">
//                 {report.code}
//               </Badge>
//               <Badge className="bg-blue-100 text-blue-800">
//                 {report.category}
//               </Badge>
//             </div>
//           </div>
//         </DialogHeader>

//         {/* Report Summary */}
//         <div className="bg-gray-50 rounded-lg p-4 mb-6">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div>
//               <p className="text-sm text-gray-500">Total Records</p>
//               <p className="text-lg font-semibold">{totalRecords}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Generated On</p>
//               <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Date Range</p>
//               <p className="text-sm font-medium">
//                 {localFilters.startDate ? new Date(localFilters.startDate).toLocaleDateString() : 'N/A'} - 
//                 {localFilters.endDate ? new Date(localFilters.endDate).toLocaleDateString() : 'N/A'}
//               </p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Status Filter</p>
//               <p className="text-sm font-medium">{localFilters.status || 'All'}</p>
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <Button
//               onClick={handleDownload}
//               disabled={downloadMutation.isPending || isLoading || totalRecords === 0}
//               className="bg-green-600 hover:bg-green-700 text-white"
//             >
//               {downloadMutation.isPending ? (
//                 <>
//                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                   Downloading...
//                 </>
//               ) : (
//                 <>
//                   <Download className="w-4 h-4 mr-2" />
//                   Download Report
//                 </>
//               )}
//             </Button>
            
//             <Button
//               variant="outline"
//               onClick={handleRefresh}
//               disabled={isLoading || isFetching}
//               className="flex items-center gap-2"
//             >
//               {isLoading || isFetching ? (
//                 <Loader2 className="w-4 h-4 animate-spin" />
//               ) : (
//                 <RefreshCw className="w-4 h-4" />
//               )}
//               Refresh
//             </Button>
//           </div>

//           <div className="text-sm text-gray-500">
//             Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords} records
//           </div>
//         </div>

//         {/* Report Data Table */}
//         {isLoading ? (
//           <div className="flex justify-center items-center h-40">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//             <p className="ml-3 text-gray-600">Loading report data...</p>
//           </div>
//         ) : error ? (
//           <div className="flex justify-center items-center h-40">
//             <p className="text-red-500">Error loading report data</p>
//           </div>
//         ) : totalRecords === 0 ? (
//           <div className="flex justify-center items-center h-40">
//             <p className="text-gray-500">No data found for the selected criteria</p>
//           </div>
//         ) : (
//           <DynamicReportTable
//             data={currentData}
//             totalRecords={totalRecords}
//             currentPage={currentPage}
//             itemsPerPage={itemsPerPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         )}

//         {/* Footer Actions */}
//         <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//           <Button variant="outline" onClick={onClose}>
//             Close
//           </Button>
//           <Button
//             onClick={handleDownload}
//             disabled={downloadMutation.isPending || totalRecords === 0}
//             className="bg-blue-600 hover:bg-blue-700 text-white"
//           >
//             {downloadMutation.isPending ? (
//               <>
//                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                 Generating...
//               </>
//             ) : (
//               <>
//                 <Download className="w-4 h-4 mr-2" />
//                 Download
//               </>
//             )}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default GenerateReport;

'use client'
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Loader2, RefreshCw } from 'lucide-react';
import DynamicReportTable from './dynamic-table';
import { useReports, ReportFilters as ReportFiltersType } from '@/app/hooks/useReports';

interface ReportDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  hasFilters: boolean;
  requiresDateRange: boolean;
}

interface GenerateReportProps {
  report: ReportDefinition;
  isOpen: boolean;
  onClose: () => void;
  filters: ReportFiltersType;
}

const GenerateReport: React.FC<GenerateReportProps> = ({
  report,
  isOpen,
  onClose,
  filters
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [localFilters, setLocalFilters] = useState<ReportFiltersType>(filters);
  const itemsPerPage = 10;

  const { 
    generateReport,
    generateReportData,
    isGenerating,
    generateError,
    downloadReport,
    isDownloading
  } = useReports();

  useEffect(() => {
    if (isOpen && report) {
      handleGenerateData();
    }
  }, [isOpen, report, currentPage]);

  const handleGenerateData = async () => {
    try {
      await generateReport({
        reportCode: report.code,
        filters: {
          ...localFilters,
          page: currentPage,
          limit: itemsPerPage
        }
      });
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadReport({
        reportCode: report.code,
        filters: localFilters,
        format: 'PDF'
      });
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const handleApplyFilters = (newFilters: ReportFiltersType) => {
    setLocalFilters(newFilters);
    setCurrentPage(1);
    handleGenerateData();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    handleGenerateData();
  };

  const reportData = generateReportData || {
    data: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 1
  };

  const totalRecords = reportData.totalCount || 0;
  const currentData = reportData.data || [];
  const totalPages = reportData.totalPages || 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                {report.name}
              </DialogTitle>
              <DialogDescription>
                {report.description}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {report.code}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                {report.category}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Records</p>
              <p className="text-lg font-semibold">{totalRecords}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Generated On</p>
              <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date Range</p>
              <p className="text-sm font-medium">
                {localFilters.startDate ? new Date(localFilters.startDate).toLocaleDateString() : 'N/A'} - 
                {localFilters.endDate ? new Date(localFilters.endDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status Filter</p>
              <p className="text-sm font-medium">{localFilters.status || 'All'}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDownload}
              disabled={isDownloading || isGenerating || totalRecords === 0}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Refresh
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords} records
          </div>
        </div>

        {isGenerating ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="ml-3 text-gray-600">Loading report data...</p>
          </div>
        ) : generateError ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-red-500">Error loading report data</p>
            <Button 
              variant="outline" 
              className="ml-4"
              onClick={handleRefresh}
            >
              Retry
            </Button>
          </div>
        ) : totalRecords === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">No data found for the selected criteria</p>
          </div>
        ) : (
          <DynamicReportTable
            data={currentData}
            totalRecords={totalRecords}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading || totalRecords === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateReport;