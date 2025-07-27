import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, X, MapPin } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Node } from '@reactflow/core';
import { useReactFlow } from '@reactflow/core';

interface SearchPanelProps {
  onClose: () => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Node[]>([]);
  const { searchNodes } = useData();
  const { fitView, getNode } = useReactFlow();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const searchResults = searchNodes(query);
    setResults(searchResults);
  }, [query, searchNodes]);

  const handleNodeClick = (node: Node) => {
    // Focus on the clicked node
    fitView({
      nodes: [node],
      duration: 800,
      padding: 0.3
    });
    onClose();
  };

  const getNodeTypeColor = (type: string | undefined) => {
    switch (type) {
      case 'note': return 'text-blue-600';
      case 'task': return 'text-green-600';
      case 'schedule': return 'text-purple-600';
      case 'goal': return 'text-yellow-600';
      case 'routine': return 'text-pink-600';
      case 'idea': return 'text-cyan-600';
      case 'link': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getNodeTypeIcon = (type: string | undefined) => {
    switch (type) {
      case 'note': return '📝';
      case 'task': return '✅';
      case 'schedule': return '📅';
      case 'goal': return '🎯';
      case 'routine': return '🌀';
      case 'idea': return '💡';
      case 'link': return '🔗';
      default: return '📄';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 glass glass-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Search className="text-gray-400" size={20} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across all nodes..."
              className="flex-1 bg-transparent border-none outline-none text-lg placeholder-gray-400"
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {results.length === 0 && query.trim() && (
            <div className="p-8 text-center text-gray-500">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p>No nodes found matching "{query}"</p>
            </div>
          )}

          {results.length === 0 && !query.trim() && (
            <div className="p-8 text-center text-gray-500">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p>Start typing to search your nodes...</p>
            </div>
          )}

          {results.map((node) => (
            <motion.div
              key={node.id}
              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
              className="p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer"
              onClick={() => handleNodeClick(node)}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getNodeTypeIcon(node.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{node.data?.title || 'Untitled'}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getNodeTypeColor(node.type)} bg-opacity-10`}>
                      {node.type}
                    </span>
                  </div>
                  {node.data?.content && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {node.data.content}
                    </p>
                  )}
                </div>
                <MapPin size={16} className="text-gray-400 mt-1" />
              </div>
            </motion.div>
          ))}
        </div>

        {query.trim() && results.length > 0 && (
          <div className="p-3 bg-gray-50 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-400 text-center">
            Found {results.length} node{results.length !== 1 ? 's' : ''}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SearchPanel;