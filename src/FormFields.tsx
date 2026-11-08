import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

/** `field` keeps BNV/Kutir host `.field input` rules; `parivaar-form-field` is the shared hook. */
const FIELD = "field parivaar-form-field";
const CONTROL = "parivaar-ui-form-control";

function fieldClass(mono?: boolean, full?: boolean, extra?: string): string {
  return [
    FIELD,
    mono ? `${FIELD}--mono` : "",
    full ? `${FIELD}--full` : "",
    extra ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

export interface FormSectionProps {
  title: ReactNode;
  children: ReactNode;
  /** Short note under the section title */
  intro?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/** Titled block on Add/Edit forms (e.g. Personal, Bank). */
export function FormSection({ title, children, intro, className, style }: FormSectionProps) {
  return (
    <section className={["form-section", className].filter(Boolean).join(" ")} style={style}>
      <div className="form-section-title">{title}</div>
      {intro ? (
        <p className="parivaar-form-intro" style={{ fontSize: 13, margin: "0 0 12px", color: "var(--text-secondary, var(--text-muted))" }}>
          {intro}
        </p>
      ) : null}
      {children}
    </section>
  );
}

export interface FormGridProps {
  children: ReactNode;
  /** Column count at desktop width. Default 3. */
  columns?: 2 | 3 | 5;
  className?: string;
}

export function FormGrid({ children, columns = 3, className }: FormGridProps) {
  const cols =
    columns === 2
      ? "form-grid cols-2"
      : columns === 5
        ? "form-grid cols-5"
        : "form-grid";
  return <div className={[cols, className].filter(Boolean).join(" ")}>{children}</div>;
}

export function FormValue({ children }: { children: ReactNode }) {
  return <div className="parivaar-form-value">{children}</div>;
}

export interface FormFieldProps {
  label: ReactNode;
  children: ReactNode;
  required?: boolean;
  mono?: boolean;
  /** Span full width of the grid row */
  full?: boolean;
  htmlFor?: string;
  className?: string;
}

/** Label + control slot (text, select, or custom widget). */
export function FormField({
  label,
  children,
  required,
  mono,
  full,
  htmlFor,
  className,
}: FormFieldProps) {
  return (
    <div className={fieldClass(mono, full, className)}>
      <label htmlFor={htmlFor}>
        {label}
        {required ? " *" : null}
      </label>
      {children}
    </div>
  );
}

export type FormTextInputProps = InputHTMLAttributes<HTMLInputElement>;

export function FormTextInput({ className, ...rest }: FormTextInputProps) {
  return <input className={[CONTROL, className].filter(Boolean).join(" ")} {...rest} />;
}

export type FormSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function FormSelect({ className, children, ...rest }: FormSelectProps) {
  return (
    <select className={[CONTROL, className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </select>
  );
}

export type FormTextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FormTextArea({ className, ...rest }: FormTextAreaProps) {
  return <textarea className={[CONTROL, className].filter(Boolean).join(" ")} {...rest} />;
}
