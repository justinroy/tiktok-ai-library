# Frontend Getting Started Guide

This guide walks you through running and iterating on the React frontend that lives in the `frontend/` folder. It is intentionally verbose so that someone new to Vite + React development can follow along step by step.

## 1. Install prerequisites

| Tool | Version (or newer) | Notes |
| ---- | ------------------ | ----- |
| [Node.js](https://nodejs.org/) | 18.x LTS | Installs the JavaScript runtime and includes `npm` (the package manager). |
| [pnpm](https://pnpm.io/) *(optional)* | 9.x | If you prefer pnpm over npm. All commands in this guide use `npm`, but the scripts are package-manager agnostic. |

Verify your install:

```bash
node --version
npm --version
```

If either command fails, reinstall Node.js from the official downloads or via a version manager like [`nvm`](https://github.com/nvm-sh/nvm).

## 2. Bootstrap environment variables

1. Copy the example environment file:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
2. Open `frontend/.env` and update the values:
   * `VITE_API_BASE_URL` – URL where the FastAPI/Streamlit backend is reachable. During local development this is usually `http://localhost:8000`.

`Vite` automatically exposes variables prefixed with `VITE_` to the frontend code.

## 3. Install dependencies

From the repository root (or within `frontend/`):

```bash
cd frontend
npm install
```

This downloads React, React Query, Vite, ESLint, and TypeScript dependencies defined in `package.json`.

## 4. Run the development server

```bash
npm run dev
```

Key points while the dev server is running:

* The command prints a local URL (typically `http://localhost:5173`). Open it in your browser.
* Any API calls to `/api/*` are proxied to `VITE_API_BASE_URL` by `vite.config.ts`.
* Hot Module Replacement (HMR) is enabled, so editing a file refreshes only the changed component.

Stop the server with `Ctrl+C` when you are done.

## 5. Explore the code layout

The most important directories are:

```
frontend/
├── src/
│   ├── api/              # API clients for the backend
│   ├── components/       # Reusable UI building blocks
│   ├── hooks/            # React Query data hooks
│   ├── styles/           # Global styles and resets
│   ├── theme/            # Theme provider and tokens
│   └── App.tsx           # Top-level page assembly
└── docs/ (this guide)
```

Start by reading `src/App.tsx` to see how filters, pagination, and the detail modal are composed.

## 6. Lint and type-check

Keeping the codebase clean avoids subtle runtime bugs.

* Run ESLint:
  ```bash
  npm run lint
  ```
  Fix any reported issues before committing.
* Type-check the project without building assets:
  ```bash
  npm run build -- --watch=false
  ```
  The build step runs `tsc` in `--noEmit` mode first, so TypeScript errors must be resolved.

## 7. Run against the backend

1. Start the FastAPI (or Streamlit) backend in another terminal. Ensure it exposes the `/api/videos` route returning signed playback URLs.
2. With the backend running, relaunch `npm run dev`. The frontend will call the backend through the Vite proxy.
3. Verify that searching, applying tag filters, and opening the detail modal all work with live data.

If API requests fail, double-check the value of `VITE_API_BASE_URL` and confirm the backend allows cross-origin requests from the frontend’s origin.

## 8. Build for production

When you are ready to deploy a static build:

```bash
npm run build
npm run preview  # optional: serves the generated assets locally
```

The compiled assets land in `frontend/dist/`. See `docs/deployment.md` for nginx or container-based deployment recipes.

## 9. Suggested next enhancements

Once the basics are running, here are approachable tasks:

1. **Add loading skeletons** – Enhance `VideoGrid` with placeholder cards while data loads.
2. **Improve error UI** – Display actionable retry buttons when API calls fail.
3. **Persist filters** – Sync search text and selected tags to the URL so that state survives refreshes.
4. **Accessibility polish** – Audit components with [axe DevTools](https://www.deque.com/axe/devtools/) and address findings.
5. **Testing** – Introduce React Testing Library and Vitest for component/unit coverage.

Work through these ideas as you gain confidence. Each one strengthens understanding of modern React patterns.

---

If you run into trouble or something in this guide is unclear, leave a note in the repository issues so the documentation can keep improving.
