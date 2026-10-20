import '@fontsource-variable/onest';
import '@fontsource/geist-mono/400.css';
import '@fontsource/geist-mono/500.css';
import '@/app/styles/globals.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { createRouter } from '@/app/router';
import { redirectToPreferredLocale } from '@/shared/i18n/locale-detection';

redirectToPreferredLocale();

const router = createRouter();
const container = document.getElementById('root');
if (!container) throw new Error('Root element #root is missing');

createRoot(container).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
