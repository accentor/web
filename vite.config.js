import { defineConfig } from 'vite';
import vue2 from '@vitejs/plugin-vue2';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from './package.json' with { type: 'json' };
import Components from 'unplugin-vue-components/vite'
import { VuetifyResolver } from 'unplugin-vue-components/resolvers'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { version } = pkg;

export default defineConfig({
  plugins: [
    vue2(),
    Components({
      resolvers: [VuetifyResolver()],
    }),
  ],
  define: {
      __APPLICATION_VERSION__: JSON.stringify(`Accentor Web v${version}`),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/sass/main.scss";`
      }
    }
  },
});
