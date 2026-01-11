import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";
import vue from "@vitejs/plugin-vue";
import pkg from "./package.json" with { type: "json" };
import vuetify from "vite-plugin-vuetify";

const { version } = pkg;

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    vuetify({
      styles: {
        configFile: "scss/settings.scss",
      },
    }),
  ],
  define: {
    __APPLICATION_VERSION__: JSON.stringify(`Accentor Web v${version}`),
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
