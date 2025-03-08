import React, { useState, useEffect } from "react";
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
import axios from "axios";

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
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userBalance, setUserBalance] = useState(1000); // Mock balance for demo
  const [transactionDetails, setTransactionDetails] = useState(null);

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

    // Check for user's preferred theme
    const userPrefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(userPrefersDark);

    // Listen for theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
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

  // Apply dark mode to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // const handleWalletConnect = async () => {
  //   // Function to trigger wallet connection
  //   if (!connected) {
  //     await connect();
  //   }
  // };

  const handleTransfer = async () => {
    if (!connected || !account) {
      alert("Please connect your Sui wallet first");
      return;
    }

    if (!suiAmount || !opayAccountNumber) {
      alert("Please enter both amount and OPay account number");
      return;
    }

    if (parseFloat(suiAmount) > userBalance) {
      alert("Insufficient balance");
      return;
    }

    setIsLoading(true);
    setTransferStatus("Processing...");

    try {
      // Simulate blockchain delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Fake transaction for demo purposes
      const txId = "0x" + Math.random().toString(16).substr(2, 40);

      // Deduct from user's balance
      setUserBalance((prev) => prev - parseFloat(suiAmount));

      // Create transaction details for the modal
      const details = {
        txId,
        suiAmount: parseFloat(suiAmount),
        usdtAmount: usdtAmount.toFixed(2),
        localCurrency: selectedCurrency,
        localAmount: localAmount.toFixed(2),
        accountNumber: opayAccountNumber,
        currencySymbol: getCurrencySymbol(),
        timestamp: new Date().toISOString(),
      };

      setTransactionDetails(details);
      setTransferStatus("Transfer successful!");
      setShowModal(true);
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

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`w-full min-h-screen flex items-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-4xl mx-auto p-6 rounded-lg shadow-md ${
          darkMode ? "bg-gray-800 shadow-gray-700" : "bg-white shadow-gray-200"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-center">
            Decentralized Financial System
          </h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-300"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <ConnectButton />
          {connected && (
            <div className="flex flex-col items-end">
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Connected: {account?.address?.slice(0, 6)}...
                {account?.address?.slice(-4)}
              </p>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Balance: {userBalance.toFixed(2)} SUI
              </p>
            </div>
          )}
        </div>

        {/* Conversion Steps - Side by Side */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Step 1: SUI to USDT Conversion */}
          <div
            className={`flex-1 p-4 border rounded-md ${
              darkMode
                ? "border-gray-700 bg-gray-700"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <h2 className="text-lg font-medium mb-3">
              Step 1: Convert SUI to USDT
            </h2>

            <div className="mb-4">
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                SUI Amount
              </label>
              <input
                type="number"
                value={suiAmount}
                onChange={(e) => setSuiAmount(e.target.value)}
                placeholder="Enter SUI amount"
                className={`w-full px-3 py-2 border rounded-md ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "border-gray-300"
                }`}
                disabled={!connected}
              />
            </div>

            <div className="mb-2">
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                USDT Equivalent
              </label>
              <div
                className={`w-full px-3 py-2 border rounded-md ${
                  darkMode
                    ? "bg-gray-800 border-gray-600"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                ${usdtAmount.toFixed(2)} USDT
              </div>
              <p
                className={`mt-1 text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Exchange Rate: 1 SUI = ${suiToUsdtRate} USDT
              </p>
            </div>
          </div>

          {/* Step 2: USDT to Local Currency Conversion */}
          <div
            className={`flex-1 p-4 border rounded-md ${
              darkMode
                ? "border-gray-700 bg-gray-700"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <h2 className="text-lg font-medium mb-3">
              Step 2: Convert USDT to Local Currency
            </h2>

            <div className="mb-4">
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Select Local Currency
              </label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "border-gray-300"
                }`}
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
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Local Currency Equivalent
              </label>
              <div
                className={`w-full px-3 py-2 border rounded-md ${
                  darkMode
                    ? "bg-gray-800 border-gray-600"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                {getCurrencySymbol()}
                {localAmount.toFixed(2)}
              </div>
              <p
                className={`mt-1 text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Exchange Rate: 1 USDT = {getCurrencySymbol()}
                {currencies.find((c) => c.code === selectedCurrency)?.rate}
              </p>
            </div>
          </div>
        </div>

        {/* Transfer Section - Full Row */}
        <div
          className={`p-4 border rounded-md mb-4 ${
            darkMode
              ? "border-gray-700 bg-gray-700"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <h2 className="text-lg font-medium mb-3">Step 3: Transfer Details</h2>

          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              OPay Account Number
            </label>
            <input
              type="text"
              value={opayAccountNumber}
              onChange={(e) => setOpayAccountNumber(e.target.value)}
              placeholder="Enter OPay account number"
              className={`w-full px-3 py-2 border rounded-md ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-white"
                  : "border-gray-300"
              }`}
              disabled={!connected}
            />
          </div>

          <button
            onClick={handleTransfer}
            disabled={
              !connected || isLoading || !suiAmount || !opayAccountNumber
            }
            className={`w-full py-2 px-4 rounded-md ${
              darkMode
                ? "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50"
                : "bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
            }`}
          >
            {isLoading ? "Processing..." : "Convert & Transfer"}
          </button>
        </div>

        {transferStatus && !showModal && (
          <div
            className={`mt-4 p-3 rounded-md ${
              transferStatus.includes("successful")
                ? darkMode
                  ? "bg-green-800 text-green-100"
                  : "bg-green-100 text-green-800"
                : transferStatus.includes("Processing")
                ? darkMode
                  ? "bg-blue-800 text-blue-100"
                  : "bg-blue-100 text-blue-800"
                : darkMode
                ? "bg-red-800 text-red-100"
                : "bg-red-100 text-red-800"
            }`}
          >
            {transferStatus}
          </div>
        )}

        {/* Success Modal */}
        {showModal && transactionDetails && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div
              className={`relative p-6 rounded-lg shadow-lg max-w-md w-full ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <button
                onClick={() => setShowModal(false)}
                className={`absolute top-3 right-3 ${
                  darkMode ? "text-gray-300" : "text-gray-500"
                } hover:text-gray-700`}
              >
                ✕
              </button>

              <div className="text-center mb-4">
                <div
                  className={`inline-flex items-center justify-center h-16 w-16 rounded-full ${
                    darkMode ? "bg-green-800" : "bg-green-100"
                  } mb-4`}
                >
                  <svg
                    className={`h-8 w-8 ${
                      darkMode ? "text-green-200" : "text-green-600"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">Transfer Successful!</h2>
                <p
                  className={` ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } mt-1`}
                >
                  Your funds have been transferred successfully.
                </p>
              </div>

              <div
                className={`border-t border-b py-4 my-4 ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="grid grid-cols-2 gap-y-3">
                  <span
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Transaction ID:
                  </span>
                  <span className="text-right truncate">
                    {transactionDetails.txId.substring(0, 12)}...
                  </span>

                  <span
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    SUI Amount:
                  </span>
                  <span className="text-right">
                    {transactionDetails.suiAmount} SUI
                  </span>

                  <span
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    USDT Equivalent:
                  </span>
                  <span className="text-right">
                    ${transactionDetails.usdtAmount} USDT
                  </span>

                  <span
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Local Currency:
                  </span>
                  <span className="text-right">
                    {transactionDetails.currencySymbol}
                    {transactionDetails.localAmount}
                    {transactionDetails.localCurrency === "naira"
                      ? " NGN"
                      : transactionDetails.localCurrency === "eur"
                      ? " EUR"
                      : transactionDetails.localCurrency === "gbp"
                      ? " GBP"
                      : " USD"}
                  </span>

                  <span
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Account Number:
                  </span>
                  <span className="text-right">
                    {transactionDetails.accountNumber}
                  </span>

                  <span
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Status:
                  </span>
                  <span
                    className={`text-right ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    Credited ✓
                  </span>
                </div>
              </div>

              <p
                className={`text-center mb-4 text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                A notification has been sent to the account holder
              </p>

              <button
                onClick={() => {
                  setShowModal(false);
                  setSuiAmount("");
                  setOpayAccountNumber("");
                  setTransferStatus("");
                }}
                className={`w-full py-2 rounded-md ${
                  darkMode
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
