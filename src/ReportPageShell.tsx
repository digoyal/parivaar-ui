import type { CSSProperties, ReactNode } from "react";
import { ReportFiltersBar } from "./ReportFiltersBar";

const hintStyle: CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: "0.875rem",
};

const emptyStyle: CSSProperties = {
  ...hintStyle,
  padding: "32px 0",
  textAlign: "center",
};

export interface ReportPageShellProps {
  /** Rendered as `<h2>` when `header` is omitted. */
  title?: ReactNode;
  /** Custom title row (overrides `title` / `exportActions`). */
  header?: ReactNode;
  /** Filter fields; wrapped in collapsible `ReportFiltersBar` on mobile. */
  filters?: ReactNode;
  activeFilterCount?: number;
  /** Icons/buttons beside the title (export, print). */
  exportActions?: ReactNode;
  /** Row above body (e.g. row count badge). Shown only when body content renders. */
  toolbar?: ReactNode;
  isLoading?: boolean;
  loadingMessage?: ReactNode;
  error?: ReactNode;
  isEmpty?: boolean;
  emptyMessage?: ReactNode;
  children?: ReactNode;
  /**
   * When false, omits outer `grs-page` padding — use inside tabbed shells (e.g. Summary Reports).
   * Default true for standalone report routes.
   */
  wrapPage?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Shared report page chrome: title, optional filters, loading/empty/error, table body.
 * Data fetching and table markup stay in the host page.
 */
export function ReportPageShell({
  title,
  header,
  filters,
  activeFilterCount = 0,
  exportActions,
  toolbar,
  isLoading = false,
  loadingMessage = "Loading…",
  error,
  isEmpty = false,
  emptyMessage = "No data.",
  children,
  wrapPage = true,
  className,
  style,
}: ReportPageShellProps) {
  const outerClass = [
    wrapPage ? "grs-page" : "grs-report-shell",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const pageStyle: CSSProperties = {
    maxWidth: "100%",
    width: "100%",
    boxSizing: "border-box",
    minWidth: 0,
    ...(wrapPage ? { padding: "24px 28px" } : {}),
    ...style,
  };

  const titleRow =
    header ??
    (title != null ? (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0, color: "var(--text-primary)", minWidth: 0 }}>{title}</h2>
        {exportActions ? (
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            {exportActions}
          </div>
        ) : null}
      </div>
    ) : null);

  let body: ReactNode;
  if (error != null && error !== "") {
    body =
      typeof error === "string" ? (
        <p style={{ color: "var(--status-danger-fg)" }}>{error}</p>
      ) : (
        error
      );
  } else if (isLoading) {
    body = <p style={hintStyle}>{loadingMessage}</p>;
  } else if (isEmpty) {
    body =
      typeof emptyMessage === "string" ? (
        <p style={emptyStyle}>{emptyMessage}</p>
      ) : (
        emptyMessage
      );
  } else {
    body = (
      <>
        {toolbar}
        {children}
      </>
    );
  }

  return (
    <div className={outerClass} style={pageStyle}>
      {titleRow}
      {filters ? (
        <ReportFiltersBar activeFilterCount={activeFilterCount}>{filters}</ReportFiltersBar>
      ) : null}
      {body}
    </div>
  );
}
