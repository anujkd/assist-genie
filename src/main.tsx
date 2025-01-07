import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Router from './routes/index.tsx'
import { QueryProvider } from './providers/QueryProvider.tsx'
import './index.css'
import { Toaster } from './components/ui/toaster.tsx'
import { ThemeProvider } from './components/common/ThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider defaultTheme="system" storageKey="chat-theme">
        <Router />
        <Toaster />
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>,
)
