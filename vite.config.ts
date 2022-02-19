import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import inject from '@rollup/plugin-inject';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      assert: require.resolve('assert/'),
      stream: require.resolve('stream-browserify'),
    },
  },
});
