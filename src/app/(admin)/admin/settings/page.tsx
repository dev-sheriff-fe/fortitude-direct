'use client'
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Plus, Search, Eye, Edit, Trash2, Settings } from 'lucide-react';
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

interface StoreSetting {
    id: number;
    settingCode: string;
    settingType: string;
    description: string;
    value: string;
    status: string;
    merchantCode: string;
    storeCode: string;
    createdAt: string;
    updatedAt: string;
}

interface Column {
    title: string;
    dataIndex: string;
    key: string;
    width?: number;
    render?: (value: any, record: StoreSetting, index: number) => React.ReactNode;
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

const getSettingTypeColor = (type: string): string => {
    switch (type?.toLowerCase()) {
        case 'business_hours':
            return 'bg-blue-100 text-blue-800';
        case 'payment_methods':
            return 'bg-green-100 text-green-800';
        case 'shipping_options':
            return 'bg-purple-100 text-purple-800';
        case 'general':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-orange-100 text-orange-800';
    }
};

const DynamicTable = ({
    columns,
    data,
    itemsPerPage = 5,
    onViewDetails,
    onEditDetails
}: {
    columns: Column[];
    data: StoreSetting[];
    itemsPerPage?: number;
    onViewDetails: (setting: StoreSetting) => void;
    onEditDetails: (setting: StoreSetting) => void;
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSetting, setSelectedSetting] = useState<StoreSetting | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    const handleViewDetails = (setting: StoreSetting) => {
        setSelectedSetting(setting);
        setIsModalOpen(true);
        onViewDetails(setting);
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
                render: (text: string, record: StoreSetting) => (
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
                                            ? column.render(item[column.dataIndex as keyof StoreSetting], item, index)
                                            : getDisplayValue(item[column.dataIndex as keyof StoreSetting])
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
                    Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} Settings
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
                        <DialogTitle>Setting Details - {selectedSetting?.settingCode || 'N/A'}</DialogTitle>
                        <DialogDescription>
                            Detailed information about the store setting
                        </DialogDescription>
                    </DialogHeader>

                    {selectedSetting && (
                        <div className="py-4">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold">{getDisplayValue(selectedSetting.settingCode)}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge className={`${getSettingTypeColor(selectedSetting.settingType)} text-xs px-2 py-1`}>
                                            {getDisplayValue(selectedSetting.settingType)}
                                        </Badge>
                                        <Badge className={`${getStatusColor(selectedSetting.status)} text-xs px-2 py-1`}>
                                            {getDisplayValue(selectedSetting.status)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Setting Code:</p>
                                    <p className="text-sm font-mono bg-gray-50 p-2 rounded">{getDisplayValue(selectedSetting.settingCode)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Setting Type:</p>
                                    <p className="text-sm">{getDisplayValue(selectedSetting.settingType)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Store Code:</p>
                                    <p className="text-sm">{getDisplayValue(selectedSetting.storeCode)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Merchant Code:</p>
                                    <p className="text-sm">{getDisplayValue(selectedSetting.merchantCode)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Status:</p>
                                    <Badge className={`${getStatusColor(selectedSetting.status)} text-xs px-2 py-1 w-fit`}>
                                        {getDisplayValue(selectedSetting.status)}
                                    </Badge>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-medium mb-3">Description</h4>
                                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                    {getDisplayValue(selectedSetting.description)}
                                </p>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <h4 className="font-medium mb-3">Setting Value</h4>
                                <div className="bg-gray-50 p-3 rounded">
                                    <pre className="text-sm whitespace-pre-wrap break-words">
                                        {getDisplayValue(selectedSetting.value)}
                                    </pre>
                                </div>
                            </div>

                            <div className="border-t pt-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Created At:</p>
                                    <p className="text-sm">{new Date(selectedSetting.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Updated At:</p>
                                    <p className="text-sm">{new Date(selectedSetting.updatedAt).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

const MobileSettingCard = ({ setting, onViewDetails }: { setting: StoreSetting; onViewDetails: (setting: StoreSetting) => void }) => {
    return (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{getDisplayValue(setting.settingCode)}</p>
                        <p className="text-xs text-gray-500">{getDisplayValue(setting.settingType)}</p>
                    </div>
                </div>
                <Badge className={`${getStatusColor(setting.status)} text-xs px-2 py-1`}>
                    {getDisplayValue(setting.status)}
                </Badge>
            </div>

            <div className="text-sm text-gray-600">
                <p className="line-clamp-2">{getDisplayValue(setting.description)}</p>
            </div>

            <div className="text-sm text-gray-600">
                <p className="font-medium">Value:</p>
                <p className="text-xs bg-white p-2 rounded mt-1 line-clamp-2">{getDisplayValue(setting.value)}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <div>
                    <p className="text-xs text-gray-500">Store Code</p>
                    <p className="text-sm font-medium">{getDisplayValue(setting.storeCode)}</p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    onClick={() => onViewDetails(setting)}
                >
                    <Eye className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};

export default function StoreSettingsPage() {
    const { user } = useUser();
    const router = useRouter();
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['store-settings-list'],
        queryFn: () => axiosInstance.request({
            url: '/store-settings/list',
            method: 'GET',
            params: {
                merchantCode: user?.merchantCode,
                storeCode: user?.storeCode
            }
        })
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSetting, setSelectedSetting] = useState<StoreSetting | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const settings: StoreSetting[] = data?.data?.data || [];
    const filteredSettings = settings.filter(setting =>
        setting.settingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        setting.settingType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        setting.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        setting.value.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewDetails = (setting: StoreSetting) => {
        setSelectedSetting(setting);
        setIsModalOpen(true);
    };

    const handleEditDetails = (setting: StoreSetting) => {
        router.push(`/admin/settings/add-settings?edit=true&id=${setting.id}`);
    };

    const columns: Column[] = [
        {
            title: 'Setting Code',
            dataIndex: 'settingCode',
            key: 'settingCode',
            width: 200,
            render: (text: string, record: StoreSetting) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">{getDisplayValue(text)}</p>
                        <Badge className={`${getSettingTypeColor(record.settingType)} text-xs px-2 py-0 mt-1`}>
                            {getDisplayValue(record.settingType)}
                        </Badge>
                    </div>
                </div>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'settingType',
            key: 'type',
            width: 150,
            render: (text: string) => (
                <p className="text-sm capitalize">{getDisplayValue(text).replace(/_/g, ' ').toLowerCase()}</p>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 250,
            render: (text: string) => (
                <p className="text-sm line-clamp-2">{getDisplayValue(text)}</p>
            ),
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            width: 200,
            render: (text: string) => (
                <p className="text-sm line-clamp-2 font-mono">{getDisplayValue(text)}</p>
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
            render: (text: string, record: StoreSetting) => (
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
                                Store Settings
                            </h1>
                            <p className="text-muted-foreground">
                                Manage your store configuration and preferences
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{settings.length}</p>
                        <p className="text-sm text-muted-foreground">Total Settings</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search settings..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Link href="/admin/settings/add-settings" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add Setting
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
                                    Store Settings List
                                </CardTitle>
                                <Button variant="outline" size="sm" onClick={() => refetch()}>
                                    Refresh
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center items-center h-40">
                                    <p className="text-gray-500">Loading settings...</p>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-40">
                                    <p className="text-red-500">Error loading settings</p>
                                </div>
                            ) : settings.length === 0 ? (
                                <div className="flex justify-center items-center h-40 flex-col gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Settings className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500">No store settings found</p>
                                    <p className="text-sm text-gray-400 text-center max-w-md">
                                        Configure your store by adding settings for business hours, payment methods, shipping options, and more.
                                    </p>
                                    <Link href="/admin/settings/add-settings">
                                        <Button className="gap-2">
                                            <Plus className="w-4 h-4" />
                                            Add Your First Setting
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="block lg:hidden space-y-4">
                                        {filteredSettings.map((setting) => (
                                            <MobileSettingCard
                                                key={setting.id}
                                                setting={setting}
                                                onViewDetails={handleViewDetails}
                                            />
                                        ))}
                                    </div>

                                    <div className="hidden lg:block">
                                        <DynamicTable
                                            columns={columns}
                                            data={filteredSettings}
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