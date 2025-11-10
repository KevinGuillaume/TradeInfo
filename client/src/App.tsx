import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import HomeDEX from './pages/HomeDEX';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from './config/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
            accentColor: '#7c3aed',        // purple
            accentColorForeground: 'white',
            borderRadius: 'large',
            overlayBlur: 'small',
          })}>
          <div className="min-h-screen bg-[#3B4252]/80 backdrop-blur-md">
            <Router>
              <AppHeader />
              <Routes>
                <Route path="/" element={<HomeDEX />} />
              </Routes>
            </Router>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;