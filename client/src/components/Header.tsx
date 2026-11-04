import React from 'react'
import { Link } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'

interface HeaderProps {
  darkMode: boolean
  onToggleTheme: () => void
}

export default function Header({ darkMode, onToggleTheme }: HeaderProps) {
  return (
    <header className={`${darkMode ? 'bg-[#1b1e23] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} border-b sticky top-0 z-50 shadow-xs transition-colors`}>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <img 
            src="/SPaDe_Name3.png" 
            alt="SPaDe Corp Logo" 
            className="h-10 w-auto object-contain" 
          />
          <div>
            <div className="flex items-center space-x-0">
              <span className="font-extrabold tracking-tight text-lg"> </span>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm">
               DOMESTIC OS
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">Multi-Stop Geospatial Routing Engine</p>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold">
            <Link to="/" className="hover:text-amber-400 transition-colors">Search Console</Link>
            <Link to="/about" className="hover:text-amber-400 transition-colors">System Architecture</Link>
          </nav>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`p-2.5 rounded-xl border transition-all ${darkMode ? 'bg-[#252830] border-gray-700 text-amber-400 hover:bg-[#2e323b]' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}