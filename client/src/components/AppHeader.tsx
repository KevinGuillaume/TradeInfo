import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

interface Props {
  mode: 'light' | 'dark'
  onToggleMode: () => void
}

export default function AppHeader({ mode, onToggleMode }: Props) {

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          TradeInfo Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button variant="contained" color="secondary">Connect Wallet</Button>
          <IconButton color="inherit" aria-label="toggle theme" onClick={onToggleMode}>
            {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}


