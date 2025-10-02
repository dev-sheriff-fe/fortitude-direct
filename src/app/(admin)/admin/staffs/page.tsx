'use client'
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Download, Plus, Search, Eye, Phone, Mail, User, Edit } from 'lucide-react';
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
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Staff {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    mobileNo: string;
    userRole: string;
    branchCode: string;
    status: string;
    merchantCode: string;
    storeCode: string;
    createdAt: string;
}

interface Column {
    title: string;
    dataIndex: string;
    key: string;
    width?: number;
    render?: (value: any, record: Staff, index: number) => React.ReactNode;
}

const getStatusColor = (status: string): string => {
    if (!status) return 'bg-gray-500 text-white';

    switch (status.toUpperCase()) {
        case 'ACTIVE':
            return 'bg-green-500 text-white';
        case 'INACTIVE':
            return 'bg-red-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};

const getDisplayValue = (value: any): string => {
    return value?.toString() || 'N/A';
};

const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

const DynamicTable = ({
    columns,
    data,
    itemsPerPage = 5,
    onViewDetails,
    onEditDetails
}: {
    columns: Column[];
    data: Staff[];
    itemsPerPage?: number;
    onViewDetails: (staff: Staff) => void;
    onEditDetails: (staff: Staff) => void;
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    const handleViewDetails = (staff: Staff) => {
        setSelectedStaff(staff);
        setIsModalOpen(true);
        onViewDetails(staff);
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
                render: (text: string, record: Staff) => (
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={() => handleViewDetails(record)}
                        >
                            <Eye className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={() => onEditDetails(record)}
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                    </div>
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
                                    style={{ width: column.width ? `${column.width}px` : 'auto' }}
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr
                                key={item.id}
                                className={`border-b border-gray-200 ${index === currentData.length - 1 ? 'border-b-0' : ''}`}
                            >
                                {columnsWithHandler.map((column) => (
                                    <td key={column.key} className="p-3 text-sm">
                                        {column.render
                                            ? column.render(item[column.dataIndex as keyof Staff], item, index)
                                            : getDisplayValue(item[column.dataIndex as keyof Staff])
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
                <p className="text-sm text-gray-500">
                    Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} Staff
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="text-xs"
                    >
                        Previous
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
                        Next
                    </Button>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader className='flex flex-col'>
                        <DialogTitle>Staff Details - {selectedStaff?.firstname} {selectedStaff?.lastname}</DialogTitle>
                        <DialogDescription>
                            Detailed information about the selected staff member
                        </DialogDescription>
                    </DialogHeader>

                    {selectedStaff && (
                        <div className="py-4">
                            <div className="flex items-center gap-4 mb-6">
                                <Avatar className="w-20 h-20">
                                    <AvatarFallback className="text-lg">
                                        {getInitials(selectedStaff.firstname, selectedStaff.lastname)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {getDisplayValue(selectedStaff.firstname)} {getDisplayValue(selectedStaff.lastname)}
                                    </h3>
                                    <p className="text-sm text-gray-500">@{getDisplayValue(selectedStaff.username)}</p>
                                    <Badge className={`${getStatusColor(selectedStaff.status)} text-xs px-2 py-1 mt-1 w-fit`}>
                                        {getDisplayValue(selectedStaff.status)}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Username:</p>
                                    <p className="text-sm">{getDisplayValue(selectedStaff.username)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">User Role:</p>
                                    <p className="text-sm">{getDisplayValue(selectedStaff.userRole)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Branch Code:</p>
                                    <p className="text-sm">{getDisplayValue(selectedStaff.branchCode)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Store Code:</p>
                                    <p className="text-sm">{getDisplayValue(selectedStaff.storeCode)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Status:</p>
                                    <Badge className={`${getStatusColor(selectedStaff.status)} text-xs px-2 py-1 w-fit`}>
                                        {getDisplayValue(selectedStaff.status)}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Created At:</p>
                                    <p className="text-sm">{new Date(selectedStaff.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <h4 className="font-medium mb-3">Contact Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedStaff.mobileNo && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-500" />
                                            <p className="text-sm">{getDisplayValue(selectedStaff.mobileNo)}</p>
                                        </div>
                                    )}
                                    {selectedStaff.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-500" />
                                            <p className="text-sm">{getDisplayValue(selectedStaff.email)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

const MobileStaffCard = ({ staff, onViewDetails }: { staff: Staff; onViewDetails: (staff: Staff) => void }) => {
    return (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                        <AvatarFallback>
                            {getInitials(staff.firstname, staff.lastname)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            {getDisplayValue(staff.firstname)} {getDisplayValue(staff.lastname)}
                        </p>
                        <p className="text-xs text-gray-500">@{getDisplayValue(staff.username)}</p>
                    </div>
                </div>
                <Badge className={`${getStatusColor(staff.status)} text-xs px-2 py-1`}>
                    {getDisplayValue(staff.status)}
                </Badge>
            </div>

            <div className="text-sm text-gray-600 flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{getDisplayValue(staff.userRole)}</span>
            </div>

            {staff.mobileNo && (
                <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{getDisplayValue(staff.mobileNo)}</span>
                </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <div>
                    <p className="text-xs text-gray-500">Store Code</p>
                    <p className="text-sm font-medium">{getDisplayValue(staff.storeCode)}</p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    onClick={() => onViewDetails(staff)}
                >
                    <Eye className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};

export default function StaffsPage() {
    const { user } = useUser();
    const router = useRouter();
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['staffs-list'],
        queryFn: () => axiosInstance.request({
            url: '/usermanager/getUserMasterList',
            method: 'GET',
            params: {
                pageNumber: 1,
                pageSize: 10,
                merchantCode: user?.merchantCode,
                storeCode: user?.storeCode,
                entityCode: 'FTD',
            }
        })
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const staffs: Staff[] = data?.data?.data || [];
    const filteredStaffs = staffs.filter(staff =>
        staff.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.mobileNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewDetails = (staff: Staff) => {
        setSelectedStaff(staff);
        setIsModalOpen(true);
    };

    const handleEditDetails = (staff: Staff) => {
        router.push(`/admin/staffs/create-staff?edit=true&id=${staff.username}`);
    };

    const columns: Column[] = [
        {
            title: 'Staff',
            dataIndex: 'firstname',
            key: 'staff',
            width: 200,
            render: (text: string, record: Staff) => (
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                        <AvatarFallback>
                            {getInitials(record.firstname, record.lastname)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            {getDisplayValue(record.firstname)} {getDisplayValue(record.lastname)}
                        </p>
                        <p className="text-xs text-gray-500">@{getDisplayValue(record.username)}</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            render: (text: string) => (
                <p className="text-sm">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Phone',
            dataIndex: 'mobileNo',
            key: 'mobileNo',
            width: 150,
            render: (text: string) => (
                <p className="text-sm">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'userRole',
            key: 'role',
            width: 150,
            render: (text: string) => (
                <p className="text-sm font-medium">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (text: string) => (
                <Badge className={`${getStatusColor(text)} text-xs px-2 py-1 w-fit`}>
                    {getDisplayValue(text)}
                </Badge>
            ),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: 100,
            render: (text: string, record: Staff) => (
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1"
                        onClick={() => handleViewDetails(record)}
                    >
                        <Eye className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1"
                        onClick={() => handleEditDetails(record)}
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                Staff Management
                            </h1>
                            <p className="text-muted-foreground">
                                View and manage your staff members
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{staffs.length}</p>
                        <p className="text-sm text-muted-foreground">Total Staff</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search staff..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Link href="/admin/staffs/create-staff" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add Staff
                                </Button>
                            </Link>
                            <Button variant="outline" className="gap-2">
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Export</span>
                            </Button>
                        </div>
                    </div>

                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Staff List
                                </CardTitle>
                                <Button variant="outline" size="sm" onClick={() => refetch()}>
                                    Refresh
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center items-center h-40">
                                    <p className="text-gray-500">Loading staff...</p>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-40">
                                    <p className="text-red-500">Error loading staff</p>
                                </div>
                            ) : staffs.length === 0 ? (
                                <div className="flex justify-center items-center h-40 flex-col gap-4">
                                    <p className="text-gray-500">No staff members found</p>
                                    <Link href="/admin/staffs/create-staff">
                                        <Button className="gap-2">
                                            <Plus className="w-4 h-4" />
                                            Add Your First Staff
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="block lg:hidden space-y-4">
                                        {filteredStaffs.map((staff) => (
                                            <MobileStaffCard
                                                key={staff.id}
                                                staff={staff}
                                                onViewDetails={handleViewDetails}
                                            />
                                        ))}
                                    </div>

                                    <div className="hidden lg:block">
                                        <DynamicTable
                                            columns={columns}
                                            data={filteredStaffs}
                                            onViewDetails={handleViewDetails}
                                            onEditDetails={handleEditDetails}
                                        />
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}