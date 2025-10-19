import './App.css'
import { CssBaseline, ThemeProvider, createTheme, useMediaQuery } from '@mui/material'
import { useMemo, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppHeader from './components/AppHeader'
import HomeDEX from './pages/HomeDex'

function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('themeMode') as 'light' | 'dark' | null
    if (stored === 'light' || stored === 'dark') return stored
    return prefersDark ? 'dark' : 'light'
  })

  useEffect(() => {
    localStorage.setItem('themeMode', mode)
  }, [mode])
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode])
  
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppHeader mode={mode} onToggleMode={() => setMode(mode === 'light' ? 'dark' : 'light')} />
          <Routes>
            <Route path="/" element={<HomeDEX />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  )
}

export default App
