import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './component/Home';
import App from './App';
import { WalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';

createRoot(document.getElementById('root')).render(
  <Router>
    <WalletProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wallet" element={<App />} />
      </Routes>
    </WalletProvider>
  </Router>
);