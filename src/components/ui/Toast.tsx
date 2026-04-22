"use client"
import { Toaster } from 'react-hot-toast'

export const ToastProvider = () => {
  return (
    <Toaster 
      position="top-right" 
      toastOptions={{ 
        className: '!bg-[var(--bg-base)] !text-[var(--text-primary)] !border !border-[var(--border)] !shadow-2xl',
        success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }} 
    />
  )
}
