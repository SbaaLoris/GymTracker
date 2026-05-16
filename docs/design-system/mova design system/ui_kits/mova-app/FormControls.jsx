// Mova UI kit — shadcn-faithful Form controls.
// Direct visual+API match to ui.shadcn.com/docs/components/{select,checkbox,switch,radio-group,textarea,toggle-group,slider,input-group}
// Bundled with FieldSet / FieldLegend / FieldError additions on top of Primitives.jsx.

const { useState: useStateF, useRef: useRefF, useEffect: useEffectF, useId: useIdF } = React;

// ============== FieldSet / FieldLegend / FieldError ==============
function FieldSet({ children, className = "" }) { return <fieldset className={`field-set ${className}`}>{children}</fieldset>; }
function FieldLegend({ children, variant = "legend" }) { return <legend className={`field-legend field-legend--${variant}`}>{children}</legend>; }
function FieldError({ children }) { return <div role="alert" className="field-error">{children}</div>; }

// ============== Label ==============
function Label({ children, htmlFor, className = "" }) {
  return <label className={`label ${className}`} htmlFor={htmlFor}>{children}</label>;
}

// ============== Textarea ==============
function Textarea({ className = "", ...rest }) {
  return <textarea className={`textarea ${className}`} {...rest} />;
}

// ============== Checkbox ==============
function Checkbox({ checked, onCheckedChange, disabled, id, "aria-invalid": invalid }) {
  function toggle() { if (!disabled) onCheckedChange?.(!checked); }
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={!!checked}
      aria-invalid={invalid}
      disabled={disabled}
      id={id}
      onClick={toggle}
      data-state={checked ? "checked" : "unchecked"}
      className="checkbox"
    >
      {checked && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
      )}
    </button>
  );
}

// ============== Switch ==============
function Switch({ checked, onCheckedChange, disabled, id }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!checked}
      data-state={checked ? "checked" : "unchecked"}
      disabled={disabled}
      id={id}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      className="switch"
    >
      <span className="switch-thumb"/>
    </button>
  );
}

// ============== RadioGroup ==============
const RadioCtx = React.createContext(null);
function RadioGroup({ value, onValueChange, children, className = "" }) {
  return (
    <RadioCtx.Provider value={{ value, onValueChange }}>
      <div role="radiogroup" className={`radio-group ${className}`} data-slot="radio-group">{children}</div>
    </RadioCtx.Provider>
  );
}
function RadioGroupItem({ value, id, disabled }) {
  const ctx = React.useContext(RadioCtx);
  const selected = ctx.value === value;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      data-state={selected ? "checked" : "unchecked"}
      disabled={disabled}
      id={id}
      onClick={() => !disabled && ctx.onValueChange?.(value)}
      className="radio"
    >
      {selected && <span className="radio-dot"/>}
    </button>
  );
}

// ============== ToggleGroup (segmented) ==============
const ToggleCtx = React.createContext(null);
function ToggleGroup({ type = "single", value, onValueChange, children, variant = "default", size = "default", className = "" }) {
  return (
    <ToggleCtx.Provider value={{ type, value, onValueChange, variant, size }}>
      <div role={type === "single" ? "radiogroup" : "group"} className={`toggle-group toggle-group--${variant} toggle-group--${size} ${className}`}>{children}</div>
    </ToggleCtx.Provider>
  );
}
function ToggleGroupItem({ value, children, "aria-label": ariaLabel, disabled }) {
  const ctx = React.useContext(ToggleCtx);
  const active = ctx.type === "single" ? ctx.value === value : Array.isArray(ctx.value) && ctx.value.includes(value);
  function onClick() {
    if (disabled) return;
    if (ctx.type === "single") ctx.onValueChange?.(active ? "" : value);
    else {
      const arr = Array.isArray(ctx.value) ? ctx.value : [];
      ctx.onValueChange?.(active ? arr.filter(v => v !== value) : [...arr, value]);
    }
  }
  return (
    <button
      type="button"
      role={ctx.type === "single" ? "radio" : "checkbox"}
      aria-checked={active}
      aria-label={ariaLabel}
      data-state={active ? "on" : "off"}
      disabled={disabled}
      onClick={onClick}
      className="toggle-group__item"
    >
      {children}
    </button>
  );
}

// ============== Slider ==============
function Slider({ value = [50], onValueChange, min = 0, max = 100, step = 1, className = "" }) {
  const v = Array.isArray(value) ? value[0] : value;
  const pct = ((v - min) / (max - min)) * 100;
  const ref = useRefF(null);
  const dragging = useRefF(false);

  function setFromClient(clientX) {
    const r = ref.current.getBoundingClientRect();
    let p = (clientX - r.left) / r.width;
    p = Math.max(0, Math.min(1, p));
    const raw = min + p * (max - min);
    const snapped = Math.round(raw / step) * step;
    onValueChange?.([snapped]);
  }
  function onPointerDown(e) {
    dragging.current = true;
    ref.current.setPointerCapture?.(e.pointerId);
    setFromClient(e.clientX);
  }
  function onPointerMove(e) { if (dragging.current) setFromClient(e.clientX); }
  function onPointerUp(e) { dragging.current = false; ref.current.releasePointerCapture?.(e.pointerId); }

  return (
    <div
      ref={ref}
      className={`slider ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className="slider__track">
        <div className="slider__range" style={{ width: `${pct}%` }}/>
      </div>
      <div className="slider__thumb" style={{ left: `${pct}%` }} role="slider"
        aria-valuenow={v} aria-valuemin={min} aria-valuemax={max} tabIndex={0}/>
    </div>
  );
}

// ============== Select (custom dropdown — no portal, just an absolute panel) ==============
const SelectCtx = React.createContext(null);

function Select({ value, onValueChange, children, defaultOpen = false }) {
  const [open, setOpen] = useStateF(defaultOpen);
  const ref = useRefF(null);
  useEffectF(() => {
    function onDoc(e) { if (open && ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  return (
    <SelectCtx.Provider value={{ value, setValue: (v) => { onValueChange?.(v); setOpen(false); }, open, setOpen }}>
      <div className="select" ref={ref} data-state={open ? "open" : "closed"}>{children}</div>
    </SelectCtx.Provider>
  );
}
function SelectTrigger({ children, className = "", "aria-invalid": invalid }) {
  const ctx = React.useContext(SelectCtx);
  return (
    <button
      type="button"
      role="combobox"
      aria-expanded={ctx.open}
      aria-invalid={invalid}
      data-state={ctx.open ? "open" : "closed"}
      onClick={() => ctx.setOpen(!ctx.open)}
      className={`select-trigger ${className}`}
    >
      {children}
      <svg className="select-trigger__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </button>
  );
}
function SelectValue({ placeholder, children }) {
  const ctx = React.useContext(SelectCtx);
  const display = children ?? ctx.value ?? <span className="select-placeholder">{placeholder}</span>;
  return <span className="select-value">{display}</span>;
}
function SelectContent({ children, className = "" }) {
  const ctx = React.useContext(SelectCtx);
  if (!ctx.open) return null;
  return <div className={`select-content ${className}`} role="listbox">{children}</div>;
}
function SelectGroup({ children }) {
  return <div role="group" className="select-group">{children}</div>;
}
function SelectLabel({ children }) {
  return <div className="select-label">{children}</div>;
}
function SelectItem({ value, children, disabled }) {
  const ctx = React.useContext(SelectCtx);
  const selected = ctx.value === value;
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      data-state={selected ? "checked" : "unchecked"}
      disabled={disabled}
      onClick={() => ctx.setValue(value)}
      className="select-item"
    >
      <span className="select-item__check">
        {selected && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        )}
      </span>
      <span className="select-item__label">{children}</span>
    </button>
  );
}
function SelectSeparator() { return <div role="separator" className="select-sep"/>; }

// ============== InputGroup ==============
function InputGroup({ children, className = "" }) { return <div className={`input-group ${className}`} data-slot="input-group">{children}</div>; }
function InputGroupAddon({ children, align = "inline-start" }) {
  return <div className="input-group__addon" data-align={align}>{children}</div>;
}
function InputGroupInput(props) { return <input className="input-group__input" {...props} />; }
function InputGroupTextarea(props) { return <textarea className="input-group__textarea" rows={3} {...props} />; }

Object.assign(window, {
  FieldSet, FieldLegend, FieldError, Label, Textarea,
  Checkbox, Switch,
  RadioGroup, RadioGroupItem,
  ToggleGroup, ToggleGroupItem,
  Slider,
  Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectSeparator,
  InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea,
});
