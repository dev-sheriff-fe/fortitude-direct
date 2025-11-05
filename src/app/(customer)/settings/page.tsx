'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Search, Shield, User, Bell, CreditCard, Lock, Globe, Palette } from 'lucide-react';
import TransactionPinModal from '@/components/pin/transaction-pin-modal';

interface Setting {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

export default function Settings(): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);
  const [isTransactionPinOpen, setIsTransactionPinOpen] = useState(false);

  const settings: Setting[] = [
    {
      id: 'transaction-pin',
      name: 'Transaction PIN',
      type: 'Security',
      description: 'Set or change your transaction PIN for secure payments',
      icon: <Shield className="h-6 w-6" />,
      category: 'Security'
    },
    {
      id: 'profile',
      name: 'Profile Settings',
      type: 'Account',
      description: 'Manage your personal information and account details',
      icon: <User className="h-6 w-6" />,
      category: 'Account'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      type: 'Preferences',
      description: 'Configure your notification preferences',
      icon: <Bell className="h-6 w-6" />,
      category: 'Preferences'
    },
    {
      id: 'payment-methods',
      name: 'Payment Methods',
      type: 'Payment',
      description: 'Manage your saved payment methods and billing information',
      icon: <CreditCard className="h-6 w-6" />,
      category: 'Payment'
    },
    {
      id: 'privacy',
      name: 'Privacy & Security',
      type: 'Security',
      description: 'Control your privacy settings and security options',
      icon: <Lock className="h-6 w-6" />,
      category: 'Security'
    },
  ];

  const filteredSettings = settings.filter(setting =>
    setting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setting.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setting.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setting.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenSetting = (settingId: string) => {
    setSelectedSetting(settingId);
    
    switch (settingId) {
      case 'transaction-pin':
        setIsTransactionPinOpen(true);
        break;
      default:
        console.log(`Opening setting: ${settingId}`);
    }
  };

  const getCategorySettings = (category: string) => {
    return filteredSettings.filter(setting => setting.category === category);
  };

  const categories = Array.from(new Set(settings.map(setting => setting.category)));

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Settings
              </h1>
              <p className="text-muted-foreground">
                Manage your account preferences and security settings
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{settings.length}</p>
            <p className="text-sm text-muted-foreground">Total Settings</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search settings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {categories.map((category) => {
            const categorySettings = getCategorySettings(category);
            if (categorySettings.length === 0) return null;

            return (
              <div key={category} className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground border-b pb-2">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySettings.map((setting) => (
                    <Card 
                      key={setting.id} 
                      className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              {setting.icon}
                            </div>
                            <div>
                              <CardTitle className="text-base font-semibold text-gray-900">
                                {setting.name}
                              </CardTitle>
                              <p className="text-xs text-muted-foreground mt-1">
                                {setting.type}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600 mb-4">
                          {setting.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                            {setting.category}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => handleOpenSetting(setting.id)}
                            className="transition-smooth"
                          >
                            Open
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredSettings.length === 0 && (
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="flex justify-center items-center h-40">
                <p className="text-gray-500">No settings found matching your search</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <TransactionPinModal
        isOpen={isTransactionPinOpen}
        onClose={() => {
          setIsTransactionPinOpen(false);
          setSelectedSetting(null);
        }}
      />
      
    </div>
  );
}