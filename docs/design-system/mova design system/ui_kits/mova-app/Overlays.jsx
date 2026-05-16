// Mova UI kit — overlay primitives.
// Dialog, AlertDialog, Sheet, Drawer, Tooltip, Popover, HoverCard, DropdownMenu.
// All overlays render inline with position: fixed; no portal needed for design demos.

const { useState: useStateO, useRef: useRefO, useEffect: useEffectO, useId: useIdO, useCallback } = React;

// ============== shared open-state contexts ==============
const DialogCtx      = React.createContext(null);
const AlertDialogCtx = React.createContext(null);
const SheetCtx       = React.createContext(null);
const DrawerCtx      = React.createContext(null);
const PopoverCtx     = React.createContext(null);
const DropdownCtx    = React.createContext(null);
const TooltipCtx     = React.createContext(null);
const HoverCardCtx   = React.createContext(null);

function makeStateProvider(Ctx, Tag = "div") {
  return function Provider({ children, defaultOpen = false, open: openProp, onOpenChange }) {
    const [openState, setOpenState] = useStateO(defaultOpen);
    const open = openProp !== undefined ? openProp : openState;
    const setOpen = (v) => { if (openProp === undefined) setOpenState(v); onOpenChange?.(v); };
    return <Ctx.Provider value={{ open, setOpen }}>{children}</Ctx.Provider>;
  };
}

// ============== Dialog ==============
const Dialog = makeStateProvider(DialogCtx);
function DialogTrigger({ children, asChild = false }) {
  const ctx = React.useContext(DialogCtx);
  const props = { onClick: (e) => { children.props.onClick?.(e); ctx.setOpen(true); } };
  if (asChild) return React.cloneElement(children, props);
  return <button type="button" {...props}>{children}</button>;
}
function DialogContent({ children, className = "" }) {
  const ctx = React.useContext(DialogCtx);
  useEffectO(() => {
    function onKey(e) { if (e.key === 'Escape') ctx.setOpen(false); }
    if (ctx.open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [ctx.open]);
  if (!ctx.open) return null;
  return (
    <div className="overlay-root" role="presentation">
      <div className="overlay-backdrop" onClick={() => ctx.setOpen(false)} data-state="open"/>
      <div className={`dialog ${className}`} role="dialog" aria-modal="true" data-state="open">
        <button className="dialog__close" aria-label="Close" onClick={() => ctx.setOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 6 12 12M6 18 18 6"/></svg>
        </button>
        {children}
      </div>
    </div>
  );
}
function DialogHeader({ children, className = "" }) { return <div className={`dialog__header ${className}`}>{children}</div>; }
function DialogTitle({ children, className = "" }) { return <h2 className={`dialog__title ${className}`}>{children}</h2>; }
function DialogDescription({ children, className = "" }) { return <p className={`dialog__desc ${className}`}>{children}</p>; }
function DialogFooter({ children, className = "" }) { return <div className={`dialog__footer ${className}`}>{children}</div>; }
function DialogClose({ children, asChild = false }) {
  const ctx = React.useContext(DialogCtx);
  const props = { onClick: () => ctx.setOpen(false) };
  if (asChild) return React.cloneElement(children, props);
  return <button type="button" {...props}>{children}</button>;
}

// ============== AlertDialog (modal, no close X, requires Cancel + Action) ==============
const AlertDialog = makeStateProvider(AlertDialogCtx);
function AlertDialogTrigger({ children, asChild = false }) {
  const ctx = React.useContext(AlertDialogCtx);
  const props = { onClick: () => ctx.setOpen(true) };
  if (asChild) return React.cloneElement(children, props);
  return <button type="button" {...props}>{children}</button>;
}
function AlertDialogContent({ children, className = "" }) {
  const ctx = React.useContext(AlertDialogCtx);
  if (!ctx.open) return null;
  return (
    <div className="overlay-root">
      <div className="overlay-backdrop" data-state="open"/>
      <div className={`dialog ${className}`} role="alertdialog" aria-modal="true">{children}</div>
    </div>
  );
}
function AlertDialogHeader({ children }) { return <div className="dialog__header">{children}</div>; }
function AlertDialogTitle({ children }) { return <h2 className="dialog__title">{children}</h2>; }
function AlertDialogDescription({ children }) { return <p className="dialog__desc">{children}</p>; }
function AlertDialogFooter({ children }) { return <div className="dialog__footer">{children}</div>; }
function AlertDialogCancel({ children, asChild = false }) {
  const ctx = React.useContext(AlertDialogCtx);
  if (asChild) return React.cloneElement(children, { onClick: () => ctx.setOpen(false) });
  return <button className="btn btn--outline" onClick={() => ctx.setOpen(false)}>{children}</button>;
}
function AlertDialogAction({ children, asChild = false, onClick }) {
  const ctx = React.useContext(AlertDialogCtx);
  const handler = () => { onClick?.(); ctx.setOpen(false); };
  if (asChild) return React.cloneElement(children, { onClick: handler });
  return <button className="btn btn--default" onClick={handler}>{children}</button>;
}

// ============== Sheet (side panel) ==============
const Sheet = makeStateProvider(SheetCtx);
function SheetTrigger({ children, asChild = false }) {
  const ctx = React.useContext(SheetCtx);
  if (asChild) return React.cloneElement(children, { onClick: () => ctx.setOpen(true) });
  return <button onClick={() => ctx.setOpen(true)}>{children}</button>;
}
function SheetContent({ children, side = "right", className = "" }) {
  const ctx = React.useContext(SheetCtx);
  if (!ctx.open) return null;
  return (
    <div className="overlay-root">
      <div className="overlay-backdrop" onClick={() => ctx.setOpen(false)} data-state="open"/>
      <div className={`sheet sheet--${side} ${className}`} role="dialog" aria-modal="true" data-state="open">
        <button className="dialog__close" aria-label="Close" onClick={() => ctx.setOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 6 12 12M6 18 18 6"/></svg>
        </button>
        {children}
      </div>
    </div>
  );
}
function SheetHeader({ children }) { return <div className="sheet__header">{children}</div>; }
function SheetTitle({ children }) { return <h2 className="dialog__title">{children}</h2>; }
function SheetDescription({ children }) { return <p className="dialog__desc">{children}</p>; }
function SheetFooter({ children }) { return <div className="sheet__footer">{children}</div>; }

// ============== Drawer (bottom sheet) ==============
const Drawer = makeStateProvider(DrawerCtx);
function DrawerTrigger({ children, asChild = false }) {
  const ctx = React.useContext(DrawerCtx);
  if (asChild) return React.cloneElement(children, { onClick: () => ctx.setOpen(true) });
  return <button onClick={() => ctx.setOpen(true)}>{children}</button>;
}
function DrawerContent({ children, className = "" }) {
  const ctx = React.useContext(DrawerCtx);
  if (!ctx.open) return null;
  return (
    <div className="overlay-root">
      <div className="overlay-backdrop" onClick={() => ctx.setOpen(false)} data-state="open"/>
      <div className={`drawer ${className}`} role="dialog" aria-modal="true">
        <div className="drawer__handle"/>
        {children}
      </div>
    </div>
  );
}
function DrawerHeader({ children }) { return <div className="drawer__header">{children}</div>; }
function DrawerTitle({ children }) { return <h2 className="dialog__title">{children}</h2>; }
function DrawerDescription({ children }) { return <p className="dialog__desc">{children}</p>; }
function DrawerFooter({ children }) { return <div className="drawer__footer">{children}</div>; }

// ============== Popover ==============
const Popover = makeStateProvider(PopoverCtx);
function PopoverTrigger({ children, asChild = false }) {
  const ctx = React.useContext(PopoverCtx);
  if (asChild) return React.cloneElement(children, { onClick: () => ctx.setOpen(!ctx.open) });
  return <button onClick={() => ctx.setOpen(!ctx.open)}>{children}</button>;
}
function PopoverContent({ children, align = "center", className = "" }) {
  const ctx = React.useContext(PopoverCtx);
  const ref = useRefO(null);
  useEffectO(() => {
    function onDoc(e) { if (ctx.open && ref.current && !ref.current.contains(e.target) && !e.target.closest('[data-popover-trigger]')) ctx.setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [ctx.open]);
  if (!ctx.open) return null;
  return <div ref={ref} className={`popover popover--${align} ${className}`} role="dialog">{children}</div>;
}

// ============== Tooltip ==============
function TooltipProvider({ children }) { return children; }
function Tooltip({ children, defaultOpen = false }) {
  const [open, setOpen] = useStateO(defaultOpen);
  return <TooltipCtx.Provider value={{ open, setOpen }}><span className="tooltip-root">{children}</span></TooltipCtx.Provider>;
}
function TooltipTrigger({ children, asChild = false }) {
  const ctx = React.useContext(TooltipCtx);
  const handlers = {
    onMouseEnter: () => ctx.setOpen(true),
    onMouseLeave: () => ctx.setOpen(false),
    onFocus:      () => ctx.setOpen(true),
    onBlur:       () => ctx.setOpen(false),
  };
  if (asChild) return React.cloneElement(children, handlers);
  return <span {...handlers}>{children}</span>;
}
function TooltipContent({ children, side = "top" }) {
  const ctx = React.useContext(TooltipCtx);
  if (!ctx.open) return null;
  return <span className={`tooltip tooltip--${side}`} role="tooltip">{children}</span>;
}

// ============== HoverCard ==============
function HoverCard({ children, defaultOpen = false }) {
  const [open, setOpen] = useStateO(defaultOpen);
  return <HoverCardCtx.Provider value={{ open, setOpen }}><span className="hovercard-root">{children}</span></HoverCardCtx.Provider>;
}
function HoverCardTrigger({ children, asChild = false }) {
  const ctx = React.useContext(HoverCardCtx);
  const handlers = { onMouseEnter: () => ctx.setOpen(true), onMouseLeave: () => ctx.setOpen(false) };
  if (asChild) return React.cloneElement(children, handlers);
  return <span {...handlers}>{children}</span>;
}
function HoverCardContent({ children, className = "" }) {
  const ctx = React.useContext(HoverCardCtx);
  if (!ctx.open) return null;
  return <div className={`hovercard ${className}`}>{children}</div>;
}

// ============== DropdownMenu ==============
const Dropdown = makeStateProvider(DropdownCtx);
function DropdownMenu({ children, defaultOpen = false }) { return <Dropdown defaultOpen={defaultOpen}>{children}</Dropdown>; }
function DropdownMenuTrigger({ children, asChild = false }) {
  const ctx = React.useContext(DropdownCtx);
  if (asChild) return React.cloneElement(children, { onClick: () => ctx.setOpen(!ctx.open), 'data-popover-trigger': true });
  return <button onClick={() => ctx.setOpen(!ctx.open)} data-popover-trigger>{children}</button>;
}
function DropdownMenuContent({ children, align = "end", className = "" }) {
  const ctx = React.useContext(DropdownCtx);
  const ref = useRefO(null);
  useEffectO(() => {
    function onDoc(e) { if (ctx.open && ref.current && !ref.current.contains(e.target) && !e.target.closest('[data-popover-trigger]')) ctx.setOpen(false); }
    function onKey(e) { if (e.key === 'Escape') ctx.setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [ctx.open]);
  if (!ctx.open) return null;
  return <div ref={ref} className={`dropdown dropdown--${align} ${className}`} role="menu">{children}</div>;
}
function DropdownMenuGroup({ children }) { return <div role="group" className="dropdown__group">{children}</div>; }
function DropdownMenuLabel({ children, className = "" }) { return <div className={`dropdown__label ${className}`}>{children}</div>; }
function DropdownMenuItem({ children, onSelect, disabled, variant = "default", className = "" }) {
  const ctx = React.useContext(DropdownCtx);
  function onClick() { if (disabled) return; onSelect?.(); ctx.setOpen(false); }
  return (
    <button type="button" role="menuitem" disabled={disabled} onClick={onClick} data-variant={variant} className={`dropdown__item ${className}`}>
      {children}
    </button>
  );
}
function DropdownMenuSeparator() { return <div role="separator" className="dropdown__sep"/>; }
function DropdownMenuShortcut({ children }) { return <span className="dropdown__kbd">{children}</span>; }

Object.assign(window, {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
  Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter,
  Popover, PopoverTrigger, PopoverContent,
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent,
  HoverCard, HoverCardTrigger, HoverCardContent,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut,
});
