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
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__left">
            <Link to="/" className="app-header__logo">
              <Logo style={{ height: 24 }} />
            </Link>
            <nav className="app-nav">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  cn("app-nav__link", isActive && "is-active")
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/exercises"
                className={({ isActive }) =>
                  cn("app-nav__link", isActive && "is-active")
                }
              >
                Exercises
              </NavLink>
            </nav>
          </div>
          <div className="app-header__right">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <div className="user-info">
                  <span className="user-info__name">{user.username}</span>
                  <Badge variant="secondary" className="badge--tiny">
                    {user.role}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className="ghost-destructive h-8 px-2">
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

      <main className="app-main">
        {children}
      </main>
    </div>
  )
}
