import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from './package.json' with { type: 'json' };
import vuetify from "vite-plugin-vuetify";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { version } = pkg;

export default defineConfig({
  plugins: [
    vue(),
      vuetify(),
  ],
  define: {
      __APPLICATION_VERSION__: JSON.stringify(`Accentor Web v${version}`),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  css: {
    preprocessorOptions: {
      // Vuetify somehow needs this to be in sass, while the rest of the build needs it to be in scss
      scss: {
          additionalData: `@import "@/sass/main.scss";\n`
      },
      sass: {
          additionalData: `@import "@/sass/main.scss";\n`
      }
    }
  },
});
