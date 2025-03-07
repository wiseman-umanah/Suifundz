const AppWithWallet = () => {
  return (
    <WalletProvider
      autoConnect={false}
      adapters={[
        new SuiWalletAdapter(),
        new SuietWalletAdapter(),
        new EthosWalletAdapter(),
      ]}
      onConnectError={(error) => {
        console.error("Wallet connection error:", error);
        alert(`Wallet connection error: ${error.message}`);
      }}
    >
      <App />
    </WalletProvider>
  );
};

export default AppWithWallet;
