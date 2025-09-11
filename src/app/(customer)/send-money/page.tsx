import { TransferForm } from '@/components/Customer/send-money/send-money-from'
import React from 'react'

const SendMoneyPage = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Crypto Transfer</h1>
          <p className="text-xl text-muted-foreground">Send cryptocurrency quickly and securely</p>
        </div>
        <TransferForm />
      </div>
    </div>
  )
}

export default SendMoneyPage