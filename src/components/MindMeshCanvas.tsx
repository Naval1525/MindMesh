import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, {
  useReactFlow,
  ReactFlowInstance,
  Node,
  Edge,
  Connection,
  addEdge,
} from '@reactflow/core';
import { Background, BackgroundVariant } from '@reactflow/background';
import { Controls } from '@reactflow/controls';
import { MiniMap } from '@reactflow/minimap';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import FloatingToolbar from './FloatingToolbar';
import SearchPanel from './SearchPanel';
import NodeTypePanel from './NodeTypePanel';
import KeyboardShortcuts from './KeyboardShortcuts';
import { nodeTypes } from './nodes';
import '@reactflow/core/dist/style.css';
import '@reactflow/controls/dist/style.css';
import '@reactflow/minimap/dist/style.css';

const MindMeshCanvas: React.FC = () => {
  const { theme } = useTheme();
  const { nodes, edges, setNodes, setEdges, undo, redo, canUndo, canRedo } = useData();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNodePanelOpen, setIsNodePanelOpen] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type || !reactFlowInstance || !reactFlowBounds) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
          content: '',
          color: 'blue'
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case 'z':
            event.preventDefault();
            if (event.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'f':
            if (event.shiftKey) {
              event.preventDefault();
              setIsSearchOpen(true);
            }
            break;
          case 'n':
            event.preventDefault();
            setIsNodePanelOpen(true);
            break;
          case 'e':
            event.preventDefault();
            // Export will be handled by FloatingToolbar
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const getThemeBackground = () => {
    switch (theme) {
      case 'dark':
        return 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)';
      case 'neon':
        return 'linear-gradient(135deg, #0c0a09 0%, #1c1917 50%, #0c0a09 100%)';
      default:
        return 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
    }
  };

  const getBackgroundVariant = (): BackgroundVariant => {
    return theme === 'neon' ? BackgroundVariant.Dots : BackgroundVariant.Lines;
  };

  return (
    <div className="w-full h-screen relative" style={{ background: getThemeBackground() }}>
      <div className="w-full h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => {
            const updatedNodes = nodes.map(node => {
              const change = changes.find(c => c.id === node.id);
              if (change && change.type === 'position' && 'position' in change) {
                return { ...node, position: change.position || node.position };
              }
              return node;
            });
            setNodes(updatedNodes);
          }}
          onEdgesChange={(changes) => {
            const updatedEdges = edges.filter(edge => {
              const change = changes.find(c => c.id === edge.id);
              return !(change && change.type === 'remove');
            });
            setEdges(updatedEdges);
          }}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          snapToGrid={snapToGrid}
          snapGrid={[20, 20]}
          fitView
          attributionPosition="bottom-left"
        >
          <Background 
            variant={getBackgroundVariant()}
            gap={20} 
            size={1}
            color={theme === 'dark' ? '#374151' : theme === 'neon' ? '#f59e0b' : '#e5e7eb'}
          />
          <Controls 
            className="glass glass-border"
            showZoom={true}
            showFitView={true}
            showInteractive={true}
          />
          <MiniMap 
            className="glass glass-border"
            nodeColor={(node) => {
              switch (node.type) {
                case 'note': return '#3b82f6';
                case 'task': return '#10b981';
                case 'schedule': return '#8b5cf6';
                case 'goal': return '#f59e0b';
                case 'routine': return '#ec4899';
                case 'idea': return '#06b6d4';
                case 'link': return '#ef4444';
                default: return '#6b7280';
              }
            }}
            maskColor={theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'}
          />
        </ReactFlow>
      </div>

      <FloatingToolbar 
        onAddNode={() => setIsNodePanelOpen(true)}
        onSearch={() => setIsSearchOpen(true)}
        snapToGrid={snapToGrid}
        onToggleSnap={() => setSnapToGrid(!snapToGrid)}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
      />

      <AnimatePresence>
        {isSearchOpen && (
          <SearchPanel onClose={() => setIsSearchOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isNodePanelOpen && (
          <NodeTypePanel onClose={() => setIsNodePanelOpen(false)} />
        )}
      </AnimatePresence>

      <KeyboardShortcuts />
    </div>
  );
};

export default MindMeshCanvas;