import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainBody = () => {
  const navigate = useNavigate();

  const handleConnectWallet = () => {
    navigate('/dashboard');
  };

  return (
    <main className="flex flex-col justify-center items-center h-screen bg-sky-500 text-white">
      <h1 className="text-4xl font-bold text-center mb-6">Empowering Your Business Future With SuiFundz</h1>
      <button 
        className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
        onClick={handleConnectWallet}
      >
        Connect Your Sui Wallet
      </button>
    </main>
  );
};

export default MainBody;
