import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowInstance,
  Node,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@reactflow/core';
import { Background, BackgroundVariant } from '@reactflow/background';
import { Controls } from '@reactflow/controls';
import { MiniMap } from '@reactflow/minimap';
import { AnimatePresence } from 'framer-motion';
import { geminiGenerate } from '../utils/gemini';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import FloatingToolbar from './FloatingToolbar';
import SearchPanel from './SearchPanel';
import NodeTypePanel from './NodeTypePanel';
import KeyboardShortcuts from './KeyboardShortcuts';
import FeedbackModal from './FeedbackModal';
import { nodeTypes } from './nodes';
import '@reactflow/core/dist/style.css';
import '@reactflow/controls/dist/style.css';
import '@reactflow/minimap/dist/style.css';

const MindMeshCanvas: React.FC = () => {
  const { theme } = useTheme();
  const { nodes, edges, setNodes, setEdges, undo, redo, canUndo, canRedo, removeNode } = useData();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNodePanelOpen, setIsNodePanelOpen] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAutoFeedback, setShowAutoFeedback] = useState(false);

  // Check if user has already given feedback in this session
  const hasGivenFeedback = localStorage.getItem('mindmesh_feedback_given') === 'true';

  // Auto-feedback timer
  useEffect(() => {
    if (hasGivenFeedback) return; // Don't show if already given feedback

    const timer = setTimeout(() => {
      setShowAutoFeedback(true);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [hasGivenFeedback]);

  const handleFeedbackSubmit = useCallback(() => {
    // Mark that user has given feedback
    localStorage.setItem('mindmesh_feedback_given', 'true');
    setShowAutoFeedback(false);
    setShowFeedbackModal(false);
  }, []);

  const groupSelectedNodes = useCallback(() => {
    if (!reactFlowInstance) return;
    if (selectedNodeIds.length < 2) return;

    const currentNodes = nodes.filter((n) => selectedNodeIds.includes(n.id));
    if (currentNodes.length < 2) return;

    const members = currentNodes.map((n) => n.id);
    const minX = Math.min(...currentNodes.map((n) => n.position.x));
    const minY = Math.min(...currentNodes.map((n) => n.position.y));

    const clusterNode: Node = {
      id: `cluster-${Date.now()}`,
      type: 'cluster',
      position: { x: minX - 40, y: minY - 40 },
      data: { title: 'Group', members, collapsed: false },
    } as unknown as Node;

    setNodes([...nodes, clusterNode]);
  }, [reactFlowInstance, selectedNodeIds, nodes, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges(addEdge({ ...params, animated: true }, edges)),
    [setEdges, edges]
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

      setNodes([...nodes, newNode]);
    },
    [reactFlowInstance, setNodes, nodes]
  );

  const deleteSelectedNodes = useCallback(() => {
    selectedNodeIds.forEach((id) => removeNode(id));
  }, [selectedNodeIds, removeNode]);

  const analyzeSelectedNodes = useCallback(async () => {
    if (selectedNodeIds.length === 0) return;

    // Get selected nodes and their connected nodes
    const selectedNodes = nodes.filter(n => selectedNodeIds.includes(n.id));
    const connectedNodeIds = new Set<string>();

    // Find all nodes connected to selected nodes
    edges.forEach(edge => {
      if (selectedNodeIds.includes(edge.source)) {
        connectedNodeIds.add(edge.target);
      }
      if (selectedNodeIds.includes(edge.target)) {
        connectedNodeIds.add(edge.source);
      }
    });

    const connectedNodes = nodes.filter(n => connectedNodeIds.has(n.id));
    const allRelevantNodes = [...selectedNodes, ...connectedNodes];

    // Create detailed analysis prompt
    const aiPrompt = `You are analyzing a mind map network. Provide a clear, structured analysis without any markdown formatting, bullet points, or special symbols.

CONTEXT:
- Selected nodes: ${selectedNodes.length}
- Connected nodes: ${connectedNodes.length}

SELECTED NODES:
${selectedNodes.map(n => `${n.data?.title || n.type}: ${n.data?.content || 'No content'}`).join(' | ')}

CONNECTED NODES:
${connectedNodes.map(n => `${n.data?.title || n.type}: ${n.data?.content || 'No content'}`).join(' | ')}

ANALYSIS REQUEST:
Provide a natural, flowing analysis that covers:
1. Main themes and concepts present
2. How these nodes relate to each other
3. Key insights or patterns you notice
4. Suggestions for what to explore next

Write in plain text only. No formatting, no symbols, no bullet points. Use natural language that flows well.`;

    const result = await geminiGenerate(aiPrompt);
    if (result) {
      // Clean the result to remove any formatting symbols
      const cleanResult = result
        .replace(/[*#\-_`]/g, '') // Remove markdown symbols
        .replace(/\n\s*[-*+]\s*/g, '\n') // Remove bullet points
        .replace(/\n\s*\d+\.\s*/g, '\n') // Remove numbered lists
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italic
        .replace(/`(.*?)`/g, '$1') // Remove code blocks
        .trim();

      const newNode: Node = {
        id: `ai-analysis-${Date.now()}`,
        type: 'note',
        position: {
          x: Math.min(...allRelevantNodes.map(n => n.position.x)) + 100,
          y: Math.min(...allRelevantNodes.map(n => n.position.y)) + 100,
        },
        data: {
          title: `AI Analysis (${selectedNodes.length} selected, ${connectedNodes.length} connected)`,
          content: cleanResult,
          color: 'yellow',
        },
      } as unknown as Node;
      
      setNodes([...nodes, newNode]);
    }
  }, [selectedNodeIds, nodes, edges, setNodes]);

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
          case 'g':
            if (event.metaKey || event.ctrlKey) {
              event.preventDefault();
              groupSelectedNodes();
            }
            break;
          case 'i':
            if (event.metaKey || event.ctrlKey) {
              event.preventDefault();
              analyzeSelectedNodes();
            }
            break;
          case 'Delete':
          case 'Backspace':
            if (selectedNodeIds.length > 0) {
              event.preventDefault();
              deleteSelectedNodes();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, groupSelectedNodes, deleteSelectedNodes, selectedNodeIds, analyzeSelectedNodes]);

  interface ClusterData { members: string[]; collapsed: boolean; title: string; }

  const handleNodeDragStop = useCallback((_event: React.MouseEvent, node: Node) => {
    if (node.type === 'cluster' && (node.data as ClusterData)?.members) {
      const members = (node.data as ClusterData).members;
      const prev = nodes.find((n) => n.id === node.id);
      if (!prev) return;
      const deltaX = node.position.x - prev.position.x;
      const deltaY = node.position.y - prev.position.y;
      if (deltaX === 0 && deltaY === 0) return;

      const updated = nodes.map((n) =>
        members.includes(n.id)
          ? { ...n, position: { x: n.position.x + deltaX, y: n.position.y + deltaY } }
          : n
      );
      setNodes(updated);
    }
  }, [nodes, setNodes]);

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
          onNodesChange={(changes) => setNodes(applyNodeChanges(changes, nodes))}
          onEdgesChange={(changes) => setEdges(applyEdgeChanges(changes, edges))}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onSelectionChange={(sel) => setSelectedNodeIds(sel.nodes.map((n) => n.id))}
          onNodeDragStop={handleNodeDragStop}
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
        onToggleGrid={() => setSnapToGrid(!snapToGrid)}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onGroup={groupSelectedNodes}
        canGroup={selectedNodeIds.length > 1}
        onDelete={deleteSelectedNodes}
        canDelete={selectedNodeIds.length > 0}
        onAi={analyzeSelectedNodes}
        onFeedback={() => setShowFeedbackModal(true)}
        onForms={() => {}}
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

      <FeedbackModal 
        isOpen={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit}
      />

      {/* Auto Feedback Prompt */}
      {showAutoFeedback && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💬</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  How's MindMesh working for you?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  We'd love to hear your feedback!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowAutoFeedback(false);
                      setShowFeedbackModal(true);
                    }}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Give Feedback
                  </button>
                  <button
                    onClick={() => {
                      setShowAutoFeedback(false);
                      localStorage.setItem('mindmesh_feedback_given', 'true');
                    }}
                    className="px-3 py-1.5 text-gray-500 text-sm hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAutoFeedback(false);
                  localStorage.setItem('mindmesh_feedback_given', 'true');
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MindMeshCanvas;