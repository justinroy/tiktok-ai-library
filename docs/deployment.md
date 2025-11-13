# Frontend + Backend Deployment Guide

This repository now contains a Vite + React frontend (`frontend/`) that works alongside the existing Streamlit/FASTAPI backend. The two layers communicate over REST endpoints and use signed URLs returned by the backend to play private TikTok videos.

If you are new to the stack, start with [docs/frontend-getting-started.md](./frontend-getting-started.md) for a step-by-step walkthrough before diving into deployment specifics.

## Environment variables

1. Copy the example file and update it with environment-specific values:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
2. Set the following variables:
   - `VITE_API_BASE_URL`: Absolute URL that the frontend should use in production to reach the backend (e.g. `https://api.example.com`).
   - `VITE_DEV_PROXY_TARGET`: Local URL of the backend for development (defaults to `http://localhost:8000`).
   - `VITE_DEV_SERVER_PORT` and `VITE_PREVIEW_PORT`: Optional overrides for local dev/preview ports.

## Local development

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the backend (e.g. Streamlit `streamlit run app.py` or FastAPI `uvicorn app:app --reload`).
3. Start the Vite dev server with automatic proxying to the backend:
   ```bash
   npm run dev
   ```
   The dev server proxies requests starting with `/api` to `VITE_DEV_PROXY_TARGET`. Update this target if the backend runs on a different port.

## Production build

1. Build the static assets:
   ```bash
   cd frontend
   npm run build
   ```
   The compiled files are written to `frontend/dist/`.
2. Serve the build directory with your preferred static host (e.g. Cloud Storage, Netlify) and point the backend base URL to `VITE_API_BASE_URL`.

## Reverse proxy configuration

### Nginx example

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        root /var/www/tiktok-ai-library/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Vite dev server proxy

The proxy is configured in `frontend/vite.config.ts` and forwards `/api` to the backend defined by `VITE_DEV_PROXY_TARGET`. This allows the React app to make requests such as `fetch('/api/videos')` without CORS issues.

## API contract

The React app expects an endpoint `GET /api/videos` that accepts the following query parameters:

- `search`: optional text to match summaries or tags.
- `tags`: comma-separated list of tags to filter by.
- `page`: 1-indexed page number.
- `pageSize`: number of records per page.

The endpoint should return JSON in the shape:

```json
{
  "items": [
    {
      "id": "string",
      "summary": "string",
      "tags": ["tag1", "tag2"],
      "signedUrl": "https://...",
      "videoUri": "gs://...",
      "transcript": "optional transcript",
      "createdAt": "2024-05-01T12:00:00Z"
    }
  ],
  "total": 123,
  "page": 1,
  "pageSize": 20,
  "availableTags": ["tag1", "tag2"],
  "tagCounts": {"tag1": 42, "tag2": 10}
}
```

The `signedUrl` field is used directly as the `<video>` source, ensuring private videos remain protected.

## Linting

Run ESLint before committing to enforce the shared coding standards:

```bash
cd frontend
npm run lint
```

