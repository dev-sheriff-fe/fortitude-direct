'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Settings, Code, Type, FileText } from 'lucide-react';
import useUser from '@/store/userStore';
import axiosInstance from '@/utils/fetch-function';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface StoreSettingFormData {
    id?: number;
    settingCode: string;
    settingType: string;
    description: string;
    value: string;
    status: string;
    merchantCode: string;
    storeCode: string;
}

const commonSettingTypes = [
    'BUSINESS_HOURS',
    'PAYMENT_METHODS',
    'SHIPPING_OPTIONS',
    'TAX_SETTINGS',
    'CURRENCY',
    'NOTIFICATIONS',
    'SECURITY',
    'INTEGRATIONS',
    'GENERAL'
];

const settingTypeExamples = {
    BUSINESS_HOURS: '{"openingTime": "09:00", "closingTime": "18:00", "daysOpen": ["monday", "tuesday", "wednesday", "thursday", "friday"]}',
    PAYMENT_METHODS: '["credit_card", "debit_card", "cash", "bank_transfer", "digital_wallet"]',
    SHIPPING_OPTIONS: '{"standard": {"price": 5.99, "deliveryDays": 3}, "express": {"price": 12.99, "deliveryDays": 1}}',
    TAX_SETTINGS: '{"taxRate": 0.08, "taxInclusive": true, "taxNumber": "12345"}',
    CURRENCY: '{"currency": "USD", "symbol": "$", "decimalPlaces": 2}',
    NOTIFICATIONS: '{"email": true, "sms": false, "push": true, "lowStockAlert": true}',
    SECURITY: '{"sessionTimeout": 30, "passwordExpiry": 90, "twoFactorAuth": false}',
    INTEGRATIONS: '{"stripe": {"enabled": true, "testMode": false}, "mailchimp": {"enabled": false}}',
    GENERAL: '{"storeName": "My Store", "contactEmail": "contact@store.com", "phone": "+1234567890"}'
};

const settingTypeDescriptions = {
    BUSINESS_HOURS: 'Store operating hours and days',
    PAYMENT_METHODS: 'Accepted payment methods',
    SHIPPING_OPTIONS: 'Shipping methods and pricing',
    TAX_SETTINGS: 'Tax configuration and rates',
    CURRENCY: 'Currency and formatting settings',
    NOTIFICATIONS: 'Notification preferences',
    SECURITY: 'Security and access controls',
    INTEGRATIONS: 'Third-party integrations',
    GENERAL: 'General store configuration'
};

export default function CreateStoreSettingPage() {
    const searchParams = useSearchParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingSettingId, setEditingSettingId] = useState<string | null>(null);
    const { user } = useUser();
    const router = useRouter();

    const [formData, setFormData] = useState<StoreSettingFormData>({
        settingCode: '',
        settingType: '',
        description: '',
        value: '',
        status: 'ACTIVE',
        merchantCode: user?.merchantCode || '',
        storeCode: user?.storeCode || '',
    });

    const [valueFormat, setValueFormat] = useState<'text' | 'json' | 'array'>('text');

    // Fetch setting details for editing
    const { data: settingData, isLoading: isLoadingSetting } = useQuery({
        queryKey: ['setting-detail', editingSettingId],
        queryFn: () => axiosInstance.request({
            url: '/store-settings/detail',
            method: 'GET',
            params: {
                id: editingSettingId
            }
        }),
        enabled: !!editingSettingId && isEditMode,
    });

    useEffect(() => {
        const editParam = searchParams.get('edit');
        const idParam = searchParams.get('id');
        
        if (editParam === 'true' && idParam) {
            setIsEditMode(true);
            setEditingSettingId(idParam);
        }
    }, [searchParams]);

    // Populate form when setting data is fetched
    useEffect(() => {
        if (settingData?.data && isEditMode) {
            const setting = settingData.data;
            setFormData({
                id: setting.id,
                settingCode: setting.settingCode || '',
                settingType: setting.settingType || '',
                description: setting.description || '',
                value: setting.value || '',
                status: setting.status || 'ACTIVE',
                merchantCode: setting.merchantCode || user?.merchantCode || '',
                storeCode: setting.storeCode || user?.storeCode || '',
            });

            // Auto-detect value format
            try {
                JSON.parse(setting.value);
                if (Array.isArray(JSON.parse(setting.value))) {
                    setValueFormat('array');
                } else {
                    setValueFormat('json');
                }
            } catch {
                setValueFormat('text');
            }
        }
    }, [settingData, isEditMode, user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-populate description and example value when setting type changes
        if (name === 'settingType' && value && settingTypeDescriptions[value as keyof typeof settingTypeDescriptions]) {
            setFormData(prev => ({
                ...prev,
                description: settingTypeDescriptions[value as keyof typeof settingTypeDescriptions] || ''
            }));

            // Set example value based on type
            if (settingTypeExamples[value as keyof typeof settingTypeExamples]) {
                setFormData(prev => ({
                    ...prev,
                    value: settingTypeExamples[value as keyof typeof settingTypeExamples] || ''
                }));
                
                // Auto-set format based on example
                const example = settingTypeExamples[value as keyof typeof settingTypeExamples];
                try {
                    const parsed = JSON.parse(example);
                    if (Array.isArray(parsed)) {
                        setValueFormat('array');
                    } else {
                        setValueFormat('json');
                    }
                } catch {
                    setValueFormat('text');
                }
            }
        }
    };

    const handleValueFormatChange = (format: 'text' | 'json' | 'array') => {
        setValueFormat(format);
        
        // Format the current value based on selected format
        if (formData.value) {
            try {
                const parsed = JSON.parse(formData.value);
                if (format === 'text') {
                    setFormData(prev => ({ ...prev, value: String(parsed) }));
                } else {
                    setFormData(prev => ({ ...prev, value: JSON.stringify(parsed, null, 2) }));
                }
            } catch {
                // If not valid JSON, keep as text
                if (format !== 'text') {
                    toast.error('Current value is not valid JSON. Please fix or keep as text.');
                    setValueFormat('text');
                }
            }
        }
    };

    const validateValue = (value: string, format: string): boolean => {
        if (!value) return true;
        
        try {
            if (format === 'json' || format === 'array') {
                JSON.parse(value);
                if (format === 'array' && !Array.isArray(JSON.parse(value))) {
                    toast.error('Value must be a valid JSON array');
                    return false;
                }
            }
            return true;
        } catch (error) {
            toast.error('Invalid JSON format. Please check your syntax.');
            return false;
        }
    };

    const createSettingMutation = useMutation({
        mutationFn: (settingData: StoreSettingFormData) =>
            isEditMode 
                ? axiosInstance.put('/store-settings/update', settingData)
                : axiosInstance.post('/store-settings/create', settingData),
        onSuccess: (data) => {
            toast.success(isEditMode ? 'Setting updated successfully' : 'Setting created successfully');
            router.push('/admin/store-settings');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} setting`);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateValue(formData.value, valueFormat)) {
            return;
        }

        const payload = {
            ...formData,
            merchantCode: user?.merchantCode || '',
            storeCode: user?.storeCode || '',
        };
        
        createSettingMutation.mutate(payload);
    };

    const formatValue = () => {
        if (!formData.value) return;
        
        try {
            const parsed = JSON.parse(formData.value);
            setFormData(prev => ({
                ...prev,
                value: JSON.stringify(parsed, null, 2)
            }));
            toast.success('Value formatted successfully');
        } catch {
            toast.error('Cannot format - invalid JSON');
        }
    };

    if (isLoadingSetting) {
        return (
            <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500">Loading setting data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container mx-auto p-6">
                <div className="flex items-center mb-6">
                    <Button 
                        variant="ghost" 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Settings
                    </Button>
                </div>

                <div className="flex items-center justify-center mb-8">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                            <Settings className="w-8 h-8 text-accent-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold text-accent-foreground">
                            {isEditMode ? 'Edit Store Setting' : 'Create Store Setting'}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {isEditMode ? 'Update store configuration' : 'Add a new store configuration setting'}
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white rounded-lg p-6 border border-accent/20 shadow-md">
                            <h2 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
                                <Code className="h-5 w-5" />
                                Setting Information
                            </h2>
                            <p className="text-muted-foreground mb-6">Basic setting identification and classification</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="settingCode" className="flex items-center gap-1 text-sm font-medium">
                                        <span>Setting Code</span>
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Code className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="settingCode"
                                            name="settingCode"
                                            value={formData.settingCode}
                                            onChange={handleInputChange}
                                            className="pl-10 font-mono"
                                            placeholder="e.g., CLOSING_HOURS, PAYMENT_METHODS"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Unique identifier for this setting (use uppercase with underscores)
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="settingType" className="flex items-center gap-1 text-sm font-medium">
                                        <span>Setting Type</span>
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={formData.settingType}
                                        onValueChange={(value) => handleSelectChange('settingType', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select setting type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {commonSettingTypes.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type.replace(/_/g, ' ').toLowerCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        Category for organizing related settings
                                    </p>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="description" className="flex items-center gap-1 text-sm font-medium">
                                        <span>Description</span>
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="pl-10 min-h-[80px]"
                                            placeholder="Describe what this setting controls..."
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => handleSelectChange('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 border border-accent/20 shadow-md">
                            <h2 className="text-lg font-semibold text-accent-foreground mb-4 flex items-center gap-2">
                                <Type className="h-5 w-5" />
                                Setting Value
                            </h2>
                            <p className="text-muted-foreground mb-6">Configure the value for this setting</p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Label className="text-sm font-medium">Value Format:</Label>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant={valueFormat === 'text' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handleValueFormatChange('text')}
                                        >
                                            Text
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={valueFormat === 'json' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handleValueFormatChange('json')}
                                        >
                                            JSON Object
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={valueFormat === 'array' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handleValueFormatChange('array')}
                                        >
                                            JSON Array
                                        </Button>
                                    </div>
                                    {(valueFormat === 'json' || valueFormat === 'array') && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={formatValue}
                                        >
                                            Format JSON
                                        </Button>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="value" className="flex items-center gap-1 text-sm font-medium">
                                        <span>Setting Value</span>
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <Textarea
                                        id="value"
                                        name="value"
                                        value={formData.value}
                                        onChange={handleInputChange}
                                        className="min-h-[120px] font-mono text-sm"
                                        placeholder={
                                            valueFormat === 'text' 
                                                ? 'Enter setting value...' 
                                                : valueFormat === 'json'
                                                ? 'Enter JSON object...\nExample: {"key": "value"}'
                                                : 'Enter JSON array...\nExample: ["item1", "item2"]'
                                        }
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {valueFormat === 'text' 
                                            ? 'Plain text value'
                                            : valueFormat === 'json'
                                            ? 'JSON object format (key-value pairs)'
                                            : 'JSON array format (list of items)'
                                        }
                                    </p>
                                </div>

                                {formData.settingType && settingTypeExamples[formData.settingType as keyof typeof settingTypeExamples] && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                                            <Settings className="w-4 h-4" />
                                            Example for {formData.settingType.replace(/_/g, ' ').toLowerCase()}:
                                        </h4>
                                        <pre className="text-xs text-blue-800 bg-blue-100 p-2 rounded overflow-x-auto">
                                            {settingTypeExamples[formData.settingType as keyof typeof settingTypeExamples]}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => router.back()}
                                className="flex items-center gap-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createSettingMutation.isPending}
                                className="gap-2 bg-accent hover:bg-accent/90 text-white"
                            >
                                <Save className="w-4 h-4" />
                                {createSettingMutation.isPending ? 'Processing...' : (isEditMode ? 'Update Setting' : 'Create Setting')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}