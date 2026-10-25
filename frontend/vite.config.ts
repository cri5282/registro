import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const rawBase = env.VITE_BASE_PATH || "/";
  const base = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

  return {
    base,
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.svg", "icons/apple-touch-icon.png"],
        manifest: {
          name: "Registro",
          short_name: "Registro",
          description: "Registro condiviso delle presenze della classe",
          lang: "it",
          theme_color: "#0b0d12",
          background_color: "#0b0d12",
          display: "standalone",
          orientation: "portrait",
          start_url: base,
          scope: base,
          icons: [
            { src: `${base}icons/icon-192.png`, sizes: "192x192", type: "image/png" },
            { src: `${base}icons/icon-512.png`, sizes: "512x512", type: "image/png" },
            {
              src: `${base}icons/icon-maskable-512.png`,
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
          // I temi segreti si scaricano solo quando servono, poi restano in cache.
          globIgnores: [
            "**/themes/**",
            "**/assets/{alfa-slab-one,cinzel,anton,dm-serif-display,barlow-condensed,fraunces,black-ops-one,fredoka,inter,bricolage-grotesque}-latin-*",
          ],
          runtimeCaching: [
            {
              urlPattern: ({ url }) =>
                url.pathname.includes("/themes/") || /\/assets\/[a-z-]+-latin-\d+-normal-[\w-]+\.woff2?$/.test(url.pathname),
              handler: "CacheFirst",
              options: {
                cacheName: "registro-themes",
                expiration: { maxEntries: 80 },
              },
            },
          ],
        },
      }),
    ],
    server: {
      port: 5173,
    },
  };
});
