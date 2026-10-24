import type { CSSProperties, ReactNode } from "react";
import { styles } from "./styles";

export interface GrsModalProps {
  title?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  width?: number | string;
  /** Extra styles on the modal card (beyond width). */
  style?: CSSProperties;
  /** Show a top-right close control (default false — most forms use Cancel). */
  showClose?: boolean;
}

/**
 * Shared overlay + card shell for add/edit/confirm-style modals.
 * Product form fields stay in the host app as `children`.
 */
export function GrsModal({
  title,
  onClose,
  children,
  width,
  style,
  showClose = false,
}: GrsModalProps) {
  const hasTitle = title != null && title !== "";

  return (
    <div style={styles.overlay} role="dialog" aria-modal="true">
      <div style={{ ...styles.modal, ...(width != null ? { width } : null), ...style }}>
        {hasTitle && !showClose && <h3 style={styles.modalTitle}>{title}</h3>}
        {hasTitle && showClose && (
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <h3 style={{ ...styles.modalTitle, flex: 1 }}>{title}</h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{ ...styles.btnSecondary, padding: "4px 10px", lineHeight: 1, flexShrink: 0 }}
            >
              ×
            </button>
          </div>
        )}
        {!hasTitle && showClose && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{ ...styles.btnSecondary, padding: "4px 10px", lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
