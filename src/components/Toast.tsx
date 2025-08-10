'use client'

import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'error' | 'success' | 'warning'
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose, duration])

  const bgColor = {
    error: 'bg-gradient-to-r from-red-500 to-pink-600',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-600'
  }

  const icon = {
    error: '❌',
    success: '✅',
    warning: '⚠️'
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className={`${bgColor[type]} text-white px-6 py-4 rounded-xl shadow-lg max-w-sm`}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon[type]}</span>
          <p className="font-medium">{message}</p>
          <button 
            onClick={onClose}
            className="ml-auto text-white/80 hover:text-white text-xl"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}