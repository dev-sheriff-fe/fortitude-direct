"use client";

import { useState, useCallback, useEffect } from "react";

export default function EscrowCheckout() {
  const [status, setStatus] = useState("");
  const [txId, setTxId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Contract & merchant addresses
  const ESCROW_VAULT = "TAbYX6SxkNp7zMqRRsAfPtsMs4o2zTmzms";
  const MERCHANT = "TXxPrefBbyktVJmtNqXvcL3xAXn4cFLfez";
  const USDT_DECIMALS = 1_000_000;
  
  // Basic escrow contract ABI - you'll need to replace this with your actual contract ABI
  const ESCROW_ABI = [
    {
      "inputs": [
        {"name": "orderId", "type": "bytes32"},
        {"name": "buyer", "type": "address"},
        {"name": "merchant", "type": "address"}, 
        {"name": "amount", "type": "uint256"},
        {"name": "expiry", "type": "uint256"},
        {"name": "attestRef", "type": "string"}
      ],
      "name": "fund",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"name": "orderId", "type": "bytes32"},
        {"name": "merchant", "type": "address"},
        {"name": "expiry", "type": "uint256"},
        {"name": "attestRef", "type": "string"}
      ],
      "name": "payWithTRX",
      "outputs": [],
      "stateMutability": "payable", 
      "type": "function"
    }
  ];
  const [checkoutData, setCheckoutData] = useState<any>(null);
  // Backend API
  const API_ENDPOINT = "/api/escrow/record";

  useEffect(() => {
    const stored = sessionStorage.getItem('checkout');
    if (stored) {
      setCheckoutData(JSON.parse(stored));
    }
  }, []);

  // Helper function to wait for transaction confirmation
  const waitForTransaction = useCallback(async (tronWeb: any, txId: string): Promise<any> => {
    return new Promise(async (resolve) => {
      let receipt: any = null;
      for (let i = 0; i < 30; i++) {
        try {
          receipt = await tronWeb.trx.getTransactionInfo(txId);
          if (receipt && receipt.receipt) {
            resolve(receipt);
            return;
          }
        } catch (error) {
          console.warn(`Attempt ${i + 1} failed:`, error);
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
      resolve(receipt); // Return whatever we have after 30 attempts
    });
  }, []);

  const fundEscrow = useCallback(async (isTRC20: boolean) => {
    if (isLoading) return; // Prevent multiple simultaneous calls
    
    setIsLoading(true);
    setStatus("");
    setTxId("");

    try {
      // Check TronLink availability
      if (!(window as any).tronWeb) {
        throw new Error("TronLink is not installed. Please install TronLink extension.");
      }

      if (!(window as any).tronWeb.ready) {
        throw new Error("TronLink is not ready. Please unlock your wallet.");
      }

      const tronWeb = (window as any).tronWeb;
      
      // More detailed wallet checks
      if (!tronWeb.defaultAddress || !tronWeb.defaultAddress.base58) {
        throw new Error("No wallet address found. Please connect your TronLink wallet.");
      }

      const buyer = tronWeb.defaultAddress.base58;
      console.log("Buyer address:", buyer);

      // Generate transaction parameters
      const orderIdStr = checkoutData?.orderNo || `ORDER_${Date.now()}`;
      
      if (!orderIdStr || typeof orderIdStr !== 'string') {
        throw new Error("Invalid order ID. Please refresh and try again.");
      }
      
      console.log("Order ID String:", orderIdStr);
      
      // Check if sha3 function exists
      if (!tronWeb.sha3) {
        throw new Error("TronWeb sha3 function not available. Please update TronLink.");
      }
      
      const orderId = tronWeb.sha3(orderIdStr);
      console.log("Hashed Order ID:", orderId);
      
      const amount = 0.5 * USDT_DECIMALS;
      const expiry = Math.floor(Date.now() / 1000) + 86400;
      const attestRef = "TXN_REF_" + Date.now();

      console.log("Transaction params:", { orderId, buyer, amount, expiry, attestRef });

      setStatus("Connecting to contract...");

      // Check if contract address is valid
      if (!tronWeb.isAddress(ESCROW_VAULT)) {
        throw new Error(`Invalid contract address: ${ESCROW_VAULT}`);
      }

      console.log("Attempting to connect to contract:", ESCROW_VAULT);
      
      // Try to get contract instance - start with the simplest approach
      let contract;
      try {
        console.log("Trying contract creation without ABI first...");
        contract = await tronWeb.contract().at(ESCROW_VAULT);
        console.log("Contract instance created successfully:", contract);
      } catch (contractError) {
        console.error("Contract creation failed:", contractError);
        
        // Try with explicit ABI as fallback
        try {
          console.log("Trying contract creation with explicit ABI...");
          contract = await tronWeb.contract(ESCROW_ABI, ESCROW_VAULT);
          console.log("Contract instance created with ABI:", contract);
        } catch (abiError) {
          console.error("Contract creation with ABI also failed:", abiError);
          throw new Error(`Failed to connect to contract at ${ESCROW_VAULT}. Please verify the contract exists and is deployed on the current network.`);
        }
      }

      setStatus("Preparing transaction...");

      // Check if required methods exist on contract
      if (isTRC20 && !contract.fund) {
        throw new Error("Contract does not have 'fund' method. Please check the contract ABI.");
      }
      if (!isTRC20 && !contract.payWithTRX) {
        throw new Error("Contract does not have 'payWithTRX' method. Please check the contract ABI.");
      }

      setStatus("Sending transaction...");

      let tx: string;

      if (isTRC20) {
        console.log("Calling fund method with params:", { orderId, buyer, MERCHANT, amount, expiry, attestRef });
        
        // TRC20 USDT fund
        try {
          const result = await contract.fund(
            orderId,
            buyer,
            MERCHANT,
            amount,
            expiry,
            attestRef
          ).send({ 
            feeLimit: 100_000_000,
            shouldPollResponse: false
          });
          tx = result;
        } catch (fundError) {
          console.error("Fund method error:", fundError);
          throw new Error(`TRC20 payment failed: ${fundError.message || fundError}`);
        }
      } else {
        console.log("Calling payWithTRX method with params:", { orderId, MERCHANT, expiry, attestRef, callValue: amount });
        
        // TRX native payment
        try {
          const result = await contract.payWithTRX(
            orderId,
            MERCHANT,
            expiry,
            attestRef
          ).send({ 
            feeLimit: 100_000_000, 
            callValue: amount,
            shouldPollResponse: false
          });
          tx = result;
        } catch (trxError) {
          console.error("PayWithTRX method error:", trxError);
          throw new Error(`TRX payment failed: ${trxError.message || trxError}`);
        }
      }
      
      console.log("Transaction result:", tx);

      if (!tx) {
        throw new Error("Transaction failed to execute - no transaction ID returned");
      }

      if (typeof tx !== 'string') {
        console.error("Unexpected transaction result:", tx);
        throw new Error("Invalid transaction result format");
      }

      setTxId(tx);
      setStatus(`Transaction sent: ${tx}. Waiting for confirmation...`);

      // Wait for transaction confirmation
      try {
        const receipt = await waitForTransaction(tronWeb, tx);
        const statusText = receipt && receipt.receipt ? "CONFIRMED" : "PENDING";

        setStatus(`Transaction ${statusText}. Preparing backend update...`);

        // Post transaction info to backend
        const payload = {
          txId: tx,
          buyerAddress: buyer,
          orderId: orderIdStr,
          amount,
          status: statusText,
          merchantAddress: MERCHANT,
          contractAddress: ESCROW_VAULT,
          paymentType: isTRC20 ? "USDT" : "TRX",
          timestamp: new Date().toISOString(),
        };

        console.log("Backend payload:", payload);

        // Uncommented for testing - you can re-enable when backend is ready
        // const response = await fetch(API_ENDPOINT, {
        //   method: "POST",
        //   headers: { 
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(payload),
        // });

        // if (!response.ok) {
        //   throw new Error(`Backend request failed: ${response.status} ${response.statusText}`);
        // }

        // const result = await response.json();

        setStatus(
          `✅ Transaction ${statusText} (${isTRC20 ? "USDT" : "TRX"}). Ready for backend integration.`
        );
      } catch (confirmError) {
        console.error("Transaction confirmation error:", confirmError);
        setStatus(`⚠️ Transaction sent but confirmation failed: ${confirmError.message}`);
      }

    } catch (err: any) {
      console.error("Transaction error:", err);
      
      // Better error message formatting
      let errorMessage = "Unknown error occurred";
      
      if (err && typeof err === 'object') {
        if (err.message) {
          errorMessage = err.message;
        } else if (err.error) {
          errorMessage = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
        } else {
          errorMessage = JSON.stringify(err);
        }
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setStatus(`❌ Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, waitForTransaction, ESCROW_VAULT, MERCHANT, USDT_DECIMALS, API_ENDPOINT, checkoutData]);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🚀 BorderlessFusePay Checkout</h1>

      {/* Debug info */}
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
        <strong>Network Check:</strong> 
        <a 
          href={`https://tronscan.org/#/contract/${ESCROW_VAULT}`}
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: "#007bff", marginLeft: "0.5rem" }}
        >
          Verify Contract on TronScan
        </a>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => fundEscrow(true)}
          disabled={isLoading}
          style={{ 
            padding: "1rem 2rem", 
            marginRight: "1rem",
            backgroundColor: isLoading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? "Processing..." : "Pay 0.5 USDT (TRC20)"}
        </button>

        <button
          onClick={() => fundEscrow(false)}
          disabled={isLoading}
          style={{ 
            padding: "1rem 2rem",
            backgroundColor: isLoading ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? "Processing..." : "Pay 0.5 TRX (native)"}
        </button>
      </div>

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