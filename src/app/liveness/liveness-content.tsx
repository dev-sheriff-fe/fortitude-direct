'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { ThemeProvider } from '@aws-amplify/ui-react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness'
import '@aws-amplify/ui-react/styles.css';
import Loader from '@/components/ui/loader';
import axiosInstance from '@/utils/fetch-function';
import ErrorMessage from '@/components/ui/error-message';
import { Amplify } from 'aws-amplify';
import { useRouter, useSearchParams } from 'next/navigation'; // Updated import
import { useMutation } from '@tanstack/react-query'; // Updated import
import { toast } from 'sonner';

Amplify.configure({
  Auth:{
    Cognito:{
      identityPoolId:'us-east-1:95edaa87-7402-497b-93c0-2718c509ee5d',
      allowGuestAccess:true
    }
  }
})

const LivenessCheckPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams() // New way to get query params
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any|null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3; // Maximum number of automatic retries

  // Get query parameters
  // const livenessId = searchParams.get('livenessId')
  const id = searchParams.get('id')

  // Create session API call
  const createSessionMutation = useMutation({
    mutationFn: async (livenessId: string) => {
      const request = await axiosInstance.request({
        method: 'POST',
        url: `/liveness/create-session`,
        params: { livenessId }
      });
      
      const response = request?.data;
      
      if (response?.status !== 'SUCCESS') {
        throw new Error(response?.desc || 'Failed to create session');
      }
      
      return response;
    },
    onSuccess: (data) => {
      console.log('Session created successfully:', data);
    },
    onError: (error: any) => {
      console.error('Session creation error:', error);
      
      if (error?.response?.data) {
        if (error.response.status === 400) {
          const errorMsg = 'Bad request: ' + (error.response.data.message || 'Unknown error');
          toast.error(errorMsg);
        } else if (error.response.status === 422) {
          toast.error('Validation error: Unable to create liveness session');
        } else if (error.response.status === 500) {
          toast.error('Server error: Unable to create liveness session');
        } else {
          toast.error('Error creating liveness session');
        }
      } else {
        toast.error(error.message || 'Network error: Unable to create liveness session');
      }
    }
  });

  // Get analysis result API call
  const getResultMutation = useMutation({
    mutationFn: async ({ sessionId, livenessId }: { sessionId: string, livenessId: string }) => {
      const request = await axiosInstance.request({
        method: 'GET',
        url: `/liveness/get-result/${sessionId}`,
        params: { sessionId, livenessId }
      });

      if (request?.data?.responseCode !== '000') {
        throw new Error(request?.data?.responseMessage || 'Failed to get result');
      }
      
      return request.data;
    },
    onSuccess: (data) => {
      console.log('Analysis result:', data);
      
      // Check if the person is live
      if (data.live === false) {
        console.log('Liveness check failed - not live, attempting retry...');
        
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          toast.warning(`Liveness verification failed. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
          
          // Auto-retry after a short delay
          setTimeout(() => {
            handleRetry();
          }, 2000);
        } else {
          // Max retries reached, show failure state
          setAnalysisResult(data);
          setIsAnalysisComplete(true);
          toast.error('Liveness verification failed after multiple attempts. Please try again manually.');
        }
      } else {
        // Successful verification
        setAnalysisResult(data);
        setIsAnalysisComplete(true);
        setRetryCount(0); // Reset retry count on success
        toast.success(data?.responseMessage || 'Verification successful!');
      }
    },
    onError: (error: any) => {
      console.error('Analysis completion error:', error);
      toast.error(error.message || 'Failed to complete analysis');
    }
  });

  // Trigger session creation when livenessId is available
  useEffect(() => {
    if (id && !createSessionMutation.data && !createSessionMutation?.isPending) {
      createSessionMutation.mutate(id as string);
    }
  }, [id]); // Removed isReady dependency

  const handleAnalysisComplete = async () => {
    if (createSessionMutation.data?.sessionId && id) {
      console.log('Liveness check completed');
      getResultMutation.mutate({
        sessionId: createSessionMutation.data.sessionId,
        livenessId: id as string
      });
    }
  };

  const handleError = (error: any) => {
    console.error('Liveness detector error:', error);
    
    if (error?.message) {
      toast.error(`Liveness check failed: ${error.message}`);
    } else if (error?.code) {
      toast.error(`Error code: ${error.code}`);
    } else {
      toast.error('Something went wrong during liveness check!');
    }
  };

  const handleRetry = () => {
    setIsAnalysisComplete(false);
    setAnalysisResult(null);
    // Reset mutations and create new session
    createSessionMutation.reset();
    getResultMutation.reset();
    if (id) {
      createSessionMutation.mutate(id as string);
    }
  };

  // const handleManualRetry = () => {
  //   setRetryCount(0); // Reset retry count for manual retry
  //   handleRetry();
  // };

  // Show error if no livenessId in query
  if (!id) {
    return <ErrorMessage message="No liveness ID provided in URL" />;
  }

  // Show error if session creation failed
  if (createSessionMutation.isError) {
    return <ErrorMessage message={createSessionMutation.error?.message || 'Failed to create session'} />;
  }

  // Show loading while creating session
  const isLoading = createSessionMutation.isPending || getResultMutation.isPending; // Updated from isLoading to isPending

  console.log(isLoading);
  

  return (
    
      <ThemeProvider>
      {isLoading ? (
        <div className='w-screen flex items-center justify-center'>
          <Loader text='Please wait...' />
        </div>
      ) : (
        <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-4">
          <div className="w-full max-w-md mx-auto">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Identity Verification
              </h1>
              <p className="text-gray-600">
                {isAnalysisComplete 
                  ? (analysisResult?.live ? "Verification completed successfully!" : "Verification failed - please try again")
                  : "Please position your face in the camera frame to begin verification"
                }
              </p>
              {retryCount > 0 && !isAnalysisComplete && (
                <p className="text-orange-600 text-sm mt-2">
                  Retry attempt {retryCount}/{MAX_RETRIES}
                </p>
              )}
            </div>

            {/* Liveness Detector Container */}
            <div className="bg-white rounded-2xl shadow-xl h-full p-6 border border-gray-200">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-10 -z-10"></div>

                {!isAnalysisComplete && createSessionMutation.data ? (
                  <div className="liveness-detector-container w-full">
                    <FaceLivenessDetector
                      sessionId={createSessionMutation.data.sessionId}
                      region="us-east-1"
                      onAnalysisComplete={handleAnalysisComplete}
                      onError={handleError}
                    />
                  </div>
                ) : isAnalysisComplete ? (
                  <div className="text-center py-8">
                    <div className={`w-16 h-16 ${analysisResult?.live ? 'bg-green-500' : 'bg-red-500'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      {analysisResult?.live ? (
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <h3 className={`text-xl font-semibold ${analysisResult?.live ? 'text-gray-900' : 'text-red-600'} mb-2`}>
                      {analysisResult?.live ? 'Verification Successful!' : 'Verification Failed'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {analysisResult?.live 
                        ? 'Your identity has been verified successfully.'
                        : 'Liveness check failed. Please ensure you are a real person and try again.'
                      }
                    </p>
                    {/* {analysisResult && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-600">
                          <strong>Confidence:</strong> {analysisResult?.confidence}%
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Status:</strong> {analysisResult?.status}
                        </p>
                        <p className={`text-sm ${analysisResult?.live ? 'text-green-600' : 'text-red-600'}`}>
                          <strong>Live:</strong> {analysisResult?.live ? 'Yes' : 'No'}
                        </p>
                        {retryCount >= MAX_RETRIES && !analysisResult?.live && (
                          <p className="text-xs text-red-500 mt-2">
                            Maximum automatic retries reached ({MAX_RETRIES}/{MAX_RETRIES})
                          </p>
                        )}
                      </div>
                    )} */}
                    {/* <button
                      onClick={handleManualRetry}
                      className={`${analysisResult?.live ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'} text-white px-6 py-2 rounded-lg transition-colors`}
                    >
                      {analysisResult?.live ? 'Verify Again' : 'Try Again'}
                    </button> */}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Loader text="Preparing verification..." />
                  </div>
                )}
              </div>

              {/* Instructions - Only show during verification */}
              {!isAnalysisComplete && createSessionMutation.data && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Look directly at the camera</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Keep your face within the frame</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Follow the on-screen instructions</span>
                  </div>
                  {retryCount > 0 && (
                    <div className="flex items-center text-sm text-orange-600">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      <span>Ensure you are clearly visible and not using any filters</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-500">
                Your privacy is protected. This verification is secure and encrypted.
              </p>
            </div>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
};

export default LivenessCheckPage;