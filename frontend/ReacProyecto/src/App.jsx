import React from 'react'
import Rooting from './routes/Rooting'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <Rooting />
    </ThemeProvider>
  )
}

export default App