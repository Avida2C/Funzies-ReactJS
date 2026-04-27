
# Funzies Collection

<div>
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=000000" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=ffffff" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwindcss&logoColor=ffffff" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/DaisyUI-5A0EF8?style=flat&logo=daisyui&logoColor=ffffff" alt="DaisyUI" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=reactrouter&logoColor=ffffff" alt="React Router" />
  <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=ffffff" alt="Express" />
</div>

Funzies is a React storefront powered by Vite, Tailwind CSS, and DaisyUI. The repo also includes a small Express API used during local development.

## Tech stack

- React
- Vite
- React Router
- Tailwind CSS + DaisyUI
- Express (local API)

## Requirements

- Node.js (recommended: latest LTS)
- npm

## Getting started

Install dependencies:

```bash
npm install
```

Run the frontend only:

```bash
npm run dev
```

Run the API only:

```bash
npm run dev:api
```

Run frontend + API together:

```bash
npm run dev:stack
```

## API proxy (local dev)

Vite proxies API requests to the local Express server:

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001`
- Proxy: requests to `/api/*` are forwarded to `http://localhost:3001`

## Scripts

- `npm run dev`: start Vite dev server
- `npm run dev:api`: start local Express API (`server/index.mjs`)
- `npm run dev:stack`: run app + API concurrently
- `npm run build`: build production assets to `dist/`
- `npm run preview`: preview the production build locally

## Project structure (high level)

- `src/`: React app (pages, components, routing)
- `server/`: Express API
- `dist/`: production build output (generated)

## Notes

- `dist/` is build output and is ignored by git.
- Local env files are ignored (`.env`, `.env.*`). If you add one, don’t commit it.

