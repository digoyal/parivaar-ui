import type { CSSProperties, ReactNode } from "react";
import { FormSubmitError } from "./FormSubmitError";
import { styles } from "./styles";

export interface FormPageActionsProps {
  error?: string | null;
  saving?: boolean;
  saveLabel: string;
  cancelLabel?: string;
  onSave: () => void;
  onCancel: () => void;
  extraActions?: ReactNode;
  /** Secondary buttons between Cancel and primary Save (e.g. visit “Save for offline”). */
  secondaryActions?: ReactNode;
  saveDisabled?: boolean;
  actionsClassName?: string;
  actionsStyle?: CSSProperties;
}

/** Error banner + Cancel/Save row for Add/Edit entity pages. */
export function FormPageActions({
  error,
  saving = false,
  saveLabel,
  cancelLabel = "Cancel",
  onSave,
  onCancel,
  extraActions,
  secondaryActions,
  saveDisabled = false,
  actionsClassName = "grs-form-actions",
  actionsStyle,
}: FormPageActionsProps) {
  return (
    <>
      <FormSubmitError message={error} />
      <div
        className={actionsClassName}
        style={{
          display: "flex",
          gap: 10,
          marginTop: 12,
          justifyContent: "flex-end",
          ...actionsStyle,
        }}
      >
        {extraActions ? <div style={{ marginRight: "auto" }}>{extraActions}</div> : null}
        <button type="button" style={styles.btnSecondary} onClick={onCancel} disabled={saving}>
          {cancelLabel}
        </button>
        {secondaryActions}
        <button
          type="button"
          style={styles.btnPrimary}
          disabled={saving || saveDisabled}
          onClick={onSave}
        >
          {saving ? "Saving…" : saveLabel}
        </button>
      </div>
    </>
  );
}

export interface FormPageShellProps extends Omit<FormPageActionsProps, "saveLabel" | "onSave" | "onCancel"> {
  header?: ReactNode;
  children: ReactNode;
  /** When false, omits the footer (e.g. Detail view mode). Default true. */
  showActions?: boolean;
  /** Outer page wrapper (host apps use `grs-page` + mobile padding). */
  className?: string;
  style?: CSSProperties;
  saveLabel?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

/**
 * Shared Add/Edit page chrome: optional header slot, entity fields, submit error + actions.
 * Field layout and validation stay in the host page / entity form.
 */
export function FormPageShell({
  header,
  children,
  showActions = true,
  className = "grs-page",
  style,
  ...actions
}: FormPageShellProps) {
  const pageStyle: CSSProperties = {
    maxWidth: 600,
    width: "100%",
    boxSizing: "border-box",
    padding: "16px 20px",
    ...style,
  };

  return (
    <div className={className} style={pageStyle}>
      {header}
      {children}
      {showActions && actions.saveLabel && actions.onSave && actions.onCancel ? (
        <FormPageActions
          {...actions}
          saveLabel={actions.saveLabel}
          onSave={actions.onSave}
          onCancel={actions.onCancel}
        />
      ) : null}
    </div>
  );
}
