'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ReportFilter {
  startDate?: string;
  endDate?: string;
  status?: string;
  transactionType?: string;
  walletId?: string;
  merchantCode?: string;
  terminalId?: string;
  keyword?: string;
}

interface ReportFiltersProps {
  filters: ReportFilter;
  onFilterChange: (filters: ReportFilter) => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({ filters, onFilterChange }) => {
  const statusOptions = [
    { value: 'SUCCESS', label: 'Success' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'PENDING', label: 'Pending' },
  ];

  const transactionTypeOptions = [
    { value: 'SALE', label: 'Sale' },
    { value: 'REFUND', label: 'Refund' },
    { value: 'VOID', label: 'Void' },
    { value: 'AUTH', label: 'Authorization' },
  ];

  const handleFilterChange = (key: keyof ReportFilter, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const handleClearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter Reports</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? format(new Date(filters.startDate), 'PPP') : 'Pick start date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.startDate ? new Date(filters.startDate) : undefined}
                onSelect={(date: Date | undefined) => handleFilterChange('startDate', date?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? format(new Date(filters.endDate), 'PPP') : 'Pick end date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.endDate ? new Date(filters.endDate) : undefined}
                onSelect={(date: Date | undefined) => handleFilterChange('endDate', date?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionType">Transaction Type</Label>
          <Select
            value={filters.transactionType}
            onValueChange={(value) => handleFilterChange('transactionType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {transactionTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="walletId">Wallet ID</Label>
          <Input
            id="walletId"
            placeholder="Enter wallet ID"
            value={filters.walletId || ''}
            onChange={(e) => handleFilterChange('walletId', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="merchantCode">Merchant Code</Label>
          <Input
            id="merchantCode"
            placeholder="Enter merchant code"
            value={filters.merchantCode || ''}
            onChange={(e) => handleFilterChange('merchantCode', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="terminalId">Terminal ID</Label>
          <Input
            id="terminalId"
            placeholder="Enter terminal ID"
            value={filters.terminalId || ''}
            onChange={(e) => handleFilterChange('terminalId', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="keyword">Keyword Search</Label>
          <Input
            id="keyword"
            placeholder="Search keywords"
            value={filters.keyword || ''}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button
          onClick={() => onFilterChange(filters)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default ReportFilters;