'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Filter } from 'lucide-react';

interface ReportDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  hasFilters: boolean;
  requiresDateRange: boolean;
}

interface ReportsListProps {
  reports: ReportDefinition[];
  onGenerateReport: (report: ReportDefinition) => void;
}

const ReportsList: React.FC<ReportsListProps> = ({ reports, onGenerateReport }) => {
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'transaction': 'bg-blue-100 text-blue-800',
      'collection': 'bg-green-100 text-green-800',
      'merchant': 'bg-purple-100 text-purple-800',
      'transfer': 'bg-orange-100 text-orange-800',
      'summary': 'bg-indigo-100 text-indigo-800',
      'general': 'bg-gray-100 text-gray-800'
    };

    return colorMap[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {reports.map((report) => (
        <Card key={report.id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {report.name}
                </CardTitle>
              </div>
              <Badge className={getCategoryColor(report.category)}>
                <span className="flex items-center gap-1">
                  {getCategoryIcon(report.category)}
                  {report.category}
                </span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {report.description}
            </p>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {report.hasFilters && (
                  <span className="flex items-center gap-1">
                    <Filter className="w-3 h-3" />
                    Filters
                  </span>
                )}
                {report.requiresDateRange && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Date Range
                  </span>
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                {report.code}
              </Badge>
            </div>

            <Button
              onClick={() => onGenerateReport(report)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReportsList;