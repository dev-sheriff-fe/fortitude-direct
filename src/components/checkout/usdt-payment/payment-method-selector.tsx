"use client"

import { Wallet, Send } from "lucide-react"
import Image from "next/image"
import metamaskIcon from '@/assets/Metamask-Digital-Asset-Logo-PNG-thumb.png'
import algorandIcon from '@/assets/algo.png'

interface PaymentMethodSelectorProps {
  selectedMethod: "direct" | "metamask" | "algorand"
  onMethodChange: (method: "direct" | "metamask" | "algorand") => void
}



export default function PaymentMethodSelector({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Direct Transfer Option */}
      <button
        onClick={() => onMethodChange("direct")}
        className={`relative rounded-lg border-2 p-6 text-left transition-all ${
          selectedMethod === "direct" ? "border-accent bg-accent/5" : "border-border bg-card hover:border-muted"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`rounded-lg p-3 ${
              selectedMethod === "direct" ? "bg-accent text-white" : "bg-secondary text-foreground"
            }`}
          >
            <Send className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Direct Transfer</h3>
            <p className="mt-1 text-sm text-muted-foreground">Send USDT to wallet address</p>
          </div>
        </div>
        {selectedMethod === "direct" && <div className="absolute right-4 top-4 h-3 w-3 rounded-full bg-accent" />}
      </button>

      {/* MetaMask Option */}
      <button
        onClick={() => onMethodChange("metamask")}
        className={`relative rounded-lg border-2 p-6 text-left transition-all ${
          selectedMethod === "metamask" ? "border-accent bg-accent/5" : "border-border bg-card hover:border-muted"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`rounded-lg p-3 ${
              selectedMethod === "metamask" ? "bg-accent text-white" : "bg-secondary text-foreground"
            }`}
          >
            <Image
              src={metamaskIcon}
              className="h-6 w-6 object-cover"
              alt="algorandIcon"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">MetaMask Wallet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Connect and send via MetaMask</p>
          </div>
        </div>
        {selectedMethod === "metamask" && <div className="absolute right-4 top-4 h-3 w-3 rounded-full bg-accent" />}
      </button>

      {/* Algorand Option */}
      <button
        onClick={() => onMethodChange("algorand")}
        className={`relative rounded-lg border-2 p-6 text-left transition-all ${
          selectedMethod === "algorand" ? "border-accent bg-accent/5" : "border-border bg-card hover:border-muted"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`rounded-lg p-3 ${
              selectedMethod === "algorand" ? "bg-accent text-white" : "bg-secondary text-foreground"
            }`}
          >
            <Image
              src={algorandIcon}
              className="h-6 w-6 object-cover"
              alt="algorandIcon"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Algorand Wallet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Connect and send via Algorand wallet</p>
          </div>
        </div>
        {selectedMethod === "algorand" && <div className="absolute right-4 top-4 h-3 w-3 rounded-full bg-accent" />}
      </button>
    </div>
  )
}
