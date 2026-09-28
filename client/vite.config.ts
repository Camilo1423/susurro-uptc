import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // URL real del gateway (misma variable que consume el build de params).
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.URL_API_GATEWAY?.replace(/\/+$/, "");

  return {
    server: {
      // Proxy de desarrollo: reenvía las llamadas de la API por el mismo origen
      // para que las cookies de sesión sean first-party. En axios el baseURL es
      // "" en dev (ver axios.service.ts).
      proxy: apiTarget
        ? {
            "/api": {
              target: apiTarget,
              changeOrigin: true,
              secure: false,
              cookieDomainRewrite: "",
            },
          }
        : undefined,
    },
    plugins: [
      react(),
      tailwindcss(),
      {
        // Regenera config.json cuando cambian los params/routes en desarrollo.
        name: "validate-and-build-plugin",
        apply: "serve",
        handleHotUpdate({ file }) {
          if (file.endsWith("routes.json") || file.endsWith("params.json")) {
            execSync("node ./src/build/reload-params.js", { stdio: "inherit" });
          }
        },
      },
      {
        name: "environment-logger",
        apply: "build",
        buildStart() {
          try {
            const configPath = path.resolve(
              import.meta.dirname,
              "src/config/config.json",
            );
            if (fs.existsSync(configPath)) {
              const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
              const environment = config.environment || "Production";
              console.log(`\n🚀 Building for ${environment} environment...\n`);
            }
          } catch (err) {
            console.log("\n🚀 Building for Production environment...\n", err);
          }
        },
      },
    ],
    resolve: {
      alias: {
        "@Constant": path.resolve(import.meta.dirname, "src/config"),
        "@Utils": path.resolve(import.meta.dirname, "src/utils"),
        "@Container": path.resolve(import.meta.dirname, "src/container"),
        "@Types": path.resolve(import.meta.dirname, "src/types"),
        "@UseCase": path.resolve(import.meta.dirname, "src/services/useCases"),
        "@Services": path.resolve(import.meta.dirname, "src/services"),
        "@Routes": path.resolve(import.meta.dirname, "src/routes"),
        "@Pages": path.resolve(import.meta.dirname, "src/pages"),
        "@Components": path.resolve(import.meta.dirname, "src/components"),
        "@Hooks": path.resolve(import.meta.dirname, "src/hooks"),
        "@Providers": path.resolve(import.meta.dirname, "src/providers"),
        "@Redux": path.resolve(import.meta.dirname, "src/store"),
        "@Assets": path.resolve(import.meta.dirname, "src/assets"),
        "@Middleware": path.resolve(import.meta.dirname, "src/middleware"),
      },
    },
    build: {
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        // Los scripts de build y los params no se empaquetan en el bundle.
        external: (id) => {
          return id.includes("/src/build/") || id.includes("/src/params/");
        },
      },
    },
  };
});
