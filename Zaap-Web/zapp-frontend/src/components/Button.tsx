import { type ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false 
}: ButtonProps) {
  const baseClasses = 'font-bold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 active:scale-95'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 focus:ring-yellow-300 shadow-lg hover:shadow-xl hover:shadow-yellow-400/30',
    secondary: 'bg-gradient-to-r from-yellow-500 to-yellow-700 text-black hover:from-yellow-600 hover:to-yellow-800 focus:ring-yellow-300 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black focus:ring-yellow-300 bg-transparent hover:shadow-lg hover:shadow-yellow-400/30'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none' : ''

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  )
}
