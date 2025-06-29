import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Places from './components/Places'
import AddPlace from './components/AddPlace'
import AdminPanel from './components/AdminPanel'
import Profile from './components/Profile'
import Packages from './components/Packages'
import Advertisements from './components/Advertisements'
import { AuthProvider } from './contexts/AuthContext'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/places" element={<Places />} />
              <Route path="/add-place" element={<AddPlace />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/advertisements" element={<Advertisements />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
