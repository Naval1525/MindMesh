import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Node as FlowNode } from '@reactflow/core';
import { useData } from '../contexts/DataContext';

interface NodeTypePanelProps {
  onClose: () => void;
}

const NodeTypePanel: React.FC<NodeTypePanelProps> = ({ onClose }) => {
  const { setNodes, nodes } = useData();

  const nodeTypes = [
    { type: 'note', icon: '📝', title: 'Note', description: 'Text notes with markdown support' },
    { type: 'task', icon: '✅', title: 'Task', description: 'Todo items with priorities and status' },
    { type: 'schedule', icon: '📅', title: 'Schedule', description: 'Time blocks for planning' },
    { type: 'goal', icon: '🎯', title: 'Goal', description: 'Goals with progress tracking' },
    { type: 'routine', icon: '🌀', title: 'Routine', description: 'Repeating activities and habits' },
    { type: 'idea', icon: '💡', title: 'Idea', description: 'Creative thoughts and inspiration' },
    { type: 'link', icon: '🔗', title: 'Link', description: 'External resources and websites' },
    // Diagram shapes
    { type: 'rect', icon: '⬛', title: 'Rectangle', description: 'Basic rectangle shape' },
    { type: 'circle', icon: '⚪', title: 'Circle', description: 'Basic circle shape' },
    { type: 'diamond', icon: '🔷', title: 'Diamond', description: 'Decision diamond shape' },
    { type: 'server', icon: '🖥️', title: 'Server', description: 'Server node' },
    { type: 'database', icon: '🗄️', title: 'Database', description: 'Database node' },
    { type: 'cloud', icon: '☁️', title: 'Cloud', description: 'Cloud service node' },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragStart = (event: any, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleNodeClick = (nodeType: string) => {
    // Define default data based on node type
    let defaultData: { title: string; content: string; color: string } = {
      title: `New ${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}`,
      content: '',
      color: 'blue'
    };

    // Special handling for diagram nodes
    if (['rect', 'circle', 'diamond', 'server', 'database', 'cloud'].includes(nodeType)) {
      const diagramDefaults: Record<string, { title: string; content: string; color: string }> = {
        rect: { title: 'Component', content: 'System component', color: '#3b82f6' },
        circle: { title: 'Process', content: '', color: '#8b5cf6' },
        diamond: { title: 'Decision', content: '', color: '#f59e0b' },
        server: { title: 'Server', content: '', color: '#10b981' },
        database: { title: 'Database', content: '', color: '#ef4444' },
        cloud: { title: 'Cloud Service', content: '', color: '#06b6d4' }
      };
      defaultData = diagramDefaults[nodeType];
    }

    const newNode: FlowNode = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: defaultData,
    };

    setNodes([...nodes, newNode]);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm mx-4 glass glass-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Add New Node</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Click or drag a node type to create it
          </p>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {/* Regular Nodes */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Mind Map Nodes</h3>
              <div className="grid grid-cols-1 gap-2">
                {nodeTypes.slice(0, 7).map((nodeType) => (
                  <motion.div
                    key={nodeType.type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    draggable
                    onDragStart={(event) => handleDragStart(event, nodeType.type)}
                    onClick={() => handleNodeClick(nodeType.type)}
                    className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl text-gray-800 dark:text-gray-200">{nodeType.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{nodeType.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {nodeType.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Architecture Diagram Nodes */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Architecture Shapes</h3>
              <div className="grid grid-cols-1 gap-2">
                {nodeTypes.slice(7).map((nodeType) => (
                  <motion.div
                    key={nodeType.type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    draggable
                    onDragStart={(event) => handleDragStart(event, nodeType.type)}
                    onClick={() => handleNodeClick(nodeType.type)}
                    className="p-3 border border-blue-200 dark:border-blue-600 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors bg-blue-50/50 dark:bg-blue-900/10"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl text-blue-600 dark:text-blue-400">{nodeType.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{nodeType.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {nodeType.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NodeTypePanel;