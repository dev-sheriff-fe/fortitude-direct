'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { parseEther, parseUnits, encodeFunctionData } from 'viem'
import Link from 'next/link'
import { stepProps } from '../usdt-payment'
import { ArrowLeft } from 'lucide-react'

type MetamaskPaymentProps = {
    setStep : (step:stepProps)=>void,
    checkoutData : any
}

// ERC-20 ABI for transfer function
const ERC20_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  }
] as const

// Common token addresses (example for Ethereum mainnet)
const TOKENS = {
//   ETH: { address: null, decimals: 18, symbol: 'ETH' },
  USDT: { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, symbol: 'USDT' },
  USDC: { address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', decimals: 6, symbol: 'USDC' },
  // DAI: { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18, symbol: 'DAI' },
}

const MetamaskPayment = ({checkoutData,setStep}:MetamaskPaymentProps) => {
  const [selectedToken, setSelectedToken] = useState<'USDT'|'USDC'>('USDC')
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('0x19fa03190443C8bAc83Df11a771b3431c31FaA7b')
  const {isConnected} = useAccount()

  // For native ETH transactions
  const {
    data: hash,
    error: sendError,
    isPending: isSendPending,
    sendTransaction
  } = useSendTransaction()

  // For ERC-20 token transactions
  const {
    data: tokenHash,
    error: writeError,
    isPending: isWritePending,
    writeContract
  } = useWriteContract()

  const txHash = hash || tokenHash
  const error = sendError || writeError
  const isPending = isSendPending || isWritePending

  const { 
    isLoading: isConfirming,
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({
    hash: txHash
  })

  async function handleSend() {
    if (!checkoutData?.payingAmount || parseFloat(checkoutData?.payingAmount) <= 0) {
      alert('Invalid amount')
      return
    }

    const token = TOKENS[selectedToken]
      // Send ERC-20 token
      const amountInWei = parseUnits(checkoutData?.payingAmount?.toString(), token.decimals)
      
      writeContract({
        address: token.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [recipient as `0x${string}`, amountInWei]
      })
  }

  console.log(error?.cause);

  console.log(hash);
  
  

  return (
    <div className='min-h-screen relative flex items-center justify-center bg-gray-50 p-4'>
       <button className='absolute left-1 top-1' onClick={()=>setStep('selectMode')}>
        <ArrowLeft/>
       </button>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-4'>
        <h2 className='text-2xl font-bold text-center mb-6'>Send Transaction</h2>
        
        {/* Token Selection */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            Select Token
          </label>
          <select 
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value as any)}
            className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          >
            {Object.entries(TOKENS).map(([key, token]) => (
              <option key={key} value={key}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>

        {/* Send Button */}
        <Button 
          onClick={handleSend}
          disabled={isPending || isConfirming}
          className='w-full bg-accent text-white py-2 rounded-md transition-colors'
        >
          {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Send Transaction'}
        </Button>

        {/* Status Messages */}
        {txHash && (
          <div className='p-3 bg-blue-50 border border-blue-200 rounded-md'>
            <p className='text-sm text-accent'>
              Transaction Hash: <span className='font-mono text-xs break-all'>{txHash}</span>
            </p>
          </div>
        )}
        
        {isConfirmed && (
          <div className='p-3 bg-green-50 border border-green-200 rounded-md'>
            <p className='text-sm text-green-800 font-medium'>
              ✓ Transaction confirmed!
            </p>
          </div>
        )}
        
        {error && (
          <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-sm text-red-800'>
              Error: {error.message}
            </p>
          </div>
        )}
        {
          !isConnected && (
            <div>
              You&apos;re not connected, please connect <Link href={`/connect_wallet`} className='text-accent underline font-semibold' target='_blank'>Here</Link>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default MetamaskPayment