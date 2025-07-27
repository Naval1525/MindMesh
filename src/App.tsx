import React from 'react';
import { ReactFlowProvider } from '@reactflow/core';
import MindMeshCanvas from './components/MindMeshCanvas';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <ReactFlowProvider>
          <div className="min-h-screen">
            <MindMeshCanvas />
          </div>
        </ReactFlowProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;