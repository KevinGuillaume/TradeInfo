import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppHeader from './components/AppHeader'
import HomeDEX from './pages/HomeDex'

function App() {
  return (
    <div className="min-h-screen bg-[#3B4252]/80 backdrop-blur-md">
  <Router>
    <AppHeader />
    <Routes>
      <Route path="/" element={<HomeDEX />} />
    </Routes>
  </Router>
</div>
  )
}

export default App
