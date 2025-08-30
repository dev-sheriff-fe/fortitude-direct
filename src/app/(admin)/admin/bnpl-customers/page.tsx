'use client'
import React, { useState } from 'react';
import Table from 'rc-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Eye, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/fetch-function';
import Link from 'next/link';

interface CreditRecord {
  id: string;
  username: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  creditScore: number;
  creditLimit: number;
  grading: 'EXCELLENT' | 'VERY GOOD' | 'GOOD' | 'FAIR' | 'POOR';
  status: 'SUCCESS' | 'PENDING' | 'DECLINED';
  applicationDate: string;
  entityCode: string;
}


const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Approved':
      return 'secondary';
    case 'Pending':
      return 'outline';
    case 'Suspended':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getGradingColor = (grading: string) => {
  switch (grading) {
    case 'EXCELLENT':
      return 'text-green-600';
    case 'VERY GOOD':
      return 'text-blue-600';
    case 'GOOD':
      return 'text-yellow-600';
    case 'FAIR':
      return 'text-red-600';
    default:
      return 'text-muted-foreground';
  }
};

const CreditAssessment = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  // const [filteredData, setFilteredData] = React.useState(mockData);
  const [page,setPage] = useState(1)
  // React.useEffect(() => {
  //   const filtered = mockData.filter(record =>
  //     record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     record.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     record.email.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredData(filtered);
  // }, [searchTerm]);


  const {data,isLoading,error} = useQuery({
    queryKey: ['bnpl-customers'],
    queryFn: ()=>axiosInstance.request({
      url: '/credit-assessments/fetchAll',
      method: 'GET',
      params: {
        pageNumber: page,
        pageSize: 100
      }
    })
  })

  console.log(data);
  
  const columns = [
    {
      title: 'No',
      dataIndex: 'id',
      key: 'no',
      width: 50,
      render: (_: any, __: any, index: number) => (
        <span className="text-muted-foreground font-medium">{index + 1}</span>
      ),
    },
    {
      title: 'User Info',
      key: 'userInfo',
      width: 180,
      render: (record: CreditRecord) => (
        <div className="space-y-1">
          <div className="font-medium text-foreground">{record?.customerName}</div>
          <div className="text-xs text-muted-foreground">@{record.username}</div>
          <div className="text-xs text-muted-foreground">{record.customerPhone}</div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'customerEmail',
      key: 'customerEmail',
      width: 200,
      render: (email: string) => (
        <span className="text-sm text-muted-foreground text-nowrap">{email}</span>
      ),
    },
    {
      title: 'Credit Info',
      key: 'creditInfo',
      width: 130,
      render: (record: CreditRecord) => (
        <div className="space-y-1">
          <div className="font-semibold text-foreground">Score: {record.creditScore}</div>
          <div className="font-semibold text-foreground">
            Limit: ${record.creditLimit.toLocaleString()}
          </div>
          <div className={`font-bold text-sm ${getGradingColor(record.grading)}`}>
            Grade: {record.grading}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Badge variant={getStatusVariant(status) as any} className="text-xs">
          {status}
        </Badge>
      ),
    },
    {
      title: 'App Date',
      dataIndex: 'applicationDate',
      key: 'applicationDate',
      width: 100,
      render: (date: string) => (
        <span className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: '2-digit'
          })}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (record: CreditRecord) => (
        <div className="flex gap-1">
          <Link href={`/admin/bnpl-customers/edit/${record.id}`}>
            <Button
            size="sm"
            variant="outline"
            onClick={() => console.log('Edit score for:', record.id)}
            className="h-8 w-8 p-0"
            title="Edit"
          >
            <Edit className="h-3 w-3" />
          </Button>
          </Link>
          <Link href={`/admin/bnpl-customers/${record.username}?entityCode=${record.entityCode}`}>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              title="View Details"
            >
              <Eye className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-full mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Credit Assessment Record</h1>
          <p className="text-muted-foreground">
            Manage customer credit facilities and assessment records
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, username, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Customer Records</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <Table
                columns={columns}
                data={data?.data?.creditAssessmentList}
                rowKey="id"
                className="min-w-full"
                scroll={{ x: 860 }}
                emptyText={
                  <div className="text-center py-8 text-muted-foreground">
                    No records found
                  </div>
                }
                components={{
                  table: (props: any) => (
                    <table {...props} className="min-w-full border-collapse" />
                  ),
                  header: {
                    wrapper: (props: any) => <thead {...props} />,
                    row: (props: any) => (
                      <tr {...props} className="border-b border-border" />
                    ),
                    cell: (props: any) => (
                      <th
                        {...props}
                        className="px-3 py-3 text-left text-xs font-medium text-muted-foreground bg-muted/50 whitespace-nowrap"
                      />
                    ),
                  },
                  body: {
                    wrapper: (props: any) => <tbody {...props} />,
                    row: (props: any) => (
                      <tr
                        {...props}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      />
                    ),
                    cell: (props: any) => (
                      <td {...props} className="px-3 py-3 text-sm align-top" />
                    ),
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreditAssessment;