// import { useQuery, useMutation } from '@tanstack/react-query';
// import axiosInstance from '@/utils/fetch-function';
// import useUser from '@/store/userStore';

// export interface ReportDefinition {
//   id: string;
//   code: string;
//   name: string;
//   description: string;
//   category: string;
//   hasFilters: boolean;
//   requiresDateRange: boolean;
// }

// export interface ReportData {
//   [key: string]: any;
// }

// export interface ReportFilters {
//   startDate?: string;
//   endDate?: string;
//   status?: string;
//   transactionType?: string;
//   walletId?: string;
//   merchantCode?: string;
//   terminalId?: string;
//   keyword?: string;
//   page?: number;
//   limit?: number;
// }

// export interface ReportResponse {
//   data: ReportData[];
//   totalCount: number;
//   currentPage: number;
//   totalPages: number;
// }

// export const useReports = () => {
//   const { user } = useUser();

//   // Fetch report definitions
//   const { 
//     data: reportDefinitions, 
//     isLoading: isLoadingDefinitions,
//     error: definitionsError,
//     refetch: refetchDefinitions 
//   } = useQuery({
//     queryKey: ['report-definitions'],
//     queryFn: async () => {
//       const response = await axiosInstance.request({
//         url: '/reports/definitions',
//         method: 'GET',
//         params: { entityCode: user?.entityCode }
//       });
//       return response.data?.data || [];
//     },
//     enabled: !!user?.entityCode
//   });

//   // Generate report data mutation
//   const generateReportMutation = useMutation({
//     mutationFn: async ({ reportCode, filters }: { reportCode: string; filters: ReportFilters }) => {
//       const response = await axiosInstance.request({
//         url: '/reports/generate',
//         method: 'POST',
//         data: {
//           reportCode,
//           filters: {
//             ...filters,
//             entityCode: user?.entityCode
//           }
//         }
//       });
//       return {
//         data: response.data?.data || [],
//         totalCount: response.data?.totalCount || 0,
//         currentPage: response.data?.currentPage || 1,
//         totalPages: response.data?.totalPages || 1
//       };
//     }
//   });

//   // Download report mutation
//   const downloadReportMutation = useMutation({
//     mutationFn: async ({ 
//       reportCode, 
//       filters, 
//       format = 'PDF' 
//     }: { 
//       reportCode: string; 
//       filters: ReportFilters;
//       format?: 'PDF' | 'EXCEL' | 'CSV';
//     }) => {
//       const response = await axiosInstance.request({
//         url: '/reports/download',
//         method: 'POST',
//         data: {
//           reportCode,
//           filters: {
//             ...filters,
//             entityCode: user?.entityCode
//           },
//           format
//         },
//         responseType: 'blob'
//       });
//       return response;
//     },
//     onSuccess: (response, variables) => {
//       // Create download link
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `${variables.reportCode}_${new Date().toISOString().split('T')[0]}.${(variables.format ?? 'PDF').toLowerCase()}`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     }
//   });

//   return {
//     // Report definitions
//     reportDefinitions,
//     isLoadingDefinitions,
//     definitionsError,
//     refetchDefinitions,

//     // Generate report data and state
//     generateReport: generateReportMutation.mutateAsync,
//     generateReportData: generateReportMutation.data, // Fixed: was generatedReport
//     isGenerating: generateReportMutation.isPending,
//     generateError: generateReportMutation.error,

//     // Download report
//     downloadReport: downloadReportMutation.mutateAsync,
//     isDownloading: downloadReportMutation.isPending,
//     downloadError: downloadReportMutation.error,

//     // Mutation utilities
//     resetGenerate: generateReportMutation.reset,
//     resetDownload: downloadReportMutation.reset
//   };
// };

import { useQuery, useMutation } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import useUser from '@/store/userStore';

export interface ReportDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  hasFilters: boolean;
  requiresDateRange: boolean;
}

export interface ReportData {
  [key: string]: any;
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  transactionType?: string;
  walletId?: string;
  merchantCode?: string;
  terminalId?: string;
  keyword?: string;
  page?: number;
  limit?: number;
  tranCode?: string;
  tranStatus?: string;
  code?: string;
}

export interface ReportResponse {
  data: ReportData[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export const useReports = () => {
  const { user } = useUser();
  const entityCode = process.env.NEXT_PUBLIC_ENTITYCODE || user?.entityCode || 'FTD';
  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return date.toLocaleDateString('en-GB').split('/').reverse().join('-');
  };

  const generateReportMutation = useMutation({
    mutationFn: async ({ reportCode, filters }: { reportCode: string; filters: ReportFilters }) => {
      const response = await axiosInstance.request({
        url: '/dashboard/generateReport',
        method: 'POST',
        params: { entityCode: entityCode },
        data: {
          entityCode: entityCode,
          startDate: formatDate(filters.startDate ? new Date(filters.startDate) : null) || '01-01-2025',
          endDate: formatDate(filters.endDate ? new Date(filters.endDate) : null) || '31-12-2025',
          datePeriod: 'M',
          tranCode: filters.tranCode || '',
          keyword: filters.keyword || '',
          pageSize: 5000,
          tranStatus: filters.tranStatus || '',
          terminalId: filters.terminalId || '',
          pageNumber: 1,
          reportCode: reportCode,
          merchantCode: filters.merchantCode || '',
          offset: '0',
        },
      });
      return {
        data: response.data?.data || [],
        totalCount: response.data?.totalCount || 0,
        currentPage: response.data?.currentPage || 1,
        totalPages: response.data?.totalPages || 1
      };
    }
  });

  const downloadReportMutation = useMutation({
    mutationFn: async ({
      reportCode,
      filters,
      format = 'PDF'
    }: {
      reportCode: string;
      filters: ReportFilters;
      format?: 'PDF' | 'EXCEL' | 'CSV';
    }) => {
      const response = await axiosInstance.request({
        url: '/reports/download',
        method: 'POST',
        data: {
          reportCode,
          filters: {
            ...filters,
            entityCode: user?.entityCode
          },
          format
        },
        responseType: 'blob'
      });
      return response;
    },
    onSuccess: (response, variables) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${variables.reportCode}_${new Date().toISOString().split('T')[0]}.${(variables.format ?? 'PDF').toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
  });

  return {
    generateReport: generateReportMutation.mutateAsync,
    generateReportData: generateReportMutation.data,
    isGenerating: generateReportMutation.isPending,
    generateError: generateReportMutation.error,

    downloadReport: downloadReportMutation.mutateAsync,
    isDownloading: downloadReportMutation.isPending,
    downloadError: downloadReportMutation.error,

    resetGenerate: generateReportMutation.reset,
    resetDownload: downloadReportMutation.reset
  };
};