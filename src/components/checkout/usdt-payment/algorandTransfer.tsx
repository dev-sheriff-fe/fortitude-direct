'use client'
import { useNetwork, useWallet } from '@txnlab/use-wallet-react'

export default function AlgorandTransfer() {
  const {
    activeAccount,
    wallets,
    signTransactions,
  } = useWallet()

  const { activeNetwork } = useNetwork()

  console.log(wallets);
  

  // Connect a specific wallet
  const handleConnect = async (walletId: string) => {
    const wallet = wallets.find((w) => w.id === walletId)
    if (!wallet) return
    try {
      await wallet.connect()
      console.log(`${walletId} connected`)
    } catch (error) {
      console.error(`${walletId} connection failed:`, error)
    }
  }

  // Disconnect a specific wallet
  const handleDisconnect = async (walletId: string) => {
    const wallet = wallets.find((w) => w.id === walletId)
    if (!wallet) return
    try {
      await wallet.disconnect()
      console.log(`${walletId} disconnected`)
    } catch (error) {
      console.error(`${walletId} disconnect failed:`, error)
    }
  }

  const handleSign = async () => {
    try {
      const signedTxns = await signTransactions([/* transactions */])
      console.log('Transaction signed:', signedTxns)
    } catch (error) {
      console.error('Signing failed:', error)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="font-bold text-lg">Algorand Wallets</h2>

      {/* List all available wallets */}
      <div className="space-y-2">
        {wallets.map((wallet) => (
          <div key={wallet.id} className="flex items-center space-x-2">
            <span>{wallet.metadata.name}</span>
            {!wallet.isConnected ? (
              <button
                onClick={() => handleConnect(wallet.id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Connect
              </button>
            ) : (
              <button
                onClick={() => handleDisconnect(wallet.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Disconnect
              </button>
            )}
          </div>
        ))}
      </div>

      {activeAccount && (
        <div className="mt-4">
          <p>
            <strong>Connected Account:</strong> {activeAccount.address}
          </p>
          <p>
            <strong>Network:</strong> {activeNetwork}
          </p>
          <button
            onClick={handleSign}
            className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
          >
            Sign Transaction
          </button>
        </div>
      )}
    </div>
  )
}
