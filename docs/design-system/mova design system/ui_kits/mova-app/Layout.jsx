// AppLayout + AuthLayout + PageHeader — direct port of frontend/src/components/layout/*

function AppLayout({ children, route, navigate, auth }) {
  const isActive = (r) => route === r;
  return (
    <div className="app-layout" style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)' }}>
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__left">
            <a className="app-header__logo" onClick={() => navigate("/")}><Logo className="h-6" style={{ height: 24 }}/></a>
            <nav className="app-nav">
              <a className={`app-nav__link ${isActive('/') ? 'is-active' : ''}`} onClick={() => navigate("/")}>Home</a>
              <a className={`app-nav__link ${isActive('/exercises') ? 'is-active' : ''}`} onClick={() => navigate("/exercises")}>Exercises</a>
              <a className={`app-nav__link ${isActive('/components') ? 'is-active' : ''}`} onClick={() => navigate("/components")}>Components</a>
            </nav>
          </div>
          <div className="app-header__right">
            {auth.user ? (
              <>
                <div className="user-info">
                  <span className="user-info__name">{auth.user.username}</span>
                  <Badge variant="secondary" className="badge--tiny">{auth.user.role}</Badge>
                </div>
                <Button variant="ghost" className="ghost-destructive" onClick={auth.logout}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
                <Button onClick={() => navigate("/register")}>Register</Button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}

function AuthLayout({ children, navigate }) {
  return (
    <div className="auth-shell">
      <div className="auth-stack">
        <a className="auth-logo" onClick={() => navigate("/")}><Logo style={{ height: 32 }}/></a>
        {children}
      </div>
    </div>
  );
}

function PageHeader({ title, description, actions }) {
  return (
    <div className="page-header">
      <div className="page-header__row">
        <div className="page-header__col">
          <h1 className="page-header__title">{title}</h1>
          {description && <p className="page-header__desc">{description}</p>}
        </div>
        {actions && <div className="page-header__actions">{actions}</div>}
      </div>
      <Separator/>
    </div>
  );
}

Object.assign(window, { AppLayout, AuthLayout, PageHeader });
