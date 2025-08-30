'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  FileText,
  Shield,
  TrendingUp,
  Calendar,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Link
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/fetch-function";

interface CreditAssessment {
  score: number;
  grade: string;
  riskLevel: "Low" | "Medium" | "High";
  lastUpdated: string;
  factors: {
    paymentHistory: number;
    creditUtilization: number;
    lengthOfHistory: number;
    creditMix: number;
    newCredit: number;
  };
}

const CustomerDetailScreen = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const {id} = useParams()
  const searchParams = useSearchParams()
  const entityCode = searchParams.get('entityCode')

  const {data} = useQuery({
   queryKey: ['customer-detail'],
   queryFn: ()=>axiosInstance.request({
    method: 'GET',
    url: `/customer/detail`,
    params: {
      username: decodeURIComponent(id as string),
      entityCode
    }
   })
  })

  const userInfo = data?.data?.userInfo
  const kycDocs = data?.data?.kycDocDtos
  const documentsInfo = data?.data?.documents
  
  console.log(data);
  


  const creditAssessment: CreditAssessment = {
    score: 742,
    grade: "A",
    riskLevel: "Low",
    lastUpdated: "2024-02-15",
    factors: {
      paymentHistory: 95,
      creditUtilization: 68,
      lengthOfHistory: 85,
      creditMix: 72,
      newCredit: 88
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      "Active": "bg-success text-success-foreground",
      "Verified": "bg-success text-success-foreground",
      "Completed": "bg-success text-success-foreground",
      "Pending": "bg-warning text-warning-foreground",
      "Suspended": "bg-destructive text-destructive-foreground",
      "Rejected": "bg-destructive text-destructive-foreground",
      "Failed": "bg-destructive text-destructive-foreground"
    };
    
    return variants[status] || "bg-muted text-muted-foreground";
  };

  const getRiskLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      "Low": "text-success-foreground",
      "Medium": "text-warning-foreground", 
      "High": "text-destructive-foreground"
    };
    return colors[level] || "text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Customer Header */}
      <Card className="shadow-[var(--shadow-card)] border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                {/* <AvatarImage src={customerAvatar} alt={customer.name} /> */}
                <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                  {userInfo?.fullname.split(' ').map((n:string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Badge className={`mt-3 ${getStatusBadge(userInfo?.status)}`}>
                {userInfo?.status}
              </Badge>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-card-foreground">{userInfo?.fullname}</h1>
                <p className="text-muted-foreground">Customer ID: {userInfo?.id}</p>
                <p className="text-sm text-muted-foreground mt-1">{userInfo?.userRole}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-accent-foreground" />
                  <span className="text-card-foreground">{userInfo?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-accent-foreground" />
                  <span className="text-card-foreground">{userInfo?.mobileNo}</span>
                </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className={`${!userInfo?.city&&!userInfo?.state?'hidden':''} h-4 w-4 text-accent-foreground`}  />
                  <span className="text-card-foreground">{userInfo?.city||null} {userInfo?.state||null}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-accent-foreground" />
                  <span className="text-card-foreground">Since {userInfo?.createdDate}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger value="overview" className="data-[state=active]:bg-card">
            <User className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-card">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="kyc" className="data-[state=active]:bg-card">
            <Shield className="h-4 w-4 mr-2" />
            KYC
          </TabsTrigger>
          <TabsTrigger value="credit" className="data-[state=active]:bg-card">
            <TrendingUp className="h-4 w-4 mr-2" />
            Credit
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-card-foreground">{userInfo?.fullname}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <p className="text-card-foreground">{userInfo?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <p className="text-card-foreground">{userInfo?.mobileNo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                  <p className="text-card-foreground">{userInfo?.userRole}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Street Address</label>
                  <p className="text-card-foreground">{userInfo?.address||'NIL'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">City</label>
                    <p className="text-card-foreground">{userInfo?.city||'NIL'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">State</label>
                    <p className="text-card-foreground">{userInfo?.state||'NIL'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* <div>
                    <label className="text-sm font-medium text-muted-foreground">ZIP Code</label>
                    <p className="text-card-foreground">{customer.address.zipCode}</p>
                  </div> */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Country</label>
                    <p className="text-card-foreground">{userInfo?.country||'NIL'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6 mt-6">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Customer Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {
                  documentsInfo?.length===0 ? <p className="text-center text-sm text-muted-foreground">No documents available.</p>
                  :
                  documentsInfo?.map((doc:any) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-accent-foreground" />
                      <div>
                        <h4 className="font-medium text-card-foreground">{doc?.title}</h4>
                        {/* <p className="text-sm text-muted-foreground">{doc.type} • {doc.size}</p> */}
                        {/* <p className="text-xs text-muted-foreground">Uploaded {new Date(doc.uploadDate).toLocaleDateString()}</p> */}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusBadge(doc.verifyStatus)}>
                        {doc.verifyStatus}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Link href={doc?.link} target="_blank">
                          <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* KYC Tab */}
        <TabsContent value="kyc" className="space-y-6 mt-6">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                KYC Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {
                  !kycDocs ? <p className="text-center text-sm text-muted-foreground">No KYC items available.</p>
                  :
                  kycDocs.map((item:any) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      {item.status === "Completed" && <CheckCircle className="h-8 w-8 text-success-foreground" />}
                      {item.status === "Pending" && <Clock className="h-8 w-8 text-warning-foreground" />}
                      {item.status === "Failed" && <XCircle className="h-8 w-8 text-destructive-foreground" />}
                      <div>
                        <h4 className="font-medium text-card-foreground">{item.documentName}</h4>
                        {item.completedDate && (
                          <p className="text-sm text-muted-foreground">uploaded {new Date(item.uploadedDate).toLocaleDateString()}</p>
                        )}
                        {/* {item.expiryDate && (
                          <p className="text-sm text-warning-foreground">Due {new Date(item.expiryDate).toLocaleDateString()}</p>
                        )} */}
                      </div>
                    </div>
                    <Badge className={getStatusBadge(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Credit Assessment Tab */}
        <TabsContent value="credit" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Credit Score Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-card-foreground mb-2">{creditAssessment.score}</div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl font-semibold text-card-foreground">Grade {creditAssessment.grade}</span>
                    <Star className="h-6 w-6 text-warning fill-current" />
                  </div>
                  <span className={`text-sm font-medium ${getRiskLevelColor(creditAssessment.riskLevel)}`}>
                    {creditAssessment.riskLevel} Risk
                  </span>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Last updated: {new Date(creditAssessment.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle>Credit Factors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(creditAssessment.factors).map(([factor, score]) => (
                  <div key={factor} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-card-foreground capitalize">
                        {factor.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-medium text-card-foreground">{score}%</span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDetailScreen;