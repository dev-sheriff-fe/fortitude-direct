"use client";

import axiosInstance from "@/utils/fetch-function";
import { useMutation } from "@tanstack/react-query";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

export default function EscrowCheckout() {
  const [status, setStatus] = useState("");
  const [txId, setTxId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Contract & addresses
  const ESCROW_VAULT = "TAbYX6SxkNp7zMqRRsAfPtsMs4o2zTmzms";
  const MERCHANT = "TXxPrefBbyktVJmtNqXvcL3xAXn4cFLfez";
  const USDT_CONTRACT = "TXYZopYRdj2D9XRtbG4uDSoTHGzjKdMr4E"; // Nile testnet USDT
  const USDT_DECIMALS = 1_000_000;
  
  // Use your original ABI - only fund method exists
  const ESCROW_ABI = [
    {"entrys":[
      {"inputs":[{"name":"escrowId","type":"bytes32"},{"name":"payer","type":"address"},{"name":"payee","type":"address"},{"name":"amount","type":"uint256"},{"name":"expiry","type":"uint256"},{"name":"attestRef","type":"bytes32"}],"name":"fund","stateMutability":"Payable","type":"Function","payable":true},
      {"outputs":[{"name":"payer","type":"address"},{"name":"payee","type":"address"},{"name":"amount","type":"uint256"},{"name":"released","type":"bool"},{"name":"expiry","type":"uint256"},{"name":"attestRef","type":"bytes32"}],"constant":true,"inputs":[{"type":"bytes32"}],"name":"escrows","stateMutability":"View","type":"Function"},
      {"outputs":[{"type":"address"}],"constant":true,"name":"usdt","stateMutability":"View","type":"Function"},
      {"outputs":[{"type":"address"}],"constant":true,"name":"attestations","stateMutability":"View","type":"Function"},
      {"inputs":[{"name":"escrowId","type":"bytes32"}],"name":"release","stateMutability":"Nonpayable","type":"Function"}
    ]}
  ];

  // Standard TRC20 ABI for USDT
  const TRC20_ABI = [
    {"outputs":[{"type":"bool"}],"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","stateMutability":"Nonpayable","type":"Function"},
    {"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","stateMutability":"View","type":"Function"},
    {"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","stateMutability":"View","type":"Function"}
  ];

  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [tronWeb, setTronWeb] = useState<any>(null);
  
  const {mutate} = useMutation({
    mutationFn: (data:any)=>axiosInstance.request({
      url: '/chainTransaction/save',
      method: 'POST'
    }),
    onSuccess: (data)=>{
      if (data?.data?.code !== '00') {
        toast.error(data?.data?.desc)
        return
      }
      toast.success(data?.data?.desc||'Order sent')
    }
  })

  useEffect(() => {
    const initTronWeb = async () => {
      if ((window as any).tronWeb && (window as any).tronWeb.ready) {
        const tw = (window as any).tronWeb;
        tw.setFullNode("https://api.nileex.io");
        tw.setSolidityNode("https://api.nileex.io");
        tw.setEventServer("https://api.nileex.io");
        setTronWeb(tw);
        console.log("TronWeb initialized successfully");
      } else {
        console.warn("TronLink not found. Please install TronLink.");
        setStatus("⚠️ TronLink not found. Please install TronLink extension.");
      }
    };
    initTronWeb();
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem('checkout');
    if (stored) {
      setCheckoutData(JSON.parse(stored));
    }
  }, []);

  const waitForTransaction = useCallback(async (tronWebInstance: any, txId: string): Promise<any> => {
    return new Promise(async (resolve) => {
      let receipt: any = null;
      for (let i = 0; i < 30; i++) {
        try {
          receipt = await tronWebInstance.trx.getTransactionInfo(txId);
          if (receipt && receipt.receipt) {
            resolve(receipt);
            return;
          }
        } catch (error) {
          console.warn(`Attempt ${i + 1} failed:`, error);
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
      resolve(receipt);
    });
  }, []);

  const checkUSDTBalance = useCallback(async (address: string): Promise<number> => {
    try {
      const usdtContract = await tronWeb.contract(TRC20_ABI, USDT_CONTRACT);
      const balance = await usdtContract.balanceOf(address).call();
      return parseInt(balance.toString()) / USDT_DECIMALS;
    } catch (error) {
      console.error("Error checking USDT balance:", error);
      return 0;
    }
  }, [tronWeb]);

  const checkUSDTAllowance = useCallback(async (owner: string, spender: string): Promise<number> => {
    try {
      const usdtContract = await tronWeb.contract(TRC20_ABI, USDT_CONTRACT);
      const allowance = await usdtContract.allowance(owner, spender).call();
      return parseInt(allowance.toString()) / USDT_DECIMALS;
    } catch (error) {
      console.error("Error checking USDT allowance:", error);
      return 0;
    }
  }, [tronWeb]);

  const approveUSDT = useCallback(async (spender: string, amount: number): Promise<string> => {
    try {
      const usdtContract = await tronWeb.contract(TRC20_ABI, USDT_CONTRACT);
      const amountInWei = Math.floor(amount * USDT_DECIMALS);
      
      const result = await usdtContract.approve(spender, amountInWei).send({
        feeLimit: 50_000_000,
        shouldPollResponse: false
      });
      
      return result;
    } catch (error) {
      console.error("USDT approval error:", error);
      throw new Error(`USDT approval failed: ${error.message || error}`);
    }
  }, [tronWeb]);

  const fundEscrow = useCallback(async (isTRC20: boolean) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setStatus("");
    setTxId("");

    try {
      if (!tronWeb || !tronWeb.defaultAddress || !tronWeb.defaultAddress.base58) {
        throw new Error("TronLink not connected. Please connect your wallet.");
      }

      const buyer = tronWeb.defaultAddress.base58;
      const orderIdStr = checkoutData?.orderNo || `ORDER_${Date.now()}`;
      const orderId = tronWeb.sha3(orderIdStr);
      const amount = 0.5; // 0.5 tokens/TRX
      const amountInWei = isTRC20 ? Math.floor(amount * USDT_DECIMALS) : Math.floor(amount * 1_000_000); // TRX uses 6 decimals
      const expiry = Math.floor(Date.now() / 1000) + 86400;
      const attestRef = tronWeb.sha3("TXN_REF_" + Date.now());

      console.log("Transaction params:", { 
        orderId, buyer, MERCHANT, amount, amountInWei, expiry, attestRef, isTRC20 
      });

      // Get contract instance
      const contract = await tronWeb.contract(ESCROW_ABI, ESCROW_VAULT);

      if (isTRC20) {
        // TRC20 USDT Payment Flow
        setStatus("Checking USDT balance...");
        
        const balance = await checkUSDTBalance(buyer);
        console.log(`USDT Balance: ${balance}`);
        
        if (balance < amount) {
          throw new Error(`Insufficient USDT balance. Required: ${amount}, Available: ${balance}`);
        }

        setStatus("Checking USDT allowance...");
        const currentAllowance = await checkUSDTAllowance(buyer, ESCROW_VAULT);
        console.log(`Current allowance: ${currentAllowance}`);

        if (currentAllowance < amount) {
          setStatus("Approving USDT spend...");
          const approveTx = await approveUSDT(ESCROW_VAULT, amount * 2); // Approve 2x for future txs
          console.log("Approval transaction:", approveTx);
          
          setStatus("Waiting for approval confirmation...");
          await waitForTransaction(tronWeb, approveTx);
          
          // Wait a bit more for blockchain state update
          await new Promise(r => setTimeout(r, 2000));
        }

        setStatus("Executing USDT escrow funding...");
        
        const result = await contract.fund(
          orderId,
          buyer,
          MERCHANT,
          amountInWei,
          expiry,
          attestRef
        ).send({ 
          feeLimit: 100_000_000,
          shouldPollResponse: false
        });
        
        setTxId(result);
        console.log("Fund transaction:", result);

      } else {
        // TRX Native Payment Flow using fund() method
        setStatus("Checking TRX balance...");
        
        const balance = await tronWeb.trx.getBalance(buyer);
        const trxBalance = balance / 1_000_000;
        console.log(`TRX Balance: ${trxBalance}`);
        
        if (trxBalance < (amount + 0.1)) { // +0.1 for fees
          throw new Error(`Insufficient TRX balance. Required: ${amount + 0.1}, Available: ${trxBalance}`);
        }

        setStatus("Executing TRX escrow payment using fund method...");
        
        // For TRX payments, use fund() with callValue and pass 0 for amount
        // Some contracts expect amount=0 for native payments, others expect the actual amount
        // Try with 0 first, then amountInWei if that fails
        const result = await contract.fund(
          orderId,
          buyer,
          MERCHANT,
          0, // Pass 0 for TRX payments since value is in callValue
          expiry,
          attestRef
        ).send({ 
          feeLimit: 100_000_000, 
          callValue: amountInWei, // The actual TRX amount
          shouldPollResponse: false
        });
        
        setTxId(result);
        console.log("Fund (TRX) transaction:", result);
      }

      if (!txId) {
        throw new Error("Transaction failed - no transaction ID returned");
      }

      setStatus(`Transaction sent: ${txId}. Waiting for confirmation...`);

      // Wait for confirmation
      const receipt = await waitForTransaction(tronWeb, txId);
      const isConfirmed = receipt && receipt.receipt && receipt.receipt.result === "SUCCESS";
      const statusText = isConfirmed ? "CONFIRMED" : "PENDING";

      setStatus(`Transaction ${statusText}. ${isConfirmed ? "✅" : "⏳"}`);

      // Backend integration
      const payload = {
        txId,
        fromAddress: buyer,
        orderId: orderIdStr,
        amount: amountInWei,
        status: statusText,
        fee: receipt?.fee || 0,
        symbol: isTRC20 ? 'USDT' : 'TRX',
        merchantAddress: MERCHANT,
        contractAddress: ESCROW_VAULT,
        paymentType: isTRC20 ? "USDT" : "TRX",
        attestationRef: attestRef
      };

      console.log("Backend payload:", payload);
      // mutate(payload); // Uncomment when backend is ready

    } catch (err: any) {
      console.error("Transaction error:", err);
      let errorMessage = "Unknown error occurred";
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err?.error) {
        errorMessage = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
      }
      
      setStatus(`❌ Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, waitForTransaction, checkUSDTBalance, checkUSDTAllowance, approveUSDT, checkoutData, tronWeb]);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🚀 BorderlessFusePay Checkout (Fixed)</h1>

      {/* TronWeb Status */}
      <div style={{ 
        marginBottom: "1rem", 
        padding: "0.5rem", 
        backgroundColor: tronWeb ? "#d4edda" : "#f8d7da", 
        borderRadius: "4px",
        fontSize: "0.9rem",
        border: `1px solid ${tronWeb ? "#c3e6cb" : "#f5c6cb"}`
      }}>
        <strong>TronWeb Status:</strong> {tronWeb ? "✅ Connected" : "❌ Not Connected"}
        {tronWeb && tronWeb.defaultAddress && (
          <div><strong>Wallet:</strong> {tronWeb.defaultAddress.base58}</div>
        )}
      </div>

      {/* Debug Info */}
      <div style={{ 
        marginBottom: "1rem", 
        padding: "0.5rem", 
        backgroundColor: "#f8f9fa", 
        borderRadius: "4px",
        fontSize: "0.9rem"
      }}>
        <strong>Debug:</strong> Order ID: {checkoutData?.orderNo || "Not loaded"}
        <br />
        <strong>Contract:</strong> {ESCROW_VAULT}
        <br />
        <strong>USDT Contract:</strong> {USDT_CONTRACT}
        <br />
        <strong>Network:</strong> Nile Testnet
        <br />
        <strong>Contract Verification:</strong> 
        <a 
          href={`https://tronscan.org/#/contract/${ESCROW_VAULT}`}
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: "#007bff", marginLeft: "0.5rem" }}
        >
          Verify on TronScan
        </a>
      </div>

      {/* Payment Buttons */}
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => fundEscrow(true)}
          disabled={isLoading || !tronWeb}
          style={{ 
            padding: "1rem 2rem", 
            marginRight: "1rem",
            backgroundColor: (isLoading || !tronWeb) ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: (isLoading || !tronWeb) ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? "Processing..." : "Pay 0.5 USDT (TRC20)"}
        </button>

        <button
          onClick={() => fundEscrow(false)}
          disabled={isLoading || !tronWeb}
          style={{ 
            padding: "1rem 2rem",
            backgroundColor: (isLoading || !tronWeb) ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: (isLoading || !tronWeb) ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? "Processing..." : "Pay 0.5 TRX (native)"}
        </button>
      </div>

      {/* Status Display */}
      {status && (
        <div style={{ 
          padding: "1rem", 
          backgroundColor: status.includes("Error") ? "#ffe6e6" : "#e6ffe6",
          border: `1px solid ${status.includes("Error") ? "#ff9999" : "#99ff99"}`,
          borderRadius: "4px",
          marginBottom: "1rem"
        }}>
          <strong>Status:</strong> {status}
        </div>
      )}
      
      {/* Transaction Link */}
      {txId && (
        <div style={{ 
          padding: "1rem", 
          backgroundColor: "#f0f8ff",
          border: "1px solid #b3d9ff",
          borderRadius: "4px",
          wordBreak: "break-all"
        }}>
          <strong>Transaction ID:</strong> {txId}
          <br />
          <small>
            <a 
              href={`https://tronscan.org/#/transaction/${txId}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: "#007bff" }}
            >
              View on TronScan
            </a>
          </small>
        </div>
      )}
    </div>
  );
}