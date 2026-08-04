# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This repo is Stereum 2.0, an Ethereum node setup & manager. It has two independent halves:

- **`launcher/`** — an Electron + Vue 3 desktop app (the "GUI"). This is where almost all JavaScript development happens. All `npm` commands below are run **from inside `launcher/`**.
- **`controls/`** — Ansible roles and playbooks (the "backend automation") that actually install and manage node services on a remote server, plus a Molecule/Poetry test harness for them.

The launcher never runs node software locally. It SSHes into a target server, copies the `controls/` Ansible roles there, and runs playbooks remotely. Understanding this split is essential.

## Commands (run from `launcher/`)

```bash
npm i                     # install deps (runs electron-builder install-app-deps postinstall)
npm run dev               # start the app in dev mode (electron-vite: renderer HMR + main auto-restart)
# stereum / electron:serve / backend:watch are all aliases of `electron-vite dev`

npm run build             # electron-vite build -> out/{main,preload,renderer} (no packaging)
npm run electron:build    # electron-vite build + electron-builder -> dist/<platform> (publish never)

npm run lint:fix          # eslint src --fix (lint only files you changed)
npm run format            # prettier . --write  (required before PRs)
npm run format:check      # prettier . --check  (CI gate)

# Tests (Jest). testMatch = *.test.js | *.spec.js | *.int.js
npm run test:unit         # unit tests (.test/.spec) with coverage
npm run test:int          # integration tests (.int.js) — see warning below
npx jest path/to/File.test.js          # run a single test file
npx jest -t "geth installation"        # run tests matching a name
```

**Integration tests (`*.int.js`) are expensive and side-effectful:** each spins up a real Hetzner Cloud server via `HetznerServer.js`, installs Stereum over SSH, and asserts on the running node. They require `HCLOUD_TOKEN` in the environment and take minutes each (`jest.setTimeout(600000)`). Do not run them casually. `npm run test:cleanup` (runs `src/backend/tests/integration/Cleanup.js`) tears down leftover servers. Regular unit tests run fully offline against `jsdom`.

### Ansible role tests (`controls/`)

Uses Poetry + Molecule (see `controls/README.md`). Roles `update-changes`, `configure-updates`, `configure-firewall` use the `docker` driver (local); all others use the `hcloud` driver and need `HCLOUD_TOKEN`.

```bash
cd controls && poetry install
cd controls/roles/<role> && poetry run molecule test [-s <scenario>]
```

## Architecture

### Electron process model & the IPC bridge

- **Main process** (`src/background.js`): owns all backend logic and registers every `ipcMain.handle(...)` channel (`connect`, `setup`, `getServices`, `updateServices`, …). This is the single catalog of what the renderer can ask the backend to do.
- **Preload** (`src/preload.js`): exposes a minimal `window.promiseIpc` (wrapping `ipcRenderer.invoke`) plus terminal/custom-URL bridges via `contextBridge`. Context isolation is on — the renderer has no direct Node access.
- **Renderer → backend**: the renderer calls methods on `src/store/ControlService.js`, a singleton `EventEmitter` that forwards each call as `promiseIpc.send("<channel>", args)`. So a new backend capability = new `ipcMain.handle` in `background.js` **and** a matching method in `ControlService.js`.

### Backend (`src/backend/`, runs in the main process)

- **`NodeConnection.js`** (large, central): owns the SSH connection lifecycle, detects the server OS, reads/writes Stereum settings, installs the Ansible roles onto the server, and runs playbooks. `runPlaybook(role, extraVars)` executes `controls/genericPlaybook.yaml` remotely with `stereum_role=<role>` and JSON extra-vars, using the custom `stereumjson` Ansible stdout callback for machine-readable results keyed by a random `playbookRunRef`.
- **`SSHService.js`**: connection pool + `exec` helpers; `checkExecError`/`extractExecError` are the standard way error results are surfaced.
- **`ServiceManager.js`** (very large): the heart of service configuration — creates/modifies/wires services together (dependencies, ports, volumes, client pairings).
- **`ethereum-services/`**: one class per supported client/tool (`GethService`, `LighthouseBeaconService`, `PrysmValidatorService`, `FlashbotsMevBoostService`, Optimism/L2 variants, SSV, Lido, monitoring exporters, …), all extending **`NodeService.js`**. Each service builds a Docker container spec: it has `buildByUserInput(network, ports, dir)` / `buildByConfiguration(...)` factories and generates the container command/entrypoint/volumes. Supported networks live in `NodeService.networks`. **When adding or changing a client, this is where the container command/flags are defined** — and there's typically a matching `*.test.js` (unit) and `*.int.js` (integration) file.
- Other notable pieces: `OneClickInstall.js` (predefined "constellation" setups), `ValidatorAccountManager.js`, `Monitoring.js` (large; Grafana/Prometheus data), `ConfigManager.js`, `TaskManager.js` (tracks running playbooks), `NodeUpdates.js`.

### Frontend (`src/`)

- Vue 3 + `vue-router` + **Pinia** stores (`src/store/`, e.g. `theNode`, `services`, `nodeManage`, `servers`). `ControlService.js` also lives here as the IPC gateway.
- `src/pages/` = routed screens; `src/components/` (UI/base/layers); `src/composables/` = reusable logic (`services.js`, `monitoring.js`, `useTerminal.js`, etc.).
- i18n via `vue-i18n`; translations in `src/languages/` (managed by Crowdin, see `crowdin.yml`).
- Styling: Tailwind (`tailwind.config.js`) processed through `postcss.config.js`; `src/main.css` (with `@tailwind` directives) is imported by `src/main.js`.

### Build tooling (electron-vite)

The app is bundled with **electron-vite** (`electron.vite.config.js`), which drives three Vite builds — `main` (entry `src/background.js`), `preload` (`src/preload.js`), and `renderer` (root `index.html` + `src/main.js`) — into `out/{main,preload,renderer}`. `electron-builder.config.cjs` then packages `out/` into `dist/<platform>`.

- **Renderer** loads over `http://localhost` in dev and a custom `app://` scheme in production (registered in `background.js`), so absolute asset paths like `/img/...` resolve against the bundle. `ELECTRON_RENDERER_URL` distinguishes dev from prod.
- Main/preload keep runtime deps external (`externalizeDepsPlugin`), resolved from `node_modules` at runtime; `electron-store` is bundled (ESM-only). The renderer aliases `@` → `src` and needs `.vue` in `resolve.extensions` for extensionless imports.
- Renderer code must use ESM `import` (no `require`); static assets under `public/` are referenced by root-relative string paths (`/img/...`), not `require(...)`.

### Config flow (server side)

At runtime on the target server, `genericPlaybook.yaml` merges three layers into a single `stereum` var: `controls/defaults/stereum_defaults.yaml` (static defaults incl. pinned client `versions:`), `/etc/stereum/stereum.yaml` (per-server settings), and command-line `stereum_args`. Client image versions are pinned in `stereum_defaults.yaml` **and** as `imageVersion` defaults inside each `*Service.js` — keep them coherent when bumping.

## Conventions

- Prettier + ESLint config are the source of truth (`.prettierrc.json`, `eslint.config.js`). Run `npm run format` before any PR (`format:check` is a CI gate). Lint only files you touched.
- Style: `camelCase` functions/vars, `PascalCase` classes, `UPPERCASE_WITH_UNDERSCORES` constants, double quotes.
- Conventional-commit-style PR titles (imperative, no trailing period).
- CI (`.github/workflows/`) runs Jest unit tests, Molecule role tests, integration tests, ESLint/Prettier, and `shellcheck` on shell scripts. Shell scripts in `controls/` must pass shellcheck.
