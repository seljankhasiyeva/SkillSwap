// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Force a real, self-hostable Node server (Railway/VPS/etc.), instead of
  // Lovable's default Cloudflare-only build target.
  nitro: {
    preset: "node-server",
  },
  vite: {
    preview: {
      // Railway (and similar PaaS) put the app behind a rotating/proxied
      // hostname, so we can't hard-code it. Trust the proxy's Host header.
      allowedHosts: true,
    },
    server: {
      allowedHosts: true,
    },
  },
});