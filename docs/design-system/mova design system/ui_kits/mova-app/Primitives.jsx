// Mova primitives — 1:1 mirror of frontend/src/components/ui/* + Logo.

const { useState } = React;

// ---------- Logo ----------
function Logo({ className = "", style = {} }) {
  return <img src="../../assets/logo.svg" alt="Mova" className={className} style={{ height: 24, display: "block", ...style }} />;
}

// ---------- Button (variants from frontend/src/components/ui/button.tsx) ----------
function Button({ children, variant = "default", className = "", asChild = false, ...rest }) {
  const cls = ["btn", `btn--${variant}`, className].filter(Boolean).join(" ");
  if (asChild) {
    // Slot.Root behavior — clone first child with merged className
    const child = React.Children.only(children);
    return React.cloneElement(child, {
      className: [cls, child.props.className].filter(Boolean).join(" "),
      ...rest,
    });
  }
  return <button className={cls} {...rest}>{children}</button>;
}

// ---------- Card (frontend/src/components/ui/card.tsx) ----------
function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}
function CardHeader({ children, className = "" }) {
  return <div className={`card-header ${className}`}>{children}</div>;
}
function CardTitle({ children, className = "" }) {
  return <div className={`card-title ${className}`}>{children}</div>;
}
function CardContent({ children, className = "" }) {
  return <div className={`card-content ${className}`}>{children}</div>;
}

// ---------- Badge (frontend/src/components/ui/badge.tsx) ----------
function Badge({ children, variant = "default", className = "" }) {
  return <span className={`badge badge--${variant} ${className}`}>{children}</span>;
}

// ---------- Input + Field family ----------
function Input(props) {
  return <input className="input" {...props} />;
}
function FieldGroup({ children }) { return <div className="field-group">{children}</div>; }
function Field({ children }) { return <div className="field">{children}</div>; }
function FieldLabel({ children, htmlFor }) {
  return <label className="field__label" htmlFor={htmlFor}>{children}</label>;
}
function FieldDescription({ children, className = "" }) {
  return <p className={`field-desc ${className}`}>{children}</p>;
}

// ---------- Separator ----------
function Separator() { return <div className="separator"/>; }

Object.assign(window, {
  Logo, Button, Card, CardHeader, CardTitle, CardContent, Badge,
  Input, Field, FieldGroup, FieldLabel, FieldDescription, Separator,
});
