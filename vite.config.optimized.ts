import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin() // Split vendor chunks for better caching
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
    },
  },
  build: {
    // Optimize build for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React and related libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Split UI libraries
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-avatar',
            '@radix-ui/react-tabs',
          ],
          // Split query library
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000, // 1MB
    // Enable source maps for debugging (disable in production if needed)
    sourcemap: false,
    // Optimize asset handling
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB
  },
  server: {
    port: 5173,
    strictPort: false,
    // Enable HMR for better development experience
    hmr: {
      overlay: true,
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
    ],
    exclude: ['@vite/client', '@vite/env'],
  },
});
