import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './components/ThemeProvider.tsx';
import { CartProvider } from './components/CartProvider.tsx';
import { initStore } from './lib/store.ts';
import { Toaster } from 'sonner';

initStore();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <CartProvider>
        <App />
        <Toaster position="bottom-right" />
      </CartProvider>
    </ThemeProvider>
  </StrictMode>,
);
