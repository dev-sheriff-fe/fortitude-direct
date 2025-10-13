'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Search, Download, FileText, Filter, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import useGetLookup from '@/app/hooks/useGetLookup';
import ReportsList from '@/components/Admin/reports/report-list';
import ReportFilters from '@/components/Admin/reports/report-filter';
import GenerateReport from '@/components/Admin/reports/generate-report';
import { SelectOption } from '@/types';

interface ReportDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  hasFilters: boolean;
  requiresDateRange: boolean;
}

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

export default function ReportsPage(): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<ReportDefinition | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ReportFilter>({});

  const reportCodes = useGetLookup('REPORT_CODE');

  const isLoading = !reportCodes;

  const getReportCategory = (lookupCode: string): string => {
    if (!lookupCode) return 'General';
    
    const code = lookupCode.toLowerCase();
    if (code.includes('collection')) return 'Collection';
    if (code.includes('merchant')) return 'Merchant';
    if (code.includes('transfer')) return 'Transfer';
    if (code.includes('summary')) return 'Summary';
    if (code.includes('transaction') || code.includes('tran')) return 'Transaction';
    return 'General';
  };

  const reportDefinitions: ReportDefinition[] = reportCodes?.map((report: SelectOption) => ({
    id: report.id.toString(),
    code: report.id.toString(),
    name: report.name,
    description: `Generate ${report.name} report`,
    category: getReportCategory(report.id.toString()),
    hasFilters: true,
    requiresDateRange: true
  })) || [];

  const handleGenerateReport = (report: ReportDefinition) => {
    setSelectedReport(report);
    setIsGenerateModalOpen(true);
  };

  const handleApplyFilters = (newFilters: ReportFilter) => {
    setFilters(newFilters);
  };

  const handleSearch = (searchText: string) => {
    setSearchTerm(searchText);
  };

  const filteredReports = reportDefinitions?.filter((report: ReportDefinition) =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Reports Management
              </h1>
              <p className="text-gray-600">
                Generate and view system reports
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{reportDefinitions?.length || 0}</p>
            <p className="text-sm text-gray-600">Available Reports</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export List
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>

          {showFilters && (
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="pt-6">
                <ReportFilters
                  filters={filters}
                  onFilterChange={handleApplyFilters}
                />
              </CardContent>
            </Card>
          )}

          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Available Reports
                </CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="ml-3 text-gray-600">Loading reports...</p>
                </div>
              ) : !reportDefinitions?.length ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-gray-500">No reports available</p>
                </div>
              ) : (
                <ReportsList
                  reports={filteredReports}
                  onGenerateReport={handleGenerateReport}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedReport && (
        <GenerateReport
          report={selectedReport}
          isOpen={isGenerateModalOpen}
          onClose={() => setIsGenerateModalOpen(false)}
          filters={filters}
        />
      )}
    </div>
  );
}