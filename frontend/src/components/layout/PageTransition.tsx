import { useLocation } from "react-router-dom"

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const { key } = useLocation()

  return (
    <div
      key={key}
      className="w-full h-full animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out"
    >
      {children}
    </div>
  )
}
