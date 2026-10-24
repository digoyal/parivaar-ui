# @parivaar/ui

Shared React UI primitives for Parivaar apps. Source-only package — Vite in each app compiles the TypeScript.

## Install (local sibling)

From an app whose package root is a sibling of this repo (or one level deeper, e.g. `KutirGRS/frontend`):

```json
{
  "dependencies": {
    "@parivaar/ui": "file:../../parivaar-ui"
  }
}
```

(Use `file:../parivaar-ui` if the app’s `package.json` is a direct sibling of `parivaar-ui`.)

```bash
npm install
```

## Vite

Allow reading the linked package and dedupe React so hooks stay single-instance:

```ts
// vite.config.ts
export default defineConfig({
  resolve: { dedupe: ["react", "react-dom"] },
  server: { fs: { allow: ["../.."] } },
  optimizeDeps: { exclude: ["@parivaar/ui"] },
});
```

## Usage

```ts
import { Table, styles, useBfcacheReload, type Col } from "@parivaar/ui";
```

Host apps must provide the CSS variables referenced by `styles` (e.g. `--bg-card`, `--text-primary`, `--border`).

## Layout

```
projects/
  parivaar-ui/          ← this package
  KutirGRS/
    frontend/           ← "@parivaar/ui": "file:../../parivaar-ui"
```
