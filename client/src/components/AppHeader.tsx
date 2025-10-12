import { AppBar, Toolbar, Typography, IconButton, Box, Tabs, Tab } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ConnectWalletButton from './ConnectWalletButton';
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

interface Props {
  mode: 'light' | 'dark'
  onToggleMode: () => void
}

export default function AppHeader({ mode, onToggleMode }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    // Set active tab based on current route
    if (location.pathname === '/') {
      setTabValue(0)
    } else if (location.pathname === '/profile') {
      setTabValue(1)
    }
  }, [location.pathname])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    if (newValue === 0) {
      navigate('/')
    } else if (newValue === 1) {
      navigate('/profile')
    }
  }

  return (
    <AppBar position="fixed" color="primary" enableColorOnDark sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ mr: 4 }}>
          TradeInfo Dashboard
        </Typography>
        
        <Tabs value={tabValue} onChange={handleTabChange} textColor="inherit" sx={{ flexGrow: 1 }}>
          <Tab label="Etherscan" />
          <Tab label="Profile" />
        </Tabs>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ConnectWalletButton />
          <IconButton color="inherit" aria-label="toggle theme" onClick={onToggleMode}>
            {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}


