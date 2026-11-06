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

/** Minimum width for editable lookup name cells (matches BNV `LOOKUP_INLINE_EDIT_NAME_MIN_WIDTH`). */
export const LOOKUP_INLINE_EDIT_CELL_MIN_WIDTH = "12rem";

/**
 * Undo `colTextCellStyle` ellipsis clipping for cells hosting inputs while editing.
 * List-hub tables keep sibling rows at `DATA_COL_MAX_PX`, so the column can stay ~360px wide;
 * a plain `width: 100%` input then fills that box and looks "clipped". A floor in `ch` forces
 * the column (and horizontal scroll) wide enough for long names.
 */
const undoControlCellClipStyle: CSSProperties = {
  overflow: "visible",
  textOverflow: "clip",
  whiteSpace: "normal",
  maxWidth: "none",
  minWidth: `max(${LOOKUP_INLINE_EDIT_CELL_MIN_WIDTH}, 48ch)`,
};

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
        /** Do not replace `undoControlCellClipStyle.minWidth` with bare `c.minWidth` — that would drop the `max(..., 48ch)` floor. */
        const colMin =
          typeof c.minWidth === "undefined"
            ? null
            : typeof c.minWidth === "number"
              ? `${c.minWidth}px`
              : String(c.minWidth);
        return {
          ...undoControlCellClipStyle,
          ...(colMin
            ? { minWidth: `max(${colMin}, 48ch)` }
            : {}),
        };
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
      shellFullWidth={shellFullWidth}
      exportFilename={exportFilename}
      printTitle={printTitle}
      actions={actions}
    />
  );
}
