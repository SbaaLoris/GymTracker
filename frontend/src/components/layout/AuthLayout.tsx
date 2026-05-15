import { Link } from "react-router-dom"
import { Logo } from "@/components/Logo"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link to="/" className="self-center">
          <Logo className="h-8" />
        </Link>
        {children}
      </div>
    </div>
  )
}
