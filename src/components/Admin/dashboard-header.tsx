'use client'
import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { logout } from '@/utils/auth-utils';

export const DashboardHeader = () => {
  return (
    <header className="bg-white border-b border-border px-4 lg:px-6 py-3 lg:py-4 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden md:block relative w-60 lg:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search here..." 
              className="pl-10 bg-muted/50 border-border"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-6">
          {/* Search - hidden on mobile */}


          {/* User Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="w-8 h-8 lg:w-10 lg:h-10">
                    <AvatarImage src="/lovable-uploads/02ad6048-41c8-4298-9103-f9760c690183.png" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="w-4 h-4 lg:w-5 lg:h-5" />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>My profile</DropdownMenuItem>
                <DropdownMenuItem onClick={()=>logout()}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};