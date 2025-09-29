'use client'

import { SignInForm } from '@/components/Customer/SignInForm'
import Loader from '@/components/ui/loader';
import { getAuthCredentials } from '@/utils/auth-utils-customer';
import { useRouter } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react'


const CustomerLogin = () => {
  const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    
    useEffect(() => {
        // Check authentication status after component mounts
        const { token, permissions } = getAuthCredentials();
        const isUserAuthenticated = !!token && Array.isArray(permissions) && permissions.length > 0;
        
        console.log('Auth check:', { token, permissions, isUserAuthenticated });
        
        if (isUserAuthenticated) {
            router.replace('/dashboard');
        } else {
            // User is not authenticated, show login form
            setIsChecking(false);
        }
    }, [router]);

    // Show loading state while checking authentication
    if (isChecking) {
        return (
            <Loader text='loading'/>
        );
    }

    // User is not authenticated, show login form
  return (
    <Suspense>
      <SignInForm/>
    </Suspense>
  )
}

export default CustomerLogin