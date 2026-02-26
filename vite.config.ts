import tailwindcss from '@tailwindcss/vite';
import tanstackRouter from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  envDir: '../../',
  plugins: [
    tanstackRouter({
      routesDirectory: './routes',
      generatedRouteTree: './routeTree.gen.ts',
    }),
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    tailwindcss(),
    tsconfigPaths({ projects: ['../../tsconfig.web.json'] }),
  ],
  root: 'src/web',
  build: {
    outDir: '../../dist/client',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('/react/')) {
              return 'vendor-react';
            }
            if (
              id.includes('@tanstack/react-router') ||
              id.includes('@tanstack/react-query')
            ) {
              return 'vendor-router';
            }
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
