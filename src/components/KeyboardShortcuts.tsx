import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';

const KeyboardShortcuts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: 'Cmd + N', description: 'Add new node' },
    { key: 'Cmd + Shift + F', description: 'Open search' },
    { key: 'Cmd + Z', description: 'Undo' },
    { key: 'Cmd + Shift + Z', description: 'Redo' },
    { key: 'Cmd + G', description: 'Group selected nodes' },
    { key: 'Cmd + E', description: 'Export data' },
    { key: 'Cmd + /', description: 'Show shortcuts' },
    { key: 'Del / ⌫', description: 'Delete selected nodes' },
    { key: 'Cmd + I', description: 'AI analyze selected' },
    { key: 'Space + Drag', description: 'Pan canvas' },
    { key: 'Mouse Wheel', description: 'Zoom in/out' },
  ];

  // Listen for Cmd+/ to open shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === '/') {
        event.preventDefault();
        setIsOpen(!isOpen);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors z-40"
        title="Keyboard shortcuts (Cmd + /)"
      >
        <Keyboard size={20} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 glass glass-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Keyboard size={20} />
                  Keyboard Shortcuts
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4">
                <div className="space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {shortcut.description}
                      </span>
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded font-mono">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 Tip: You can also drag node types from the add panel directly onto the canvas!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardShortcuts;