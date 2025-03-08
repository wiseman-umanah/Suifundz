import React, { useState, useEffect } from "react";

import {
  ConnectButton,
  useWallet,
  SuiWallet,
  SuietWallet,
} from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
import axios from "axios";

// function App() {
//   return (
//     <div className="relative sm:-8  bg-[#FFFFFF] min-h-screen ">
//       {/* <Home /> */}

//     </div>
//   );
// }

// export default App;

// src/App.js
import "./App.css";
// React component for the main converter interface
function App() {
  const { connected, account, signAndExecuteTransaction, connect } =
    useWallet();
  const [suiAmount, setSuiAmount] = useState("");
  const [usdtAmount, setUsdtAmount] = useState(0);
  const [localAmount, setLocalAmount] = useState(0);
  const [suiToUsdtRate, setSuiToUsdtRate] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  const [opayAccountNumber, setOpayAccountNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transferStatus, setTransferStatus] = useState("");

  // Currency options
  const currencies = [
    { code: "usd", name: "US Dollar", symbol: "$", rate: 1 },
    { code: "naira", name: "Nigerian Naira", symbol: "₦", rate: 450 },
    { code: "eur", name: "Euro", symbol: "€", rate: 0.85 },
    { code: "gbp", name: "British Pound", symbol: "£", rate: 0.75 },
  ];

  // Fetch exchange rates on component mount
  useEffect(() => {
    const getExchangeRates = async () => {
      try {
        // In a real app, you would fetch these from actual APIs
        // Using mock exchange rates for MVP
        setSuiToUsdtRate(25); // Example: 1 SUI = 25 USDT
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    getExchangeRates();
  }, []);

  // Calculate USDT equivalent when SUI amount changes
  useEffect(() => {
    if (suiAmount && suiToUsdtRate) {
      setUsdtAmount(parseFloat(suiAmount) * suiToUsdtRate);
    } else {
      setUsdtAmount(0);
    }
  }, [suiAmount, suiToUsdtRate]);

  // Calculate local currency equivalent when USDT amount or currency changes
  useEffect(() => {
    if (usdtAmount && selectedCurrency) {
      const currency = currencies.find((c) => c.code === selectedCurrency);
      if (currency) {
        setLocalAmount(usdtAmount * currency.rate);
      }
    } else {
      setLocalAmount(0);
    }
  }, [usdtAmount, selectedCurrency]);

  const handleWalletConnect = async () => {
    // Function to trigger wallet connection
    if (!connected) {
      await connect();
    }
  };

  const handleTransfer = async () => {
    if (!connected || !account) {
      alert("Please connect your Sui wallet first");
      return;
    }

    if (!suiAmount || !opayAccountNumber) {
      alert("Please enter both amount and OPay account number");
      return;
    }

    setIsLoading(true);
    setTransferStatus("Processing...");

    try {
      // 1. Transfer SUI from user's wallet (on testnet)
      const transferResponse = await signAndExecuteTransaction({
        kind: "moveCall",
        data: {
          packageObjectId: "YOUR_PACKAGE_OBJECT_ID", // Replace with your actual package ID
          module: "sui_converter",
          function: "transfer_sui",
          typeArguments: [],
          arguments: [
            // Arguments for your smart contract function
            suiAmount,
          ],
          gasBudget: 10000,
        },
      });

      console.log("Transfer response:", transferResponse);

      // 2. Call your backend to handle the transfer
      const backendResponse = await axios.post("/api/transfer", {
        suiTransactionId: transferResponse.digest,
        suiAmount,
        usdtAmount,
        localCurrency: selectedCurrency,
        localAmount,
        accountNumber: opayAccountNumber,
      });

      if (backendResponse.data.success) {
        setTransferStatus("Transfer successful!");
      } else {
        setTransferStatus(`Transfer failed: ${backendResponse.data.message}`);
      }
    } catch (error) {
      console.error("Error during transfer:", error);
      setTransferStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrencySymbol = () => {
    const currency = currencies.find((c) => c.code === selectedCurrency);
    return currency ? currency.symbol : "$";
  };

  return (
    <div className="w-full h-screen flex items-center">
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-gray-200 shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Decentralized Financial System
        </h1>

        <div className="mb-6 flex justify-center">
          <ConnectButton />
          {connected && (
            <p className="mt-2 text-sm text-gray-600 ml-4">
              Connected: {account?.address?.slice(0, 6)}...
              {account?.address?.slice(-4)}
            </p>
          )}
        </div>

        {/* Conversion Steps - Side by Side */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Step 1: SUI to USDT Conversion */}
          <div className="flex-1 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h2 className="text-lg font-medium mb-3">
              Step 1: Convert SUI to USDT
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SUI Amount
              </label>
              <input
                type="number"
                value={suiAmount}
                onChange={(e) => setSuiAmount(e.target.value)}
                placeholder="Enter SUI amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={!connected}
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                USDT Equivalent
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                ${usdtAmount.toFixed(2)} USDT
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Exchange Rate: 1 SUI = ${suiToUsdtRate} USDT
              </p>
            </div>
          </div>

          {/* Step 2: USDT to Local Currency Conversion */}
          <div className="flex-1 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h2 className="text-lg font-medium mb-3">
              Step 2: Convert USDT to Local Currency
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Local Currency
              </label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={!connected}
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name} ({currency.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Local Currency Equivalent
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                {getCurrencySymbol()}
                {localAmount.toFixed(2)}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Exchange Rate: 1 USDT = {getCurrencySymbol()}
                {currencies.find((c) => c.code === selectedCurrency)?.rate}
              </p>
            </div>
          </div>
        </div>

        {/* Transfer Section - Full Row */}
        <div className="p-4 border border-gray-200 rounded-md bg-gray-50 mb-4">
          <h2 className="text-lg font-medium mb-3">Step 3: Transfer Details</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OPay Account Number
            </label>
            <input
              type="text"
              value={opayAccountNumber}
              onChange={(e) => setOpayAccountNumber(e.target.value)}
              placeholder="Enter OPay account number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={!connected}
            />
          </div>

          <button
            onClick={handleTransfer}
            disabled={
              !connected || isLoading || !suiAmount || !opayAccountNumber
            }
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-950 disabled:bg-gray-950"
          >
            {isLoading ? "Processing..." : "Convert & Transfer"}
          </button>
        </div>

        {transferStatus && (
          <div
            className={`mt-4 p-3 rounded-md ${
              transferStatus.includes("successful")
                ? "bg-green-100 text-green-800"
                : transferStatus.includes("Processing")
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {transferStatus}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
