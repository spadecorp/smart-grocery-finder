import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from './components/Header'
import SearchPage from './pages/SearchPage'
import ResultsPage from './pages/ResultsPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('spade_theme') !== 'light'
  })

  useEffect(() => {
    localStorage.setItem('spade_theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-[#0E1013] text-[#EEF0F2] dark' : 'bg-[#F5F5F4] text-gray-900'}`}>
      <Header darkMode={darkMode} onToggleTheme={() => setDarkMode(!darkMode)} />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="container mx-auto px-4 py-10"
      >
        <Routes>
          <Route path="/" element={<SearchPage darkMode={darkMode} />} />
          <Route path="/results" element={<ResultsPage darkMode={darkMode} />} />
          <Route path="/about" element={<AboutPage darkMode={darkMode} />} />
        </Routes>
      </motion.main>
      
      <footer className={`${darkMode ? 'bg-[#0E1013] border-gray-800 text-gray-400' : 'bg-gray-900 border-gray-800 text-gray-400'} py-10 mt-20 border-t`}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs font-mono">
          <p>© 2026 SPaDe Corp Domestic Intelligence. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span>SMART GROCER • SPaDe CORP</span>
            <span>•</span>
            <span>STORE DATA: OPENSTREETMAP</span>
          </div>
        </div>
      </footer>
    </div>
  )
}