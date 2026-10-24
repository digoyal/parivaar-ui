import type { CSSProperties, ReactNode } from "react";
import { styles } from "./styles";

export interface ConfirmDialogProps {
  /** When false, renders nothing. Omit (or true) when the parent gates with `&&`. */
  open?: boolean;
  title?: ReactNode;
  message: ReactNode;
  /** Secondary line under the message (warning / consequence). */
  detail?: ReactNode;
  /** Use danger color for `detail` (default false → muted). */
  detailDanger?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Danger styling on the confirm button (default true). */
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  width?: number | string;
}

/**
 * In-app confirm overlay (replaces browser `confirm()` for deletes, etc.).
 */
export function ConfirmDialog({
  open = true,
  title,
  message,
  detail,
  detailDanger = false,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  danger = true,
  busy = false,
  onConfirm,
  onCancel,
  width = 340,
}: ConfirmDialogProps) {
  if (!open) return null;

  const confirmStyle: CSSProperties = danger
    ? { ...styles.btnPrimary, background: "var(--status-danger-fg)" }
    : styles.btnPrimary;

  return (
    <div style={styles.overlay} role="dialog" aria-modal="true">
      <div style={{ ...styles.modal, width }}>
        {title != null && title !== "" && (
          <h3 style={styles.modalTitle}>{title}</h3>
        )}
        <p style={{ margin: "0 0 16px", color: "var(--text-primary)", fontSize: "0.9rem" }}>
          {message}
          {detail != null && detail !== "" && (
            <span
              style={{
                display: "block",
                marginTop: 6,
                color: detailDanger ? "var(--status-danger-fg)" : "var(--text-secondary)",
                fontSize: "0.8rem",
              }}
            >
              {detail}
            </span>
          )}
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button type="button" onClick={onCancel} style={styles.btnSecondary} disabled={busy}>
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} style={confirmStyle} disabled={busy}>
            {busy ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
