import { Link, NavLink } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"
import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-5xl items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <Logo className="h-6" />
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  cn(
                    "transition-colors hover:text-foreground/80",
                    isActive ? "text-foreground" : "text-foreground/60"
                  )
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/exercises"
                className={({ isActive }) =>
                  cn(
                    "transition-colors hover:text-foreground/80",
                    isActive ? "text-foreground" : "text-foreground/60"
                  )
                }
              >
                Exercises
              </NavLink>
            </nav>
          </div>
          <div className="ml-auto flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end gap-0.5">
                  <span className="text-sm font-medium leading-none">{user.username}</span>
                  <Badge variant="secondary" className="h-4 px-1 text-[10px] uppercase">
                    {user.role}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="h-8">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="h-8">
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Nav (Simple for now) */}
      <nav className="md:hidden flex border-b bg-muted/40 py-2 px-4 gap-4 text-xs font-medium overflow-x-auto whitespace-nowrap">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "transition-colors hover:text-foreground/80",
              isActive ? "text-foreground" : "text-foreground/60"
            )
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/exercises"
          className={({ isActive }) =>
            cn(
              "transition-colors hover:text-foreground/80",
              isActive ? "text-foreground" : "text-foreground/60"
            )
          }
        >
          Exercises
        </NavLink>
      </nav>

      <main className="container mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
