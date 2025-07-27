import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface NodeTypePanelProps {
  onClose: () => void;
}

const NodeTypePanel: React.FC<NodeTypePanelProps> = ({ onClose }) => {
  const nodeTypes = [
    { type: 'note', icon: '📝', title: 'Note', description: 'Text notes with markdown support' },
    { type: 'task', icon: '✅', title: 'Task', description: 'Todo items with priorities and status' },
    { type: 'schedule', icon: '📅', title: 'Schedule', description: 'Time blocks for planning' },
    { type: 'goal', icon: '🎯', title: 'Goal', description: 'Goals with progress tracking' },
    { type: 'routine', icon: '🌀', title: 'Routine', description: 'Repeating activities and habits' },
    { type: 'idea', icon: '💡', title: 'Idea', description: 'Creative thoughts and inspiration' },
    { type: 'link', icon: '🔗', title: 'Link', description: 'External resources and websites' },
  ];

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
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
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 glass glass-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add New Node</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Drag a node type to the canvas to create it
          </p>
          
          <div className="grid grid-cols-1 gap-2">
            {nodeTypes.map((nodeType) => (
              <motion.div
                key={nodeType.type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                draggable
                onDragStart={(event) => onDragStart(event, nodeType.type)}
                className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-move hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{nodeType.icon}</span>
                  <div>
                    <h3 className="font-medium">{nodeType.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {nodeType.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NodeTypePanel;