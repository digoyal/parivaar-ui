import type { CSSProperties } from "react";
import { styles } from "./styles";

interface RowActionsProps {
  onView?:   () => void;
  onEdit?:   () => void;
  onDelete?: () => void;
  /** Inline edit: compact text buttons in the Actions row (match icon button footprint). */
  onSave?:   () => void;
  onCancel?: () => void;
}

const IconEye = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

/** Icon row actions are 26px tall; inline Save/Cancel use ~34px min touch height without full-width stacking. */
const INLINE_EDIT_MIN_TOUCH_PX = 34;

const inlineEditBtnBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  minHeight: INLINE_EDIT_MIN_TOUCH_PX,
  minWidth: INLINE_EDIT_MIN_TOUCH_PX,
  padding: "0 8px",
  borderRadius: 5,
  fontSize: 12,
  fontWeight: 600,
  whiteSpace: "nowrap",
  cursor: "pointer",
  flexShrink: 0,
};

const inlineEditBtnPrimary: CSSProperties = {
  ...inlineEditBtnBase,
  background: "var(--link-color)",
  color: "white",
  border: "none",
};

const inlineEditBtnGhost: CSSProperties = {
  ...inlineEditBtnBase,
  background: "var(--bg-input)",
  color: "var(--text-secondary)",
  border: "1px solid var(--border)",
};

/** Compact View / Edit / Delete for table rows (sticky actions column). */
export function RowActions({ onView, onEdit, onDelete, onSave, onCancel }: RowActionsProps) {
  const inlineEdit = onSave != null || onCancel != null;
  return (
    <div
      style={{
        display: "flex",
        gap: inlineEdit ? 4 : 2,
        justifyContent: "flex-end",
        flexWrap: "nowrap",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      {onSave && (
        <button type="button" onClick={onSave} title="Save" style={inlineEditBtnPrimary}>
          Save
        </button>
      )}
      {onCancel && (
        <button type="button" onClick={onCancel} title="Cancel" style={inlineEditBtnGhost}>
          Cancel
        </button>
      )}
      {onView && (
        <button type="button" onClick={onView} title="View" style={styles.btnRowAction}>
          <IconEye />
        </button>
      )}
      {onEdit && (
        <button type="button" onClick={onEdit} title="Edit" style={styles.btnRowAction}>
          <IconEdit />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          title="Delete"
          style={{ ...styles.btnRowAction, color: "var(--color-danger, #e53e3e)" }}
        >
          <IconTrash />
        </button>
      )}
    </div>
  );
}
