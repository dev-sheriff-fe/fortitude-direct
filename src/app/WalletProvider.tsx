'use client'
import {
  WalletProvider as Provider,
  WalletManager,
  NetworkId,
  WalletId,
} from '@txnlab/use-wallet-react'
import { ReactNode } from 'react'


// Create manager instance (see Configuration guide)
const manager = new WalletManager({
  wallets: [
    WalletId?.PERA,
    {
      id: WalletId.WALLETCONNECT,
      options: {
        projectId: '8a1dfa20bae50f2da55a2faf7b6dd4ad',  // Required
        enableExplorer: true,
        
      }
    },
  ],
//   networks: NetworkId?.TESTNET,
  defaultNetwork: NetworkId.TESTNET // or just 'testnet'
})

export default function WalletProvider({children}:{children:ReactNode}) {
    return <Provider manager={manager}>
        {children}
    </Provider>
}