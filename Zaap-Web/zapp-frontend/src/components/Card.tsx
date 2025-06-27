import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  const hoverClasses = hover ? 'hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20' : ''
  
  return (
    <div className={`bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 p-8 transition-all duration-300 ${hoverClasses} ${className}`}>
      {children}
    </div>
  )
}
