import Button from './Button'

interface HeaderProps {
  onLoginClick?: () => void
  showLogin?: boolean
}

export default function Header({ onLoginClick, showLogin = true }: HeaderProps) {
  return (
    <header className="w-full px-6 py-4 bg-black/90 backdrop-blur-md border-b border-yellow-500/20 font-inter">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Zaap
          </h1>
        </div>
        
        {showLogin && (
          <Button variant="outline" onClick={onLoginClick}>
            Parent Login
          </Button>
        )}
      </div>
    </header>
  )
}
