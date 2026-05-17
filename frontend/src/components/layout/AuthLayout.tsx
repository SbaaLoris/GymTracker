import { Link } from "react-router-dom"
import { Logo } from "@/components/Logo"
import { PageTransition } from "./PageTransition"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-shell">
      <div className="auth-stack">
        <Link to="/" className="auth-logo">
          <Logo style={{ height: 32 }} />
        </Link>
        <PageTransition>
          {children}
        </PageTransition>
      </div>
    </div>
  )
}

