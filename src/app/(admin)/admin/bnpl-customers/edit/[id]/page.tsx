'use client'
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Table from "rc-table";
import {
  Shield,
  TrendingUp,
  Save,
  Calculator,
  DollarSign,
  Lock
} from "lucide-react";
import { toast } from "sonner";

// Mock user role - in real app this would come from auth context
const USER_ROLE = "CREDIT_OFFICER"; // or "CREDIT_ADMIN"

interface ScoringParameter {
  id: number;
  parameter: string;
  weight: number;
  status: "Active" | "Inactive";
  score: number;
  comment: string;
}

interface CreditData {
  customerId: string;
  customerName: string;
  totalScore: number;
  grading: string;
  creditLimit: number;
  currency: string;
  parameters: ScoringParameter[];
}

const CreditScoringScreen = () => {

  const [creditData, setCreditData] = useState<CreditData>({
    customerId: "CUST-001",
    customerName: "John Smith",
    totalScore: 0,
    grading: "",
    creditLimit: 50000,
    currency: "USD",
    parameters: [
      {
        id: 1,
        parameter: "Income Stability",
        weight: 25,
        status: "Active",
        score: 8,
        comment: "Stable monthly income verified"
      },
      {
        id: 2,
        parameter: "Credit History",
        weight: 30,
        status: "Active",
        score: 7,
        comment: "Good payment history with minor delays"
      },
      {
        id: 3,
        parameter: "Debt-to-Income Ratio",
        weight: 20,
        status: "Active",
        score: 6,
        comment: "Acceptable DTI ratio at 35%"
      },
      {
        id: 4,
        parameter: "Employment Duration",
        weight: 15,
        status: "Active",
        score: 9,
        comment: "5+ years with current employer"
      },
      {
        id: 5,
        parameter: "Collateral Value",
        weight: 10,
        status: "Active",
        score: 8,
        comment: "Property valuation confirmed"
      }
    ]
  });

  // Check if user has access
  const hasAccess = USER_ROLE === "CREDIT_OFFICER" || USER_ROLE === "CREDIT_ADMIN";

  // Calculate total score
  useEffect(() => {
    const total = creditData.parameters.reduce((sum, param) => {
      return sum + (param.weight * param.score / 100);
    }, 0);
    
    let grading = "";
    if (total >= 8) grading = "Excellent";
    else if (total >= 7) grading = "Good";
    else if (total >= 6) grading = "Fair";
    else if (total >= 5) grading = "Poor";
    else grading = "Very Poor";

    setCreditData(prev => ({ ...prev, totalScore: total, grading }));
  }, [creditData.parameters]);

  const handleScoreChange = (id: number, newScore: number) => {
    if (newScore < 0 || newScore > 10) return;
    
    setCreditData(prev => ({
      ...prev,
      parameters: prev.parameters.map(param =>
        param.id === id ? { ...param, score: newScore } : param
      )
    }));
  };

  const handleCommentChange = (id: number, newComment: string) => {
    setCreditData(prev => ({
      ...prev,
      parameters: prev.parameters.map(param =>
        param.id === id ? { ...param, comment: newComment } : param
      )
    }));
  };

  const handleCreditLimitChange = (newLimit: number) => {
    setCreditData(prev => ({ ...prev, creditLimit: newLimit }));
  };

  const handleSave = () => {
    // In real app, this would save to backend
    toast('Credit Score Saved');
  };

  const getGradingColor = (grading: string) => {
    switch (grading) {
      case "Excellent": return "text-green-600 bg-green-50 border-green-200";
      case "Good": return "text-blue-600 bg-blue-50 border-blue-200";
      case "Fair": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Poor": return "text-orange-600 bg-orange-50 border-orange-200";
      case "Very Poor": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">Access Restricted</h2>
              <p className="text-muted-foreground">
                This screen is only accessible to Credit Officers and Credit Administrators.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Credit Scoring</h1>
            <p className="text-muted-foreground">Customer: {creditData.customerName} (ID: {creditData.customerId})</p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            <Shield className="h-4 w-4 mr-1" />
            {USER_ROLE.replace("_", " ")}
          </Badge>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Score */}
          <Card className="border-primary/20 bg-accent/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Calculator className="h-4 w-4 mr-2 text-accent" />
                Total Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary mb-2">
                {creditData.totalScore.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">Out of 10.00</p>
            </CardContent>
          </Card>

          {/* Grading */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Credit Grading
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge 
                variant="outline" 
                className={`text-lg px-3 py-1 font-semibold ${getGradingColor(creditData.grading)}`}
              >
                {creditData.grading}
              </Badge>
            </CardContent>
          </Card>

          {/* Credit Limit */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Credit Limit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold">{creditData.currency}</span>
                <Input
                  type="number"
                  value={creditData.creditLimit}
                  onChange={(e) => handleCreditLimitChange(Number(e.target.value))}
                  className="text-lg font-semibold"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scoring Parameters Table */}
        <Card>
          <CardHeader>
            <CardTitle>Scoring Parameters</CardTitle>
            {/* <p className="text-sm text-muted-foreground">
              Adjust scores for each parameter. Total Score = Σ(Weight × Score ÷ 100)
            </p> */}
          </CardHeader>
          <CardContent>
            <Table
              columns={[
                {
                  title: 'No.',
                  dataIndex: 'id',
                  key: 'id',
                  width: 60,
                  className: 'font-medium text-center',
                  render: (id: number) => <span className="font-medium">{id}</span>
                },
                {
                  title: 'Parameter',
                  dataIndex: 'parameter',
                  key: 'parameter',
                  className: 'font-medium',
                  render: (parameter: string) => <span className="font-medium">{parameter}</span>
                },
                {
                  title: 'Weight (%)',
                  dataIndex: 'weight',
                  key: 'weight',
                  width: 100,
                  className: 'text-center',
                  render: (weight: number) => <span className="text-center">{weight}%</span>
                },
                // {
                //   title: 'Status',
                //   dataIndex: 'status',
                //   key: 'status',
                //   width: 100,
                //   render: (status: string) => (
                //     <Badge 
                //       variant={status === "Active" ? "default" : "secondary"}
                //       className="text-xs"
                //     >
                //       {status}
                //     </Badge>
                //   )
                // },
                {
                  title: 'Score (0-10)',
                  dataIndex: 'score',
                  key: 'score',
                  width: 120,
                  render: (score: number, record: ScoringParameter) => (
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={score}
                      onChange={(e) => handleScoreChange(record.id, Number(e.target.value))}
                      className="w-20"
                    />
                  )
                },
                {
                  title: 'Comment',
                  dataIndex: 'comment',
                  key: 'comment',
                  render: (comment: string, record: ScoringParameter) => (
                    <Textarea
                      value={comment}
                      onChange={(e) => handleCommentChange(record.id, e.target.value)}
                      placeholder="Add comment..."
                      className="min-h-[60px] resize-none"
                    />
                  )
                }
              ]}
              data={creditData.parameters}
              rowKey="id"
              className="bg-background"
              tableLayout="fixed"
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleSave}
            size="lg"
            className="px-8 bg-accent text-white"
          >
            <Save className="h-4 w-4 mr-2 hg" />
            Save Credit Score
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreditScoringScreen;