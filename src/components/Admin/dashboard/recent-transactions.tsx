'use client'
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import useUser from '@/store/userStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Transaction {
  date: string;
  amount: number;
  currency: string | null;
  status: string;
  fromAddress: string;
  name: string;
  tranRefNo: string;
}

interface DynamicTableProps {
  columns: Column[];
  data: Transaction[];
  itemsPerPage?: number;
  onViewDetails: (transaction: Transaction) => void;
}

interface Column {
  title: string;
  dataIndex: string;
  key: string;
  render?: (value: any, record: Transaction, index: number) => React.ReactNode;
}

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'success':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const DynamicTable: React.FC<DynamicTableProps> = ({ 
  columns, 
  data, 
  itemsPerPage = 5,
  onViewDetails 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
    onViewDetails(transaction);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const columnsWithHandler = columns.map(col => {
    if (col.key === 'actions') {
      return {
        ...col,
        render: (text: string, record: Transaction) => (
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1"
            onClick={() => handleViewDetails(record)}
          >
            <Eye className="w-4 h-4" />
          </Button>
        )
      };
    }
    return col;
  });

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              {columnsWithHandler.map((column) => (
                <th 
                  key={column.key} 
                  className="text-left p-3 font-bold text-sm text-gray-700"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr 
                key={index} 
                className={`border-b border-gray-200 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
              >
                {columnsWithHandler.map((column) => (
                  <td key={column.key} className="p-3 text-sm">
                    {column.render 
                      ? column.render(item[column.dataIndex as keyof Transaction], item, index)
                      : item[column.dataIndex as keyof Transaction]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
        <p className="text-sm text-gray-500">
          Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
        </p>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            className="text-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Transaction Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className='flex flex-col'>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected transaction
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Reference No:</p>
                <p className="text-sm">{selectedTransaction.tranRefNo}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Date:</p>
                <p className="text-sm">{selectedTransaction.date}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Amount:</p>
                <p className="text-sm">{selectedTransaction.amount}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Currency:</p>
                <p className="text-sm">{selectedTransaction.currency || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Status:</p>
                <Badge className={getStatusColor(selectedTransaction.status)}>
                  {selectedTransaction.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">From Address:</p>
                <p className="text-sm break-all">{selectedTransaction.fromAddress || 'N/A'}</p>
              </div>
              <div className="space-y-2 col-span-2">
                <p className="text-sm font-medium">Name:</p>
                <p className="text-sm">{selectedTransaction.name || 'N/A'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function TransactionHistory(): React.ReactElement {
  const { user } = useUser();
  const { data, isLoading, error } = useQuery({
    queryKey: ['recent-trans'],
    queryFn: () => axiosInstance.request({
      url: '/store-dashboard/fetchRecentTrans',
      method: 'GET',
      params: {
        storeCode: user?.storeCode ||  process.env.NEXT_PUBLIC_STORE_CODE,
        entityCode: user?.entityCode || process.env.NEXT_PUBLIC_ENTITY_CODE,
        pageNumber: 1,
        pageSize: 10
      }
    })
  });

  // Format API data for the table
  const transactions: Transaction[] = data?.data?.transactions || [];

  const handleViewDetails = (transaction: Transaction) => {
    console.log('Transaction details:', transaction);
    // You can add additional logic here if needed
  };

  const columns: Column[] = [
    {
      title: 'Ref. No',
      dataIndex: 'tranRefNo',
      key: 'tranRefNo',
      render: (text: string) => (
        <p className="text-sm font-semibold text-gray-900 truncate">{text}</p>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => (
        <p className="text-sm text-gray-900 min-w-[80px]">{text}</p>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Transaction) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-blue-500 text-white text-xs">
              {text ? text.split(' ').map(n => n[0]).join('') : 'N/A'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900">{text || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number) => (
        <span className="text-sm font-semibold text-green-600">{text}</span>
      ),
    },
    // {
    //   title: 'Address',
    //   dataIndex: 'fromAddress',
    //   key: 'fromAddress',
    //   render: (text: string) => (
    //     <p className="text-sm text-gray-900 max-w-[120px] truncate" title={text}>
    //       {text || 'N/A'}
    //     </p>
    //   ),
    // },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (
        <Badge className={`${getStatusColor(text)} text-xs px-2 py-1 border`}>
          {text}
        </Badge>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text: string, record: Transaction) => (
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-1"
          onClick={() => handleViewDetails(record)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base lg:text-lg font-semibold text-gray-900">
            Recent Transactions
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-red-500">Error loading transactions</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          <DynamicTable 
            columns={columns} 
            data={transactions} 
            onViewDetails={handleViewDetails}
          />
        )}
      </CardContent>
    </Card>
  );
}