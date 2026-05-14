import React from 'react'
import Rooting from './routes/Rooting'
import { ThemeProvider } from './context/ThemeContext'
import { LoadingProvider } from './context/LoadingContext'
import { ToastProvider } from './context/ToastContext'
import { ErrorBoundary, GlobalOverlay, TopProgressBar } from './components/ui'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LoadingProvider>
          <ToastProvider>
            {/* Barra de progreso superior: se activa automáticamente con peticiones */}
            <TopProgressBar />

            {/* Overlay bloqueante: se activa manualmente para operaciones críticas */}
            <GlobalOverlay />

            <Rooting />
          </ToastProvider>
        </LoadingProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App