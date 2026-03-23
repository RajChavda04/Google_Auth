
import './App.css'
import Login from "./pages/Login"
import { HomePage } from "./pages/Home"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from './context/AuthContext.jsx'
import ToastProvider from './components/ToastProvider.jsx'

// Protected Route Component
const ProtectedRoute = ({ element, user, loading }) => {
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  return user ? element : <Navigate to="/login" />
}

// Login Route Component
const LoginRoute = ({ element, user, loading }) => {
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  return user ? <Navigate to="/home" /> : element
}

function App() {
  const { user, logout } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const handleLogout = () => {
    logout()
  }

  return (
    <BrowserRouter>
     <ToastProvider />
        <Routes>
          <Route path="/login" element={<LoginRoute element={<Login />} user={user} loading={loading} />} />
          <Route path="/home" element={<ProtectedRoute element={<HomePage user={user?.name || user?.email} onLogout={handleLogout} />} user={user} loading={loading} />} />
          <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
        </Routes>
     
    </BrowserRouter>
  )
}

export default App
