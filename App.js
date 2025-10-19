import React from 'react';
import { ThemeProvider } from './src/Context/StyleContext';
import AppContent from './src/AppContent';

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
