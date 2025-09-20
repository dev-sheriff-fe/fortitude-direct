import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Table from 'rc-table';
import React from 'react'

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
const TransactionsList = ({data}:{data:any}) => {
     const columns = [
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
      render: (text: string, record:any) => (
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
    {
      title: 'Address',
      dataIndex: 'fromAddress',
      key: 'fromAddress',
      render: (text: string) => (
        <p className="text-sm text-gray-900 max-w-[120px] truncate" title={text}>
          {text || 'N/A'}
        </p>
      ),
    },
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
    // {
    //   title: 'Actions',
    //   dataIndex: 'actions',
    //   key: 'actions',
    //   render: (text: string, record: Transaction) => (
    //     <Button 
    //       variant="ghost" 
    //       size="sm" 
    //       className="p-1"
    //       onClick={() => handleViewDetails(record)}
    //     >
    //       <Eye className="w-4 h-4" />
    //     </Button>
    //   ),
    // },
  ];
  return (
    <div className="bg-card rounded-lg border">
      <Table
        columns={columns}
        data={data}
        rowKey="id"
        scroll={{ x: 1200 }}
        className=""
        emptyText={
          <div className="text-center py-8">
            <p className="text-muted-foreground">No categories found</p>
          </div>
        }
        />
    </div>
  )
}

export default TransactionsList