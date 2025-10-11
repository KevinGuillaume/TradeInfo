import './App.css'
import { CssBaseline, Container, Box, ThemeProvider, createTheme, useMediaQuery } from '@mui/material'
import { useMemo, useEffect, useState } from 'react'
import AppHeader from './components/AppHeader'
import AddressSearch from './components/AddressSearch'
import WalletSummaryCard from './components/WalletSummaryCard'
import TransactionsDashboard from './components/TransactionsDashboard'
import LiveStatusBar from './components/LiveStatusBar'
import type { WalletInfo } from './api'
import { etherscanAPI } from './api'

function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('themeMode') as 'light' | 'dark' | null
    if (stored === 'light' || stored === 'dark') return stored
    return prefersDark ? 'dark' : 'light'
  })
  const [walletData, setWalletData] = useState<WalletInfo | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    localStorage.setItem('themeMode', mode)
  }, [mode])
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode])

  const handleWalletSearch = async (address: string) => {
    setLoading(true)
    try {
      const data = await etherscanAPI.getWalletInfo(address)
      setWalletData(data)
    } catch (error) {
      console.error('Error fetching wallet data:', error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppHeader mode={mode} onToggleMode={() => setMode(mode === 'light' ? 'dark' : 'light')} />
        <Container maxWidth="xl" sx={{ mt: 3, mb: 6 }}>
          <Box sx={{ mb: 2 }}>
            <LiveStatusBar />
          </Box>
          <Box sx={{ mb: 3 }}>
            <AddressSearch onSearch={handleWalletSearch} loading={loading} />
          </Box>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
            gap: 3
          }}>
            <Box>
              <WalletSummaryCard walletData={walletData} />
            </Box>
            <Box>
              <TransactionsDashboard walletData={walletData} />
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  )
}

export default App
