import React from 'react'
import { Link, useResolvedPath } from "react-router-dom"
import { Code, ShoppingCartIcon } from "lucide-react"
import ThemeSelector from './ThemeSelector'
import { useThemeStore } from '../store/useThemeStore'

function Navbar() {
  const { pathname } = useResolvedPath()
  const isHomePage = pathname === "/"
  const { theme } = useThemeStore()

  return (
    // icon & title (logo)
    <div className="bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50">
      <div className='max-w-7xl mx-auto'>
        <div className="navbar px-4 min-h-16 justify-between">
          <div className="flex-2 items-center gap-2">
            <Link to="/" className="hover-opacity-80 transition-opacity">
              <div className="flex items-center gap-2">
                <Code className="size-9 text-primary" />
                <span className={`font-semibold font-mono tracking-widest text-2xl bg-clip-text text-transparent bg-linear-to-r from-primary ${theme === "abyss" ? "to-sky-300" : "to-secondary"}`}>
                  PERN STORE
                </span>
              </div>
            </Link>
          </div>
          {/* right side (nav links) */}
          <div className="flex items-center gap-4">
            <ThemeSelector />

            {isHomePage && (
              <div className="indicator">
                <div className="p-2 rounded-full hover:bg-base-200 transition-colors">
                  <ShoppingCartIcon className="size-5" />
                  <span className="badge badge-sm badge-primary indicator-item">3</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>


  )
}

export default Navbar