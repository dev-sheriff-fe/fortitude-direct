'use client'
import React from 'react';
import { User, Mail, Phone, MapPin, Building, Calendar, Shield, Wallet, CreditCard, Store, Users, BadgeCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useUser from '@/store/userStore';

export const ProfilePage = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-accent/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-accent-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never logged in';
    return new Date(dateString).toLocaleString();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'BUSINESS_MANAGER':
        return 'default';
      case 'ADMIN':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-accent/10 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-accent text-white rounded-lg p-6 mb-6 shadow-lg">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 lg:w-32 lg:h-32 border-4 border-accent-foreground/20">
              <AvatarImage src={user.photoLinks || "/lovable-uploads/02ad6048-41c8-4298-9103-f9760c690183.png"} />
              <AvatarFallback className="bg-accent-foreground text-accent text-2xl">
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center lg:text-left flex-1">
              <h1 className="text-2xl lg:text-4xl font-bold mb-2">{user.fullname}</h1>
              <p className="text-white/80 mb-4">{user.businessName}</p>
              
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <Badge variant={getRoleBadgeVariant(user.userRole ?? '')} className="text-sm">
                  <Shield className="w-3 h-3 mr-1" />
                  {user.userRole?.replace('_', ' ') || 'No Role'}
                </Badge>
                
                {user.twoFactorType === 'Y' && (
                  <Badge variant="secondary" className="bg-green-500 text-white">
                    <BadgeCheck className="w-3 h-3 mr-1" />
                    2FA Enabled
                  </Badge>
                )}
                
                {user.forcePwdChange === 'Y' && (
                  <Badge variant="destructive">
                    Password Change Required
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-border">
            <CardHeader className="bg-accent/20">
              <CardTitle className="text-accent flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem 
                  icon={<Mail className="w-4 h-4" />}
                  label="Email"
                  value={user.email}
                />
                <InfoItem 
                  icon={<Phone className="w-4 h-4" />}
                  label="Mobile"
                  value={user.mobileNo}
                />
                <InfoItem 
                  icon={<MapPin className="w-4 h-4" />}
                  label="Address"
                  value={user.address}
                />
                <InfoItem 
                  icon={<Calendar className="w-4 h-4" />}
                  label="Last Login"
                  value={formatDate(user.lastLoginDate ?? '')}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-border">
            <CardHeader className="bg-accent/20">
              <CardTitle className="text-accent flex items-center gap-2">
                <Building className="w-5 h-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <InfoItem 
                  icon={<Building className="w-4 h-4" />}
                  label="Entity Name"
                  value={user.entityName}
                />
                <InfoItem 
                  icon={<Store className="w-4 h-4" />}
                  label="Store Code"
                  value={user.storeCode}
                />
                <InfoItem 
                  icon={<Users className="w-4 h-4" />}
                  label="Merchant Code"
                  value={user.merchantCode}
                />
                <InfoItem 
                  icon={<BadgeCheck className="w-4 h-4" />}
                  label="Referral Code"
                  value={user.referalCode}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-border">
            <CardHeader className="bg-accent/20">
              <CardTitle className="text-accent flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Account & Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem 
                  icon={<CreditCard className="w-4 h-4" />}
                  label="Wallet Account"
                  value={user.walletAcc}
                />
                <InfoItem 
                  icon={<Wallet className="w-4 h-4" />}
                  label="Wallet Balance"
                  value={user.walletBalance !== undefined ? `₦${user.walletBalance.toLocaleString()}` : 'N/A'}
                />
                <InfoItem 
                  icon={<Shield className="w-4 h-4" />}
                  label="Account Type"
                  value={user.accountType || 'Not specified'}
                />
                <InfoItem 
                  icon={<Users className="w-4 h-4" />}
                  label="User ID"
                  value={user.userID}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security & Settings */}
          <Card className="bg-white border-border">
            <CardHeader className="bg-accent/20">
              <CardTitle className="text-accent flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <InfoItem 
                  icon={<Shield className="w-4 h-4" />}
                  label="Two-Factor Authentication"
                  value={user.twoFactorType === 'Y' ? 'Enabled' : 'Disabled'}
                />
                <InfoItem 
                  icon={<BadgeCheck className="w-4 h-4" />}
                  label="2FA Setup Status"
                  value={user.twoFaSetupRequired === 'N' ? 'Completed' : 'Required'}
                />
                <InfoItem 
                  icon={<Calendar className="w-4 h-4" />}
                  label="Password Change Required"
                  value={user.forcePwdChange === 'Y' ? 'Yes' : 'No'}
                />
                <InfoItem 
                  icon={<Users className="w-4 h-4" />}
                  label="User Permissions"
                  value={user.userPermissionList ? `${user.userPermissionList.length} permissions` : 'No permissions'}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="bg-white border-border lg:col-span-2">
            <CardHeader className="bg-accent/20">
              <CardTitle className="text-accent flex items-center gap-2">
                <Users className="w-5 h-5" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoItem 
                  label="Username"
                  value={user.username}
                />
                <InfoItem 
                  label="Entity Code"
                  value={user.entityCode}
                />
                <InfoItem 
                  label="Country"
                  value={user.country}
                />
                <InfoItem 
                  label="Currency"
                  value={user.ccy}
                />
                <InfoItem 
                  label="Language"
                  value={user.language?.toUpperCase()}
                />
                <InfoItem 
                  label="Supervisor"
                  value={user.supervisor || 'Not assigned'}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ 
  icon, 
  label, 
  value 
}: { 
  icon?: React.ReactNode; 
  label: string; 
  value: string | null | undefined;
}) => (
  <div className="flex flex-col space-y-1">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {icon}
      <span>{label}</span>
    </div>
    <p className="text-accent font-medium pl-6">
      {value || 'Not provided'}
    </p>
  </div>
);

export default ProfilePage;