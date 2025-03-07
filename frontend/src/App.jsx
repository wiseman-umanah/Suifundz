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
  const [amount, setAmount] = useState("");
  const [nairaAmount, setNairaAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [opayAccountNumber, setOpayAccountNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transferStatus, setTransferStatus] = useState("");

  // Fetch exchange rate on component mount
  useEffect(() => {
    const getExchangeRate = async () => {
      try {
        // In a real app, you would fetch this from an actual API
        // Using a mock exchange rate for MVP
        setExchangeRate(450); // Example: 1 SUI = 450 Naira
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    getExchangeRate();
  }, []);

  // Calculate Naira equivalent when amount changes
  useEffect(() => {
    if (amount && exchangeRate) {
      setNairaAmount(parseFloat(amount) * exchangeRate);
    } else {
      setNairaAmount(0);
    }
  }, [amount, exchangeRate]);

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

    if (!amount || !opayAccountNumber) {
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
            amount,
          ],
          gasBudget: 10000,
        },
      });

      console.log("Transfer response:", transferResponse);

      // 2. Call your backend to handle the OPay transfer
      const opayResponse = await axios.post("/api/transfer-to-opay", {
        suiTransactionId: transferResponse.digest,
        amount: nairaAmount,
        opayAccountNumber,
      });

      if (opayResponse.data.success) {
        setTransferStatus("Transfer successful!");
      } else {
        setTransferStatus(`Transfer failed: ${opayResponse.data.message}`);
      }
    } catch (error) {
      console.error("Error during transfer:", error);
      setTransferStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center">
		<div className="w-md mx-auto p-6 bg-white rounded-lg shadow-emerald-400 shadow-md">
		<h1 className="text-2xl font-bold mb-6">
			Decentralise Financial Exchange{" "}
		</h1>

		<div className="mb-6 flex justify-center">
			<ConnectButton />
			{connected && (
			<p className="mt-2 text-sm text-gray-600">
				Connected: {account?.address?.slice(0, 6)}...
				{account?.address?.slice(-4)}
			</p>
			)}
		</div>

		<div className="mb-4">
			<label className="block text-sm font-medium text-gray-700 mb-1">
			SUI Amount
			</label>
			<input
			type="number"
			value={amount}
			onChange={(e) => setAmount(e.target.value)}
			placeholder="Enter SUI amount"
			className="w-full px-3 py-2 border border-gray-300 rounded-md"
			disabled={!connected}
			/>
		</div>

		<div className="mb-4">
			<label className="block text-sm font-medium text-gray-700 mb-1">
			Naira Equivalent
			</label>
			<div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
			₦{nairaAmount.toFixed(2)}
			</div>
			<p className="mt-1 text-xs text-gray-500">
			Exchange Rate: 1 SUI = ₦{exchangeRate}
			</p>
		</div>

		<div className="mb-6">
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
			disabled={!connected || isLoading || !amount || !opayAccountNumber}
			className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-green-300"
		>
			{isLoading ? "Processing..." : "Transfer to OPay"}
		</button>

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
