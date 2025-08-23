import { DashboardHeader } from '@/components/Admin/dashboard-header'
import { DashboardSidebar } from '@/components/Admin/dashboard-sidebar'
import { BUSINESS_MANAGER } from '@/utils/constants'
import PrivateRoute from '@/utils/private-route'
import React, { ReactNode } from 'react'

const DashboardLayout = ({children}:{children:ReactNode}) => {
  return (
    <PrivateRoute requiredPermissions={[BUSINESS_MANAGER]}>
      <div className="min-h-screen bg-background">
        <div className="flex">
            {/* Sidebar - hidden on mobile, fixed on desktop */}
            <div className="hidden lg:block lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64">
                <DashboardSidebar />
            </div>
        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <DashboardHeader />
          
          {/* Dashboard Content */}
          <main className="p-4 lg:p-6 space-y-4 lg:space-y-6">
            {children}
          </main>
        </div>
        </div>
    </div>
    </PrivateRoute>
  )
}

export default DashboardLayout