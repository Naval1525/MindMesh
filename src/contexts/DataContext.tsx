import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Node, Edge } from '@reactflow/core';

interface MindMeshData {
  nodes: Node[];
  edges: Edge[];
  lastModified: number;
}

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

interface DataContextType {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;
  addNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  saveData: () => void;
  loadData: () => void;
  exportData: () => void;
  importData: (data: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  searchNodes: (query: string) => Node[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodes, setNodesState] = useState<Node[]>([]);
  const [edges, setEdgesState] = useState<Edge[]>([]);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveToHistory = useCallback((nodes: Node[], edges: Edge[]) => {
    const newState = { nodes: [...nodes], edges: [...edges] };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    
    // Keep only last 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }
    
    setHistory(newHistory);
  }, [history, historyIndex]);

  const setNodes = useCallback((newNodes: Node[]) => {
    setNodesState(newNodes);
    saveToHistory(newNodes, edges);
  }, [edges, saveToHistory]);

  const setEdges = useCallback((newEdges: Edge[]) => {
    setEdgesState(newEdges);
    saveToHistory(nodes, newEdges);
  }, [nodes, saveToHistory]);

  const updateNode = useCallback((nodeId: string, updates: Partial<Node>) => {
    const updatedNodes = nodes.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    );
    setNodes(updatedNodes);
  }, [nodes, setNodes]);

  const addNode = useCallback((node: Node) => {
    const newNodes = [...nodes, node];
    setNodes(newNodes);
  }, [nodes, setNodes]);

  const removeNode = useCallback((nodeId: string) => {
    const filteredNodes = nodes.filter(node => node.id !== nodeId);
    const filteredEdges = edges.filter(edge => 
      edge.source !== nodeId && edge.target !== nodeId
    );
    setNodesState(filteredNodes);
    setEdgesState(filteredEdges);
    saveToHistory(filteredNodes, filteredEdges);
  }, [nodes, edges, saveToHistory]);

  const saveData = useCallback(() => {
    const data: MindMeshData = {
      nodes,
      edges,
      lastModified: Date.now()
    };
    localStorage.setItem('mindmesh-data', JSON.stringify(data));
  }, [nodes, edges]);

  const loadData = useCallback(() => {
    try {
      const saved = localStorage.getItem('mindmesh-data');
      if (saved) {
        const data: MindMeshData = JSON.parse(saved);
        setNodesState(data.nodes || []);
        setEdgesState(data.edges || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }, []);

  const exportData = useCallback(() => {
    const data = { nodes, edges, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindmesh-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const importData = useCallback((dataString: string) => {
    try {
      const data = JSON.parse(dataString);
      if (data.nodes && data.edges) {
        setNodesState(data.nodes);
        setEdgesState(data.edges);
        saveToHistory(data.nodes, data.edges);
      }
    } catch (error) {
      console.error('Failed to import data:', error);
    }
  }, [saveToHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodesState(prevState.nodes);
      setEdgesState(prevState.edges);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodesState(nextState.nodes);
      setEdgesState(nextState.edges);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  const searchNodes = useCallback((query: string): Node[] => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return nodes.filter(node => {
      const title = node.data?.title?.toLowerCase() || '';
      const content = node.data?.content?.toLowerCase() || '';
      const type = node.type?.toLowerCase() || '';
      
      return title.includes(lowerQuery) || 
             content.includes(lowerQuery) || 
             type.includes(lowerQuery);
    });
  }, [nodes]);

  // Auto-save every 5 seconds
  useEffect(() => {
    const interval = setInterval(saveData, 5000);
    return () => clearInterval(interval);
  }, [saveData]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <DataContext.Provider value={{
      nodes,
      edges,
      setNodes,
      setEdges,
      updateNode,
      addNode,
      removeNode,
      saveData,
      loadData,
      exportData,
      importData,
      undo,
      redo,
      canUndo,
      canRedo,
      searchNodes
    }}>
      {children}
    </DataContext.Provider>
  );
};