import React from 'react'
import Rooting from './routes/Rooting'
import { ThemeProvider } from './context/ThemeContext'
import { LoadingProvider } from './context/LoadingContext'
import { ToastProvider } from './context/ToastContext'
import { ErrorBoundary } from './components/ui'
import GlobalOverlay from './components/ui/GlobalOverlay'
import TopProgressBar from './components/ui/TopProgressBar'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <LoadingProvider>
            {/* Barra de progreso superior: se activa automáticamente con peticiones */}
            <TopProgressBar />

            {/* Overlay bloqueante: se activa manualmente para operaciones críticas */}
            <GlobalOverlay />

            <Rooting />
          </LoadingProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App