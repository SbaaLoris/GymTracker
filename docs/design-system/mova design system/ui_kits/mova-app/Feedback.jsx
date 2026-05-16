// Mova UI kit — feedback primitives.
// Alert, Empty, Spinner, Skeleton, Sonner-style toast.

const { useState: useStateFb, useEffect: useEffectFb, useRef: useRefFb } = React;

// ============== Skeleton ==============
function Skeleton({ className = "", style }) {
  return <div className={`skeleton ${className}`} data-slot="skeleton" style={style}/>;
}

// ============== Spinner ==============
function Spinner({ className = "", "data-icon": dataIcon }) {
  return (
    <svg className={`spinner ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" data-icon={dataIcon}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" opacity="1"/>
    </svg>
  );
}

// ============== Alert ==============
function Alert({ variant = "default", children, className = "" }) {
  return (
    <div role="alert" data-variant={variant} className={`alert alert--${variant} ${className}`}>
      {children}
    </div>
  );
}
function AlertTitle({ children, className = "" }) { return <div className={`alert__title ${className}`}>{children}</div>; }
function AlertDescription({ children, className = "" }) { return <div className={`alert__desc ${className}`}>{children}</div>; }

// ============== Empty (shadcn Empty pattern) ==============
function Empty({ children, className = "" }) {
  return <div className={`empty ${className}`} data-slot="empty">{children}</div>;
}
function EmptyHeader({ children }) { return <div className="empty__header">{children}</div>; }
function EmptyMedia({ children, variant = "default" }) {
  return <div className={`empty__media empty__media--${variant}`}>{children}</div>;
}
function EmptyTitle({ children }) { return <div className="empty__title">{children}</div>; }
function EmptyDescription({ children }) { return <div className="empty__desc">{children}</div>; }
function EmptyContent({ children }) { return <div className="empty__content">{children}</div>; }

// ============== Sonner-style toast ==============
// Stateful singleton — `toast.success("Saved")`, `toast.error(...)`, `toast(...)`.
const ToasterCtx = React.createContext(null);
function Toaster({ position = "bottom-right" }) {
  const [items, setItems] = useStateFb([]);
  useEffectFb(() => {
    window.__movaToast = (input) => {
      const t = typeof input === "string" ? { message: input } : input;
      const id = t.id ?? Date.now() + Math.random();
      setItems(prev => [...prev, { id, ...t }]);
      const dur = t.duration ?? 3500;
      setTimeout(() => setItems(prev => prev.filter(i => i.id !== id)), dur);
    };
  }, []);
  return (
    <div className={`toaster toaster--${position}`} aria-live="polite">
      {items.map(t => (
        <div key={t.id} role="status" className={`toast toast--${t.variant ?? "default"}`}>
          {t.icon && <span className="toast__icon">{t.icon}</span>}
          <div className="toast__col">
            <div className="toast__title">{t.title ?? t.message}</div>
            {t.title && t.message && <div className="toast__desc">{t.message}</div>}
            {t.description && <div className="toast__desc">{t.description}</div>}
          </div>
          {t.action && <button className="toast__action" onClick={t.action.onClick}>{t.action.label}</button>}
        </div>
      ))}
    </div>
  );
}
// Public API
function toast(input) { return window.__movaToast?.(typeof input === "string" ? { message: input } : input); }
toast.success = (m, opts = {}) => toast({ message: m, variant: "success", ...opts });
toast.error   = (m, opts = {}) => toast({ message: m, variant: "error",   ...opts });
toast.info    = (m, opts = {}) => toast({ message: m, variant: "info",    ...opts });

Object.assign(window, {
  Skeleton, Spinner,
  Alert, AlertTitle, AlertDescription,
  Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent,
  Toaster, toast,
});
