import { styles } from "./styles";

export interface FormSubmitErrorProps {
  message?: string | null;
}

/** Validation / save errors directly above Cancel/Save (host app: `.grs-form-submit-error` in mobile CSS). */
export function FormSubmitError({ message }: FormSubmitErrorProps) {
  if (!message) return null;
  return (
    <div className="grs-form-submit-error" style={styles.errorBox} role="alert">
      {message}
    </div>
  );
}
