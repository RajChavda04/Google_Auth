
import './App.css'
import Login from "./pages/Login"
import { HomePage } from "./pages/Home"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from './context/AuthContext.jsx'

function App() {
  const { user, logout } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const handleLogout = () => {
    logout()
  }

  // Protected Route Component
  const ProtectedRoute = ({ element }) => {
    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
    return user ? element : <Navigate to="/login" />
  }

  // Login Route Component
  const LoginRoute = ({ element }) => {
    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
    return user ? <Navigate to="/home" /> : element
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginRoute element={<Login />} />} />
        <Route path="/home" element={<ProtectedRoute element={<HomePage user={user?.name || user?.email} onLogout={handleLogout} />} />} />
        <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
