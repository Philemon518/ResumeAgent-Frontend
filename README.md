# ResumeAgent Frontend

Next.js wizard for scoring a CV. The score and downloadable PDF live in the
browser tab only. Refreshing the page discards them.

## Local

```bash
cp .env.example .env.local
npm install
npm run dev
```

`.env.local` should point at a local API (`NEXT_PUBLIC_API_URL=http://localhost:8000`).
Do not commit `.env.local`.

## Railway

One service. Root directory is this repository.

| Variable | Required | Notes |
| --- | --- | --- |
| `API_INTERNAL_URL` | yes | Backend URL. Private Railway URL is best, e.g. `http://resumeagent-backend.railway.internal:PORT` |
| `PORT` | automatic | Railway injects this |

Leave `NEXT_PUBLIC_API_URL` **unset** in Railway so the browser calls `/api`
and this service proxies to the backend. That way the API origin is not
hard-coded into the public JS bundle.

If you must call the API from the browser directly, set `NEXT_PUBLIC_API_URL`
to the public backend URL **with** `https://` (for example
`https://resumeagent-backend-production.up.railway.app`) **and** set
`CV_EVAL_CORS_ORIGINS` on the API to this frontend URL.

## Privacy

- No `localStorage` for CVs or reports
- Download PDF is an in-memory blob
- Refresh or “New evaluation” clears the tab

## License

MIT
