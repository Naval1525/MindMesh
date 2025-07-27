import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Grid3X3, 
  Download, 
  Upload, 
  Undo2, 
  Redo2,
  Palette,
  FileDown
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';

interface FloatingToolbarProps {
  onAddNode: () => void;
  onSearch: () => void;
  snapToGrid: boolean;
  onToggleSnap: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  onAddNode,
  onSearch,
  snapToGrid,
  onToggleSnap,
  canUndo,
  canRedo,
  onUndo,
  onRedo
}) => {
  const { theme, toggleTheme } = useTheme();
  const { exportData } = useData();

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          // This would be handled by DataContext
          console.log('Import data:', content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark': return '🌙';
      case 'neon': return '⚡';
      default: return '☀️';
    }
  };

  const toolbarItems = [
    { icon: Plus, onClick: onAddNode, label: 'Add Node (Cmd+N)', color: 'blue' },
    { icon: Search, onClick: onSearch, label: 'Search (Cmd+Shift+F)', color: 'green' },
    { icon: Grid3X3, onClick: onToggleSnap, label: 'Toggle Snap to Grid', color: snapToGrid ? 'purple' : 'gray' },
    { icon: Undo2, onClick: onUndo, label: 'Undo (Cmd+Z)', color: 'orange', disabled: !canUndo },
    { icon: Redo2, onClick: onRedo, label: 'Redo (Cmd+Shift+Z)', color: 'orange', disabled: !canRedo },
    { icon: FileDown, onClick: exportData, label: 'Export Data (Cmd+E)', color: 'indigo' },
    { icon: Upload, onClick: handleImport, label: 'Import Data', color: 'indigo' },
  ];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-2 p-2 glass glass-border rounded-full shadow-lg">
        {toolbarItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={item.onClick}
              disabled={item.disabled}
              className={`
                p-3 rounded-full transition-all duration-200
                ${item.disabled 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : `bg-${item.color}-100 hover:bg-${item.color}-200 text-${item.color}-600 hover:text-${item.color}-700`
                }
                ${theme === 'dark' && !item.disabled ? 'bg-opacity-20 hover:bg-opacity-30' : ''}
                ${theme === 'neon' && !item.disabled ? 'bg-opacity-30 hover:bg-opacity-40' : ''}
              `}
              title={item.label}
            >
              <Icon size={18} />
            </motion.button>
          );
        })}
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className={`
            p-3 rounded-full transition-all duration-200 text-lg
            ${theme === 'dark' ? 'bg-yellow-100 bg-opacity-20 hover:bg-opacity-30' : 
              theme === 'neon' ? 'bg-blue-100 bg-opacity-30 hover:bg-opacity-40' :
              'bg-gray-100 hover:bg-gray-200'
            }
          `}
          title="Toggle Theme"
        >
          {getThemeIcon()}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FloatingToolbar;