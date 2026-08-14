import { defineConfig } from 'vite'

/**
 * Vite's preview server rejects any request whose Host header it doesn't
 * recognise — a real protection against DNS-rebinding, but it also blocks a
 * tunnel (localtunnel, Cloudflare quick tunnels, ngrok) from reaching it,
 * since the tunnel's hostname is never "localhost".
 *
 * `allowedHosts: true` disables that check entirely. Fine for handing a build
 * to friends over a throwaway tunnel URL; do not carry this into anything
 * meant to sit on the open internet long-term.
 */
export default defineConfig({
  // Served from https://catabeille.github.io/covenance-game/ — a project
  // Pages site sits under a subpath, not the domain root, so every asset
  // reference (this bundle's own, and the portrait paths in character.ts)
  // has to be built relative to this instead of assuming `/`.
  base: '/covenance-game/',
  preview: {
    allowedHosts: true,
  },
})
