/**
 * Shared style tokens. Host apps define the CSS variables
 * (--bg-card, --text-primary, --border, …) so light/dark themes work.
 */
import type { CSSProperties } from "react";

export const styles = {
  // ── Overlays & modals
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, padding: 16,
  } as CSSProperties,

  modal: {
    background: "var(--bg-card)",
    borderRadius: 12, padding: 28,
    width: 480, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  } as CSSProperties,

  modalTitle: {
    margin: "0 0 20px", fontSize: 18, fontWeight: 700,
    color: "var(--text-primary)",
  } as CSSProperties,

  // ── Form fields
  fieldLabel: {
    display: "block", fontSize: 12, fontWeight: 600,
    marginBottom: 4, color: "var(--text-secondary)",
    textTransform: "uppercase" as const, letterSpacing: "0.04em",
    textAlign: "left" as const,
  } as CSSProperties,

  // fontSize 16+: iOS Safari auto-zooms focused controls under 16px
  input: {
    width: "100%", padding: "7px 10px", borderRadius: 6,
    border: "1px solid var(--border)",
    background: "var(--bg-input)", color: "var(--text-primary)",
    fontSize: 16, boxSizing: "border-box" as const, outline: "none",
  } as CSSProperties,

  select: {
    width: "100%", padding: "7px 10px", borderRadius: 6,
    border: "1px solid var(--border)",
    background: "var(--bg-input)", color: "var(--text-primary)",
    fontSize: 16, boxSizing: "border-box" as const, cursor: "pointer",
  } as CSSProperties,

  // ── Buttons
  btnPrimary: {
    padding: "8px 18px", borderRadius: 7,
    background: "var(--link-color)", color: "white",
    border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14,
  } as CSSProperties,

  btnSecondary: {
    padding: "8px 18px", borderRadius: 7,
    border: "1px solid var(--border)", background: "transparent",
    color: "var(--text-secondary)", cursor: "pointer", fontSize: 14,
  } as CSSProperties,

  btnDanger: {
    padding: "4px 10px", borderRadius: 5,
    background: "var(--status-danger-bg)", color: "var(--status-danger-fg)",
    border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
  } as CSSProperties,

  btnIcon: {
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "5px 10px", border: "1px solid var(--border)",
    borderRadius: 6, background: "var(--bg-input)",
    cursor: "pointer", fontSize: "0.8rem",
    color: "var(--text-secondary)", fontWeight: 500,
  } as CSSProperties,

  /** Icon-only View/Edit/Delete in table rows — keep actions column narrow. */
  btnRowAction: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: 26, height: 26, padding: 0, border: "1px solid var(--border)",
    borderRadius: 5, background: "var(--bg-input)",
    cursor: "pointer", color: "var(--text-secondary)", flexShrink: 0,
  } as CSSProperties,

  // ── Tables
  thead: { background: "var(--bg-thead)" } as CSSProperties,

  th: {
    padding: "8px 8px", textAlign: "left" as const,
    fontWeight: 600, fontSize: 13, color: "var(--text-secondary)",
    borderBottom: "2px solid var(--border)",
    whiteSpace: "nowrap" as const,
    overflow: "visible" as const,
    textOverflow: "clip" as const,
  } as CSSProperties,

  td: {
    padding: "7px 8px", textAlign: "left" as const, fontSize: 14, color: "var(--text-primary)",
    borderBottom: "1px solid var(--border)", verticalAlign: "middle" as const,
  } as CSSProperties,

  trEven: { background: "var(--bg-card)" } as CSSProperties,
  trOdd:  { background: "var(--bg-input)" } as CSSProperties,

  // ── Search / filter bar
  searchInput: {
    padding: "7px 12px", border: "1.5px solid var(--border-input)",
    borderRadius: 6, fontSize: 16,
    background: "var(--bg-card)", color: "var(--text-primary)",
    outline: "none", minWidth: 200,
  } as CSSProperties,

  filterSelect: {
    padding: "7px 10px", border: "1.5px solid var(--border-input)",
    borderRadius: 6, fontSize: 16, width: 170, flexShrink: 0,
    background: "var(--bg-card)", color: "var(--text-primary)",
    cursor: "pointer",
  } as CSSProperties,

  // ── Misc
  badge: {
    display: "inline-block", padding: "2px 8px",
    borderRadius: 9999, fontSize: 11, fontWeight: 600,
  } as CSSProperties,

  errorBox: {
    color: "var(--status-danger-fg)", background: "var(--status-danger-bg)",
    border: "1px solid var(--status-danger-fg)", borderRadius: 5,
    padding: "8px 12px", marginBottom: 12, fontSize: "0.85rem",
  } as CSSProperties,

  muted: { color: "var(--text-secondary)", fontSize: 13 } as CSSProperties,
};
