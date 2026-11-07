import type { CSSProperties, ReactNode } from "react";
import { Table, type Col } from "./Table";

/** Passed to `editCell` so rows can branch without closing over `editingId`. */
export interface LookupInlineEditControls {
  isEditing: boolean;
}

/**
 * Column definition for admin lookup lists with optional inline edit.
 * When `editCell` is set, the shared table applies non-ellipsis td styles on the
 * active edit row for that column (see `undoControlCellClipStyle`).
 */
export interface LookupInlineColumnDef<T> {
  key: string;
  header: string;
  sortable?: boolean;
  nowrap?: boolean;
  wrap?: boolean;
  minWidth?: number | string;
  csvValue?: (row: T) => string;
  sortValue?: (row: T) => string | number;
  /** Display / read-only cell (always used when the row is not being edited). */
  cell: (row: T, index: number) => ReactNode;
  /**
   * Inline editor for this column. When present and `editingId` matches the row,
   * `editCell` is rendered instead of `cell`, and the td omits list-hub ellipsis clipping.
   */
  editCell?: (row: T, controls: LookupInlineEditControls) => ReactNode;
}

/**
 * Apps often set this on name columns (e.g. BNV `LOOKUP_INLINE_EDIT_NAME_MIN_WIDTH`).
 * Edit `<td>` styles do **not** apply a floor — they inherit the same `minWidth` as read mode
 * from {@link Table}'s `colTextCellStyle` merge unless the column sets `minWidth` explicitly.
 */
export const LOOKUP_INLINE_EDIT_CELL_MIN_WIDTH = "12rem";

/**
 * Undo `colTextCellStyle` ellipsis clipping so inputs are usable while editing.
 * Do **not** add a larger `minWidth` than read mode (e.g. no `48ch` floor); that caused
 * columns to jump wider on edit. Width stays from `Col.minWidth` + Table defaults.
 */
const editCellUnclipStyle: CSSProperties = {
  overflow: "visible",
  textOverflow: "clip",
  whiteSpace: "normal",
  maxWidth: "none",
};

function editCellTdStyle(colMinWidth: LookupInlineColumnDef<unknown>["minWidth"]): CSSProperties {
  const colMin =
    colMinWidth == null ? null : typeof colMinWidth === "number" ? `${colMinWidth}px` : String(colMinWidth);
  return {
    ...editCellUnclipStyle,
    // Explicit column minWidth only (codes, names); otherwise omit so merge matches read `<td>`.
    ...(colMin ? { minWidth: colMin } : {}),
  };
}

export interface LookupInlineTableProps<T extends object> {
  title: string;
  subtitle?: string;
  columns: LookupInlineColumnDef<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  /** Which row is in inline edit (`null` if none). Compared via `rowKey(row)`. */
  editingId: string | number | null;
  isLoading?: boolean;
  emptyMessage?: string;
  shellFullWidth?: boolean;
  /** Kutir-style compact card (default on for lookup inline lists). */
  compactTableShell?: boolean;
  exportFilename?: string;
  printTitle?: string;
  actions?: (row: T, idx: number) => {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };
}

/**
 * Thin wrapper around {@link Table} for lookup-style inline edit lists.
 * Columns with `editCell` automatically lose ellipsis clipping on the active edit row.
 */
export function LookupInlineTable<T extends object>({
  title,
  subtitle,
  columns,
  data,
  rowKey,
  editingId,
  isLoading,
  emptyMessage,
  shellFullWidth,
  compactTableShell = true,
  exportFilename,
  printTitle,
  actions,
}: LookupInlineTableProps<T>) {
  const tableColumns: Col<T>[] = columns.map((c) => ({
    key: c.key,
    label: c.header,
    sortable: c.sortable ?? true,
    nowrap: c.nowrap,
    wrap: c.wrap,
    minWidth: c.minWidth,
    csvValue: c.csvValue,
    sortValue: c.sortValue,
    render: (row, index) => {
      const isEditing = editingId != null && rowKey(row) === editingId;
      if (isEditing && c.editCell) {
        return c.editCell(row, { isEditing: true });
      }
      return c.cell(row, index);
    },
    tdStyle: (row) => {
      const isEditing = editingId != null && rowKey(row) === editingId;
      if (isEditing && c.editCell) {
        return editCellTdStyle(c.minWidth);
      }
      return undefined;
    },
  }));

  return (
    <Table<T>
      title={title}
      subtitle={subtitle}
      columns={tableColumns}
      data={data}
      rowKey={rowKey}
      isLoading={isLoading}
      emptyMessage={emptyMessage}
      shellFullWidth={compactTableShell ? false : shellFullWidth}
      compactTableShell={compactTableShell}
      exportFilename={exportFilename}
      printTitle={printTitle}
      actions={actions}
      showPageHeader={false}
    />
  );
}
