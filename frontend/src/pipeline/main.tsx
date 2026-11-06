import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PipelinePage } from '@/pages/PipelinePage';
import '../index.css';

// Standalone entry: no login, no app shell - just the Live Journey Pipeline.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main className="min-h-screen bg-canvas px-4 py-6 sm:px-6 lg:px-8">
      <PipelinePage />
    </main>
  </StrictMode>
);
