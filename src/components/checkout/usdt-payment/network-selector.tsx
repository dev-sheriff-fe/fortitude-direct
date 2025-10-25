"use client"

import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import placeholder from '@/components/images/placeholder-product.webp'

interface NetworkSelectorProps {
  selectedNetwork: any
  onNetworkChange: (network: any | null) => void,
  networks: any[],
  wallets?: any[]
}



export default function NetworkSelector({ selectedNetwork, onNetworkChange, networks,wallets }: NetworkSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(()=>{
    onNetworkChange(wallets?.[0])
  },[])

  return (
    <div className="mb-8">
      <label className="mb-3 block text-sm font-medium text-foreground">Select Network</label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-left transition-all hover:border-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          {
            selectedNetwork
            ?
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* <div className={`h-3 w-3 rounded-full ${selected.color}`} /> */}
              <Image
               width={10}
               src={selectedNetwork?.logo || placeholder}
               height={10}
               alt={selectedNetwork?.chain}
               unoptimized
              />
              <div>
                <p className="font-medium text-foreground">{selectedNetwork?.chain}</p>
              </div>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
          :
          <span>Select a network</span>
          }
        </button>

        {isOpen && (
          <div className="absolute top-full z-10 mt-2 w-full rounded-lg border border-border bg-card shadow-lg">
            {wallets?.map((network,index) => (
              <button
                key={index}
                onClick={() => {
                  onNetworkChange(network)
                  setIsOpen(false)
                }}
                className={`flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 ${
                  selectedNetwork?.chain === network.chain ? "bg-accent/10" : "hover:bg-secondary"
                }`}
              >
                <Image
                    width={10}
                    src={network?.logo || placeholder}
                    height={10}
                    alt={network?.chain}
                    unoptimized
              />
                <div className="flex-1">
                  <p className={`font-medium ${selectedNetwork?.chain === network?.chain ? "text-accent" : "text-foreground"}`}>
                    {network?.chain}
                  </p>
                  {/* <p className="text-xs text-muted-foreground">{network.symbol}</p> */}
                </div>
                {selectedNetwork?.chain === network?.chain && <div className="h-2 w-2 rounded-full bg-accent" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
