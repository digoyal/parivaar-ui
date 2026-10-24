# @parivaar/ui

Shared UI primitives for Parivaar apps. **Source-only** — no `dist` build; each app’s Vite compiles these files.

## Exports (`src/index.ts`)

| Export | Notes |
|--------|--------|
| `Table`, `Col` | Generic data table (search, sort, CSV, print, pagination, row actions) |
| `GrsTable` | Deprecated alias of `Table` (compat) |
| `RowActions` | View / edit / delete icon buttons for table rows |
| `ConfirmDialog` | In-app confirm overlay (replaces browser `confirm()`) |
| `GrsModal` | Overlay + card shell (`title`, `onClose`, children) |
| `GrsTabs` | Underline tab strip (`tabs`, `value`, `onChange`; optional badges) |
| `styles` | Shared CSS-variable style tokens (`styles.btnPrimary`, `styles.th`, …) |
| `useBfcacheReload` | Reload on bfcache restore; strip `?_=` after column-config Apply |

## Peer deps

- `react` / `react-dom` `^19.2.8` (match consuming apps)

## Rules

1. **No app imports** — this package must not import from KutirGRS or any other app.
2. **Source-only** — keep `"exports"` / `"types"` pointed at `./src/index.ts`; do not add a build step.
3. **Theme via CSS vars** — host apps define `--bg-card`, `--text-primary`, `--border`, etc. Do not hardcode product names or Kutir/GRS copy.
4. **App-specific UI stays in apps** — forms, geo filters, role matrix, visit/admission flows are not packaged here.
