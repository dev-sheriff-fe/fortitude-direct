'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  FileText,
  Download
} from 'lucide-react';

interface ReportData {
  [key: string]: any;
}

interface Column {
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
  render?: (value: any, record: ReportData, index: number) => React.ReactNode;
}

interface DynamicReportTableProps {
  data: ReportData[];
  totalRecords: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getDisplayValue = (value: any): string => {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }
  return value.toString();
};

const formatColumnHeader = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

const formatCellValue = (value: any, key: string): React.ReactNode => {
  if (value === null || value === undefined || value === '') {
    return (
      <Badge variant="outline" className="text-xs bg-gray-100 text-gray-500">
        N/A
      </Badge>
    );
  }

  if (typeof value === 'string' && !isNaN(Date.parse(value)) && key.toLowerCase().includes('date')) {
    return new Date(value).toLocaleDateString();
  }

  if ((key.toLowerCase().includes('amount') || key.toLowerCase().includes('price')) && !isNaN(Number(value))) {
    return (
      <span className="font-semibold text-green-600">
        ${Number(value).toFixed(2)}
      </span>
    );
  }

  if (key.toLowerCase().includes('status')) {
    const statusColor = getStatusColor(value);
    return (
      <Badge className={`${statusColor} text-xs px-2 py-1`}>
        {getDisplayValue(value)}
      </Badge>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <Badge className={value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} variant="outline">
        {value ? 'Yes' : 'No'}
      </Badge>
    );
  }

  if (typeof value === 'string' && value.length > 50) {
    return (
      <span title={value} className="truncate max-w-[200px] block">
        {value.substring(0, 50)}...
      </span>
    );
  }

  return getDisplayValue(value);
};

const getStatusColor = (status: string): string => {
  if (!status) return 'bg-gray-100 text-gray-800';

  switch (status.toLowerCase()) {
    case 'success':
    case 'completed':
    case 'active':
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'failed':
    case 'cancelled':
    case 'rejected':
    case 'inactive':
      return 'bg-red-100 text-red-800';
    case 'pending':
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const DynamicReportTable: React.FC<DynamicReportTableProps> = ({
  data,
  totalRecords,
  currentPage,
  itemsPerPage,
  totalPages,
  onPageChange
}) => {
  const generateColumns = (): Column[] => {
    if (!data || data.length === 0) return [];

    const sampleRecord = data[0];
    return Object.keys(sampleRecord).map((key) => ({
      title: formatColumnHeader(key),
      dataIndex: key,
      key: key,
      width: 200,
      render: (value: any, record: ReportData, index: number) => (
        <div className="py-2">
          {formatCellValue(value, key)}
        </div>
      ),
    }));
  };

  const columns = generateColumns();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalRecords);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 border rounded-lg bg-gray-50">
        <FileText className="w-12 h-12 text-gray-400 mb-2" />
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="text-left p-4 font-bold text-sm text-gray-700 uppercase tracking-wider"
                    style={{ width: column.width ? `${column.width}px` : 'auto' }}
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={`${startIndex + index}`}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                    index === data.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="p-4 text-sm">
                      {column.render
                        ? column.render(item[column.dataIndex], item, startIndex + index)
                        : formatCellValue(item[column.dataIndex], column.key)
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1} to {endIndex} of {totalRecords} records
        </div>
        
        <div className="flex items-center gap-1">
          {/* First Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="w-8 h-8 p-0"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {getPageNumbers().map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              className="w-8 h-8 p-0 text-xs"
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 p-0"
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-sm text-gray-500">
          {itemsPerPage} per page
        </div>
      </div>
    </div>
  );
};

export default DynamicReportTable;