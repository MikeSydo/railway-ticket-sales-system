import './App.css'
import { Route, Routes } from 'react-router-dom'
import Booking from './pages/Booking'
import Home from './pages/Home'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/booking/:trainId" element={<Booking />} />
    </Routes>
  )
}

export default App
