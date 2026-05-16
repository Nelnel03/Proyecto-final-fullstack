import React from 'react'
import Rooting from './routes/Rooting'
import { ThemeProvider } from './context/ThemeContext'
import { LoadingProvider } from './context/LoadingContext'

import { ErrorBoundary, GlobalOverlay, TopProgressBar } from './components/ui'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LoadingProvider>
          <TopProgressBar />
          <GlobalOverlay />
          <Rooting />
        </LoadingProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App