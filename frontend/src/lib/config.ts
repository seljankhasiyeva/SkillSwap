// Public, client-safe config. VITE_ prefixed vars are injected by Vite
// at build time and are safe to ship to the browser (no secrets here).
//
// Local dev: falls back to the ASP.NET Core HTTPS dev port.
// Production: set VITE_API_URL in your hosting provider's env settings,
// e.g. https://your-backend.up.railway.app/api
export const API_BASE = import.meta.env.VITE_API_URL ?? "https://localhost:7249/api";