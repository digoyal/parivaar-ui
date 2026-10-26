import { useState, useMemo } from "react";
import { styles } from "./styles";
import { RowActions } from "./RowActions";

/** Fits three 26px row-action buttons + gaps + cell padding (border-box). */
const ACTIONS_COL_PX = 92;

// ── Types ──────────────────────────────────────────────────────────────────

export interface Col<T> {
  key: string;
  label: string;
  sortable?: boolean;
  /** How to render the cell. Defaults to String(row[key]). */
  render?: (row: T, index: number) => React.ReactNode;
  /** Value used for CSV export. Defaults to String(row[key as keyof T] ?? ""). */
  csvValue?: (row: T) => string;
  /** Sort value for computed columns (e.g. labels looked up from a map). Falls back to row[key]. */
  sortValue?: (row: T) => string | number;
  /** Extra td style overrides. */
  tdStyle?: React.CSSProperties;
}

interface TableProps<T> {
  title: string;
  subtitle?: string;
  columns: Col<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFn?: (row: T, q: string) => boolean;
  /** Controlled search value — bypasses internal state; pair with onExternalSearch. */
  externalSearch?: string;
  /** Called when the user types in the search box (controlled mode). */
  onExternalSearch?: (q: string) => void;
  /** Extra filter controls rendered beside the search box. */
  filters?: React.ReactNode;
  /** Filename for CSV export (without .csv). Omit to hide export button. */
  exportFilename?: string;
  /** Title shown in the print window. Omit to hide print button. */
  printTitle?: string;
  /** Extra controls rendered in the header after print, before the add button. */
  headerExtra?: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  /** Row-level view/edit/delete callbacks. When provided, a sticky actions column is added. */
  actions?: (row: T, idx: number) => { onView?: () => void; onEdit?: () => void; onDelete?: () => void; };
  /** Server-side pagination. When provided, replaces row-count footer with page controls. */
  pagination?: { page: number; pageSize: number; total: number; onPageChange: (p: number) => void };
  /**
   * Override total shown at the top (e.g. API grand total). Defaults to
   * pagination.total when paged, else filtered/sorted row count.
   */
  totalCount?: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const SortIcon = ({ dir }: { dir: "asc" | "desc" | null }) => (
  <span style={{ marginLeft: 4, opacity: dir ? 1 : 0.3, fontSize: 10 }}>
    {dir === "desc" ? "▼" : "▲"}
  </span>
);

function csvEscape(v: string) { return `"${v.replace(/"/g, '""')}"`; }

// ── Icons ──────────────────────────────────────────────────────────────────

const IconDownload = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const IconPrint = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 6 2 18 2 18 9"/>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
    <rect x="6" y="14" width="12" height="8"/>
  </svg>
);

// ── Component ──────────────────────────────────────────────────────────────

export function Table<T extends object>({
  title, subtitle,
  columns, data, rowKey,
  isLoading, emptyMessage = "No records found.",
  searchable, searchPlaceholder = "Search…", searchFn, externalSearch, onExternalSearch,
  filters, exportFilename, printTitle,
  onAdd, addLabel = "+ Add", headerExtra,
  actions,
  pagination,
  totalCount,
}: TableProps<T>) {

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // ── Filter (externalSearch = server-side; skip client filtering)
  const activeQuery = externalSearch !== undefined ? externalSearch : query;
  const filtered = useMemo(() => {
    // When externally controlled, data is already filtered server-side
    if (externalSearch !== undefined) return data;
    if (!searchable || !activeQuery.trim()) return data;
    const q = activeQuery.trim().toLowerCase();
    if (searchFn) return data.filter(r => searchFn(r, q));
    return data.filter(r =>
      Object.values(r as Record<string, unknown>).some(v =>
        (typeof v === "string" && v.toLowerCase().includes(q)) ||
        (typeof v === "number" && String(v).includes(q))
      )
    );
  }, [data, query, externalSearch, activeQuery, searchable, searchFn]);

  // ── Sort
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find(c => c.key === sortKey);
    return [...filtered].sort((a, b) => {
      const av = col?.sortValue ? col.sortValue(a) : (a as Record<string, unknown>)[sortKey];
      const bv = col?.sortValue ? col.sortValue(b) : (b as Record<string, unknown>)[sortKey];
      const cmp = typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av ?? "").localeCompare(String(bv ?? ""));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir, columns]);

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  // ── Export CSV
  function exportCsv() {
    const headers = columns.map(c => csvEscape(c.label));
    const rows = sorted.map(row =>
      columns.map(c =>
        c.csvValue
          ? csvEscape(c.csvValue(row))
          : csvEscape(String((row as Record<string, unknown>)[c.key] ?? ""))
      )
    );
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = (exportFilename ?? "export") + ".csv";
    a.click();
  }

  // ── Print
  function doPrint() {
    const w = window.open("", "_blank")!;
    const thStyle = "border:1px solid #ccc;padding:6px 10px;font-size:12px;background:#eef2fb;text-align:left;font-weight:600";
    const tdStyle = "border:1px solid #e5e7eb;padding:6px 10px;font-size:12px";
    const ths = columns.map(c => `<th style="${thStyle}">${c.label}</th>`).join("");
    const trs = sorted.map((row, i) =>
      `<tr style="background:${i % 2 === 0 ? "#ffffff" : "#f9fafb"}">` +
      columns.map(c => {
        const val = c.csvValue
          ? c.csvValue(row)
          : String((row as Record<string, unknown>)[c.key] ?? "");
        return `<td style="${tdStyle}">${val}</td>`;
      }).join("") + "</tr>"
    ).join("");
    w.document.write(
      `<html><head><title>${printTitle ?? title}</title></head><body style="font-family:sans-serif;padding:20px">` +
      `<h2 style="margin:0 0 16px">${printTitle ?? title}</h2>` +
      `<table style="border-collapse:collapse;width:100%">` +
      `<thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>` +
      `<p style="color:#6b7280;font-size:12px;margin-top:12px">${sorted.length} records</p>` +
      `</body></html>`
    );
    w.document.close(); w.focus(); w.print();
  }

  const hasSearch = searchable || filters;

  // Top total: prefer explicit / API pagination total; else filtered view length.
  const displayTotal =
    totalCount ??
    pagination?.total ??
    (isLoading ? null : sorted.length);
  const showFilteredHint =
    !pagination &&
    totalCount == null &&
    !isLoading &&
    data.length !== sorted.length;
  const totalLabel =
    displayTotal == null
      ? null
      : `${displayTotal.toLocaleString("en-IN")} ${displayTotal === 1 ? "row" : "rows"}`;

  return (
    <div>
      {/* ── Page header: Title + row total + Export + Print + Add ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>{title}</h1>
            {totalLabel && (
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: "2px 8px",
                  whiteSpace: "nowrap",
                }}
                title={showFilteredHint ? `${sorted.length} matching of ${data.length} loaded` : undefined}
              >
                {totalLabel}
                {showFilteredHint ? ` of ${data.length.toLocaleString("en-IN")}` : ""}
              </span>
            )}
          </div>
          {subtitle && <p style={{ margin: "4px 0 0", ...styles.muted }}>{subtitle}</p>}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          {exportFilename && (
            <button onClick={exportCsv} style={styles.btnIcon} title="Export CSV">
              <IconDownload />
            </button>
          )}
          {printTitle !== undefined && (
            <button onClick={doPrint} style={styles.btnIcon} title="Print">
              <IconPrint />
            </button>
          )}
          {headerExtra}
          {onAdd && (
            <button onClick={onAdd} style={styles.btnPrimary}>{addLabel}</button>
          )}
        </div>
      </div>

      {/* ── Search + filter bar (bordered container) ── */}
      {hasSearch && (
        <div style={{
          display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center",
          marginBottom: 16,
        }}>
          {searchable && (
            <input
              placeholder={searchPlaceholder}
              value={onExternalSearch ? (externalSearch ?? "") : query}
              onChange={e => onExternalSearch ? onExternalSearch(e.target.value) : setQuery(e.target.value)}
              style={styles.searchInput}
            />
          )}
          {filters}
        </div>
      )}

      {/* ── Table ── */}
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        overflow: "hidden",
      }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: "center", ...styles.muted }}>Loading…</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            {/* auto layout + nowrap headers: columns size to labels (no “Statu:”); actions stay narrow */}
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto" }}>
              <thead>
                <tr>
                  {columns.map(col => (
                    <th
                      key={col.key}
                      className="ui-thead-th grs-thead-th"
                      style={{
                        ...styles.th,
                        cursor: col.sortable ? "pointer" : "default",
                        userSelect: "none",
                      }}
                      onClick={() => col.sortable && toggleSort(col.key)}
                    >
                      {col.label}
                      {col.sortable && <SortIcon dir={sortKey === col.key ? sortDir : null} />}
                    </th>
                  ))}
                  {actions && (
                    <th style={{
                      ...styles.th,
                      width: ACTIONS_COL_PX,
                      minWidth: ACTIONS_COL_PX,
                      maxWidth: ACTIONS_COL_PX,
                      padding: "8px 6px",
                      textAlign: "right",
                      position: "sticky",
                      right: 0,
                      background: "var(--bg-thead)",
                      zIndex: 1,
                    }} />
                  )}
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + (actions ? 1 : 0)}
                        style={{ ...styles.td, padding: 40, textAlign: "center", color: "var(--text-secondary)" }}>
                      {emptyMessage}
                    </td>
                  </tr>
                ) : sorted.map((row, idx) => (
                  <tr
                    key={rowKey(row)}
                    style={{ background: idx % 2 === 0 ? "var(--bg-card)" : "var(--bg-input)" }}
                  >
                    {columns.map(col => (
                      <td key={col.key} style={{ ...styles.td, ...col.tdStyle }}>
                        {col.render
                          ? col.render(row, idx)
                          : String((row as Record<string, unknown>)[col.key] ?? "—")}
                      </td>
                    ))}
                    {actions && (
                      <td style={{
                        ...styles.td,
                        textAlign: "right",
                        width: ACTIONS_COL_PX,
                        minWidth: ACTIONS_COL_PX,
                        maxWidth: ACTIONS_COL_PX,
                        padding: "6px 6px",
                        position: "sticky",
                        right: 0,
                        background: idx % 2 === 0 ? "var(--bg-card)" : "var(--bg-input)",
                        borderLeft: "1px solid var(--border)",
                        overflow: "hidden",
                      }}>
                        <RowActions {...actions(row, idx)} />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination bar / row count ── */}
      {pagination ? (
        (() => {
          const { page, pageSize, total, onPageChange } = pagination;
          const totalPages = Math.max(1, Math.ceil(total / pageSize));
          const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
          const to   = Math.min(page * pageSize, total);
          return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, gap: 8 }}>
              <span style={styles.muted}>{total === 0 ? "No records" : `${from}–${to} of ${total}`}</span>
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  onClick={() => onPageChange(1)}
                  disabled={page <= 1}
                  style={pageBtnStyle(page <= 1)}
                  title="First page"
                >«</button>
                <button
                  onClick={() => onPageChange(page - 1)}
                  disabled={page <= 1}
                  style={pageBtnStyle(page <= 1)}
                >‹ Prev</button>
                <span style={{ padding: "4px 10px", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= totalPages}
                  style={pageBtnStyle(page >= totalPages)}
                >Next ›</button>
                <button
                  onClick={() => onPageChange(totalPages)}
                  disabled={page >= totalPages}
                  style={pageBtnStyle(page >= totalPages)}
                  title="Last page"
                >»</button>
              </div>
            </div>
          );
        })()
      ) : null}
    </div>
  );
}

/** @deprecated Use `Table` instead. */
export const GrsTable = Table;

/** Compact “N rows” chip for hand-rolled tables (Lookups, reports, etc.). */
export function RowCountBadge({
  count,
  style,
}: {
  count: number;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        fontSize: "0.8125rem",
        fontWeight: 600,
        color: "var(--text-secondary)",
        background: "var(--bg-input)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        padding: "2px 8px",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {count.toLocaleString("en-IN")} {count === 1 ? "row" : "rows"}
    </span>
  );
}

function pageBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: "4px 10px",
    fontSize: "0.8125rem",
    border: "1px solid var(--border)",
    borderRadius: 6,
    background: "var(--bg-card)",
    color: disabled ? "var(--text-secondary)" : "var(--text-primary)",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.45 : 1,
  };
}
