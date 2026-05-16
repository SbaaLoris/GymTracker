// Mova UI kit — data display + navigation primitives.
// Tabs, Table, Avatar, Accordion, Progress, Pagination, Breadcrumb, ScrollArea.

const { useState: useStateD, useRef: useRefD, useEffect: useEffectD, useId: useIdD } = React;

// ============== Tabs ==============
const TabsCtx = React.createContext(null);
function Tabs({ value, defaultValue, onValueChange, children, className = "" }) {
  const [internal, setInternal] = useStateD(defaultValue ?? "");
  const v = value !== undefined ? value : internal;
  const setV = (next) => { if (value === undefined) setInternal(next); onValueChange?.(next); };
  return <TabsCtx.Provider value={{ value: v, setValue: setV }}><div className={`tabs ${className}`}>{children}</div></TabsCtx.Provider>;
}
function TabsList({ children, className = "" }) {
  return <div role="tablist" className={`tabs-list ${className}`}>{children}</div>;
}
function TabsTrigger({ value, children, disabled, className = "" }) {
  const ctx = React.useContext(TabsCtx);
  const active = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      data-state={active ? "active" : "inactive"}
      disabled={disabled}
      onClick={() => ctx.setValue(value)}
      className={`tabs-trigger ${className}`}
    >
      {children}
    </button>
  );
}
function TabsContent({ value, children, className = "" }) {
  const ctx = React.useContext(TabsCtx);
  if (ctx.value !== value) return null;
  return <div role="tabpanel" className={`tabs-content ${className}`}>{children}</div>;
}

// ============== Avatar ==============
function Avatar({ children, className = "" }) {
  return <span className={`avatar ${className}`} data-slot="avatar">{children}</span>;
}
function AvatarImage({ src, alt, onError }) {
  const [errored, setErrored] = useStateD(false);
  if (!src || errored) return null;
  return <img className="avatar__img" src={src} alt={alt ?? ""} onError={() => { setErrored(true); onError?.(); }}/>;
}
function AvatarFallback({ children, className = "", delayMs }) {
  return <span className={`avatar__fallback ${className}`} data-slot="avatar-fallback">{children}</span>;
}

// ============== Accordion ==============
const AccordionCtx = React.createContext(null);
function Accordion({ type = "single", collapsible = false, value: vProp, defaultValue, onValueChange, children, className = "" }) {
  const [internal, setInternal] = useStateD(defaultValue ?? (type === "single" ? "" : []));
  const value = vProp !== undefined ? vProp : internal;
  const setValue = (v) => { if (vProp === undefined) setInternal(v); onValueChange?.(v); };
  function toggle(v) {
    if (type === "single") setValue(value === v && collapsible ? "" : v);
    else {
      const arr = Array.isArray(value) ? value : [];
      setValue(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
    }
  }
  function isOpen(v) {
    return type === "single" ? value === v : Array.isArray(value) && value.includes(v);
  }
  return <AccordionCtx.Provider value={{ toggle, isOpen }}><div className={`accordion ${className}`}>{children}</div></AccordionCtx.Provider>;
}
function AccordionItem({ value, children, className = "" }) {
  return <div className={`accordion-item ${className}`} data-value={value}>{React.Children.map(children, c => React.isValidElement(c) ? React.cloneElement(c, { __itemValue: value }) : c)}</div>;
}
function AccordionTrigger({ children, __itemValue, className = "" }) {
  const ctx = React.useContext(AccordionCtx);
  const open = ctx.isOpen(__itemValue);
  return (
    <button
      type="button"
      aria-expanded={open}
      data-state={open ? "open" : "closed"}
      onClick={() => ctx.toggle(__itemValue)}
      className={`accordion-trigger ${className}`}
    >
      <span className="accordion-trigger__label">{children}</span>
      <svg className="accordion-trigger__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
    </button>
  );
}
function AccordionContent({ children, __itemValue, className = "" }) {
  const ctx = React.useContext(AccordionCtx);
  const open = ctx.isOpen(__itemValue);
  return (
    <div data-state={open ? "open" : "closed"} className={`accordion-content ${className}`} hidden={!open}>
      <div className="accordion-content__inner">{children}</div>
    </div>
  );
}

// ============== Table ==============
function Table({ children, className = "" }) { return <div className="table-wrap"><table className={`table ${className}`}>{children}</table></div>; }
function TableHeader({ children }) { return <thead className="table__header">{children}</thead>; }
function TableBody({ children }) { return <tbody className="table__body">{children}</tbody>; }
function TableFooter({ children }) { return <tfoot className="table__footer">{children}</tfoot>; }
function TableRow({ children, className = "" }) { return <tr className={`table__row ${className}`}>{children}</tr>; }
function TableHead({ children, className = "" }) { return <th className={`table__head ${className}`}>{children}</th>; }
function TableCell({ children, className = "" }) { return <td className={`table__cell ${className}`}>{children}</td>; }
function TableCaption({ children }) { return <caption className="table__caption">{children}</caption>; }

// ============== Progress ==============
function Progress({ value = 0, max = 100, className = "" }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`progress ${className}`} role="progressbar" aria-valuemin="0" aria-valuemax={max} aria-valuenow={value}>
      <div className="progress__indicator" style={{ width: `${pct}%` }}/>
    </div>
  );
}

// ============== Pagination ==============
function Pagination({ children, className = "" }) { return <nav role="navigation" aria-label="Pagination" className={`pagination ${className}`}>{children}</nav>; }
function PaginationContent({ children }) { return <ul className="pagination__list">{children}</ul>; }
function PaginationItem({ children }) { return <li>{children}</li>; }
function PaginationLink({ children, isActive, onClick, className = "" }) {
  return (
    <a
      role="link"
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
      data-state={isActive ? "active" : ""}
      className={`pagination__link ${isActive ? "is-active" : ""} ${className}`}
    >{children}</a>
  );
}
function PaginationPrevious({ onClick }) {
  return (
    <a className="pagination__link pagination__link--nav" onClick={onClick}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
      Previous
    </a>
  );
}
function PaginationNext({ onClick }) {
  return (
    <a className="pagination__link pagination__link--nav" onClick={onClick}>
      Next
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
    </a>
  );
}
function PaginationEllipsis() {
  return <span className="pagination__ellipsis" aria-hidden="true">…</span>;
}

// ============== Breadcrumb ==============
function Breadcrumb({ children, className = "" }) { return <nav aria-label="Breadcrumb" className={`breadcrumb ${className}`}>{children}</nav>; }
function BreadcrumbList({ children }) { return <ol className="breadcrumb__list">{children}</ol>; }
function BreadcrumbItem({ children, className = "" }) { return <li className={`breadcrumb__item ${className}`}>{children}</li>; }
function BreadcrumbLink({ children, href, onClick, asChild = false }) {
  if (asChild) return React.cloneElement(children, { className: "breadcrumb__link" });
  return <a className="breadcrumb__link" href={href} onClick={onClick}>{children}</a>;
}
function BreadcrumbPage({ children }) { return <span className="breadcrumb__page" role="link" aria-disabled="true" aria-current="page">{children}</span>; }
function BreadcrumbSeparator({ children }) {
  return (
    <li role="presentation" aria-hidden="true" className="breadcrumb__sep">
      {children ?? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      )}
    </li>
  );
}

// ============== ScrollArea (simple wrapper — native scrollbars) ==============
function ScrollArea({ children, className = "", maxHeight = 240 }) {
  return <div className={`scrollarea ${className}`} style={{ maxHeight }}>{children}</div>;
}

Object.assign(window, {
  Tabs, TabsList, TabsTrigger, TabsContent,
  Avatar, AvatarImage, AvatarFallback,
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
  Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption,
  Progress,
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis,
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
  ScrollArea,
});
