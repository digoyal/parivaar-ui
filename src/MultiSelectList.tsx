import { useId, useMemo, useRef, useEffect } from "react";

export interface MultiSelectListItem {
  id: number;
  primary: string;
  secondary?: string;
}

export interface MultiSelectListProps {
  title: string;
  items: MultiSelectListItem[];
  selectedIds: number[];
  onChangeSelected: (ids: number[]) => void;
  emptyMessage?: string;
  disabledIds?: number[];
  /** Disables all interaction (e.g. while saving). */
  disabled?: boolean;
  className?: string;
}

export function MultiSelectList({
  title,
  items,
  selectedIds,
  onChangeSelected,
  emptyMessage = "No items.",
  disabledIds,
  disabled = false,
  className,
}: MultiSelectListProps) {
  const baseId = useId();
  const selectAllRef = useRef<HTMLInputElement>(null);

  const disabledSet = useMemo(
    () => new Set(disabledIds ?? []),
    [disabledIds],
  );

  const selectableIds = useMemo(
    () => items.filter((i) => !disabledSet.has(i.id)).map((i) => i.id),
    [items, disabledSet],
  );

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const selectedSelectableCount = useMemo(
    () => selectableIds.filter((id) => selectedSet.has(id)).length,
    [selectableIds, selectedSet],
  );

  const allSelected =
    selectableIds.length > 0 && selectedSelectableCount === selectableIds.length;
  const someSelected = selectedSelectableCount > 0;

  useEffect(() => {
    const el = selectAllRef.current;
    if (el) {
      el.indeterminate = someSelected && !allSelected;
    }
  }, [someSelected, allSelected]);

  function toggleAll() {
    if (disabled || selectableIds.length === 0) return;
    if (allSelected) {
      const selectable = new Set(selectableIds);
      onChangeSelected(selectedIds.filter((id) => !selectable.has(id)));
    } else {
      const next = new Set(selectedIds);
      for (const id of selectableIds) next.add(id);
      onChangeSelected([...next]);
    }
  }

  function toggleOne(id: number) {
    if (disabled || disabledSet.has(id)) return;
    if (selectedSet.has(id)) {
      onChangeSelected(selectedIds.filter((x) => x !== id));
    } else {
      onChangeSelected([...selectedIds, id]);
    }
  }

  function clearSelection() {
    if (disabled) return;
    const selectable = new Set(selectableIds);
    onChangeSelected(selectedIds.filter((id) => !selectable.has(id)));
  }

  return (
    <div className={["ui-multiselect-list", className].filter(Boolean).join(" ")}>
      <div className="ui-multiselect-list__title">
        <span>{title}</span>
        {items.length > 0 ? (
          <span className="ui-multiselect-list__title-meta">
            {items.length} {items.length === 1 ? "row" : "rows"}
          </span>
        ) : null}
      </div>

      {items.length > 0 ? (
        <>
          <div
            className={[
              "ui-multiselect-list__select-all",
              someSelected ? "ui-multiselect-list__select-all--active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <label className="ui-multiselect-list__select-all-label" htmlFor={`${baseId}-all`}>
              <input
                ref={selectAllRef}
                id={`${baseId}-all`}
                type="checkbox"
                className="ui-multiselect-list__checkbox"
                checked={allSelected}
                onChange={toggleAll}
                disabled={disabled || selectableIds.length === 0}
              />
              Select All
            </label>
            {someSelected ? (
              <span className="ui-multiselect-list__select-all-count">
                {selectedSelectableCount} of {selectableIds.length} selected
              </span>
            ) : null}
            {someSelected ? (
              <button
                type="button"
                className="ui-multiselect-list__clear"
                onClick={clearSelection}
                disabled={disabled}
              >
                Clear
              </button>
            ) : null}
          </div>

          <div className="ui-multiselect-list__body" role="list">
            {items.map((item) => {
              const rowDisabled = disabled || disabledSet.has(item.id);
              const checked = selectedSet.has(item.id);
              const inputId = `${baseId}-row-${item.id}`;
              return (
                <div
                  key={item.id}
                  role="listitem"
                  className={[
                    "ui-multiselect-list__row",
                    checked ? "ui-multiselect-list__row--selected" : "",
                    rowDisabled ? "ui-multiselect-list__row--disabled" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <label className="ui-multiselect-list__row-label" htmlFor={inputId}>
                    <input
                      id={inputId}
                      type="checkbox"
                      className="ui-multiselect-list__checkbox"
                      checked={checked}
                      onChange={() => toggleOne(item.id)}
                      disabled={rowDisabled}
                    />
                    <div className="ui-multiselect-list__text">
                      <div className="ui-multiselect-list__primary">{item.primary}</div>
                      {item.secondary ? (
                        <div className="ui-multiselect-list__secondary">{item.secondary}</div>
                      ) : null}
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="ui-multiselect-list__empty">{emptyMessage}</div>
      )}
    </div>
  );
}