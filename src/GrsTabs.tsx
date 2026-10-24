import type { CSSProperties, ReactNode } from "react";

export interface GrsTabItem<T extends string = string> {
  key: T;
  label: ReactNode;
  /** Optional count / chip next to the label (e.g. Geo tab counts). */
  badge?: ReactNode;
}

export interface GrsTabsProps<T extends string = string> {
  tabs: GrsTabItem<T>[];
  value: T;
  onChange: (key: T) => void;
  /** Wrapper style (marginBottom differs slightly across pages). */
  style?: CSSProperties;
}

const stripStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0,
  borderBottom: "2px solid var(--border)",
};

const badgeStyle: CSSProperties = {
  background: "var(--bg-input)",
  color: "var(--text-secondary)",
  borderRadius: 10,
  padding: "1px 6px",
  fontSize: "0.7rem",
  fontWeight: 700,
};

/**
 * Underline tab strip shared by Geo / Lookups / Reports-style pages.
 */
export function GrsTabs<T extends string = string>({
  tabs,
  value,
  onChange,
  style,
}: GrsTabsProps<T>) {
  return (
    <div style={{ ...stripStyle, ...style }} role="tablist">
      {tabs.map((t) => {
        const active = value === t.key;
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.key)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px 16px",
              fontSize: "0.875rem",
              display: "flex",
              gap: 6,
              alignItems: "center",
              fontWeight: active ? 700 : 400,
              color: active ? "var(--badge-blue-fg)" : "var(--text-secondary)",
              borderBottom: active
                ? "2px solid var(--badge-blue-fg)"
                : "2px solid transparent",
              marginBottom: -2,
              transition: "color 0.15s",
            }}
          >
            {t.label}
            {t.badge != null && t.badge !== "" && (
              <span style={badgeStyle}>{t.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
