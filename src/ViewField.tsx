/**
 * Shared entity view-mode primitives.
 * Host apps define CSS vars (--bg-input, --text-primary, --link-color, …).
 */
import type { CSSProperties, ReactNode } from "react";
import { styles } from "./styles";

/** Style tokens for view-mode labels, values, and section titles. */
export const viewStyles = {
  /**
   * Bold primary label (no chip). Muted secondary + 12px uppercase made
   * fontWeight 700 nearly invisible next to darker/larger primary values;
   * host apps often set font-synthesis:none so faux-bold does not help.
   */
  label: {
    ...styles.fieldLabel,
    color: "var(--text-primary)",
    fontWeight: 700,
  } as CSSProperties,

  /** Regular-weight primary text for read-only values. */
  value: {
    fontSize: 14,
    fontWeight: 400,
    color: "var(--text-primary)",
    padding: "7px 0",
  } as CSSProperties,

  /** Blue section title at the same size as field labels (12). */
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.07em",
    color: "var(--link-color)",
    marginBottom: 8,
  } as CSSProperties,

  /** Card shell for a titled group of view fields. */
  section: {
    background: "var(--bg-card)",
    borderRadius: 8,
    padding: "10px 14px",
    marginBottom: 8,
  } as CSSProperties,
};

export interface ViewFieldProps {
  label: ReactNode;
  children?: ReactNode;
  /** Shown when children is null/undefined/"". Default "—". */
  empty?: ReactNode;
  style?: CSSProperties;
  labelStyle?: CSSProperties;
  valueStyle?: CSSProperties;
}

/** One bold label + regular-weight value for entity view mode. */
export function ViewField({
  label,
  children,
  empty = "—",
  style,
  labelStyle,
  valueStyle,
}: ViewFieldProps) {
  const blank =
    children === null || children === undefined || children === "";
  return (
    <div style={style}>
      <label style={{ ...viewStyles.label, ...labelStyle }}>{label}</label>
      <div style={{ ...viewStyles.value, ...valueStyle }}>
        {blank ? empty : children}
      </div>
    </div>
  );
}

export interface ViewSectionProps {
  title?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
  titleStyle?: CSSProperties;
}

/** Card section with optional blue title for entity view mode. */
export function ViewSection({
  title,
  children,
  style,
  titleStyle,
}: ViewSectionProps) {
  return (
    <section style={{ ...viewStyles.section, ...style }}>
      {title != null && title !== false && (
        <div style={{ ...viewStyles.sectionTitle, ...titleStyle }}>{title}</div>
      )}
      {children}
    </section>
  );
}
