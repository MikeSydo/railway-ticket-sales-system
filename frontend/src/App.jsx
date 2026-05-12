import './App.css'
import { Route, Routes } from 'react-router-dom'
import Booking from './pages/Booking'
import Home from './pages/Home'
import Auth from './pages/Auth'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/booking/:trainId" element={<Booking />} />
      </Route>
    </Routes>
  )
}

export default App
