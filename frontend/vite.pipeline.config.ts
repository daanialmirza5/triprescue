import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Standalone Live Journey Pipeline (separate from the main app).
// `npm run build:pipeline` -> dist-pipeline/, which the FastAPI backend serves at
// /pipeline/ - so any laptop on the network opens http://<backend-host>:8000/pipeline/
// and the page talks to that same backend (relative /api URLs, no CORS).
// `npm run dev:pipeline` runs it on :5175 and proxies /api to a local backend.
export default defineConfig({
  base: '/pipeline/',
  plugins: [
    react(),
    {
      // Emit the page as index.html so /pipeline/ serves it directly.
      name: 'pipeline-index-html',
      enforce: 'post',
      generateBundle(_, bundle) {
        const page = bundle['pipeline.html'];
        if (page) page.fileName = 'index.html';
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    // Same-origin API: requests go to whichever backend served the page.
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(''),
  },
  server: {
    port: 5175,
    proxy: { '/api': process.env.PIPELINE_BACKEND_URL ?? 'http://127.0.0.1:8000' },
  },
  build: {
    outDir: 'dist-pipeline',
    emptyOutDir: true,
    rollupOptions: {
      input: fileURLToPath(new URL('./pipeline.html', import.meta.url)),
      output: { manualChunks: { react: ['react', 'react-dom'], graph: ['reactflow'] } },
    },
  },
});
