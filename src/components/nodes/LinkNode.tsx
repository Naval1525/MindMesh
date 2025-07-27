import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@reactflow/core';
import { motion } from 'framer-motion';
import { ExternalLink, Globe, Eye } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface LinkData {
  title: string;
  url: string;
  description: string;
  favicon?: string;
  color: string;
}

const LinkNode: React.FC<NodeProps<LinkData>> = ({ data, id, selected }) => {
  const [title, setTitle] = useState(data.title || 'Link');
  const [url, setUrl] = useState(data.url || '');
  const [description, setDescription] = useState(data.description || '');
  const { updateNode } = useData();

  const handleSave = useCallback(() => {
    updateNode(id, {
      data: { ...data, title, url, description }
    });
  }, [id, data, title, url, description, updateNode]);

  const openLink = () => {
    if (url) {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  const faviconUrl = url ? getFaviconUrl(url) : null;

  const isValidUrl = (url: string) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`
        min-w-[300px] max-w-[380px] border-2 border-red-300 bg-red-50 rounded-lg p-4 shadow-lg glass
        ${selected ? 'ring-2 ring-red-400' : ''}
      `}
      style={{ boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)' }}
    >
      <Handle type="target" position={Position.Top} />
      
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🔗</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          className="font-semibold bg-transparent border-b border-gray-300 outline-none flex-1"
        />
        {isValidUrl(url) && (
          <button
            onClick={openLink}
            className="p-1 hover:bg-red-200 rounded transition-colors"
            title="Open link"
          >
            <ExternalLink size={16} />
          </button>
        )}
      </div>

      <div className="mb-3">
        <label className="text-xs text-gray-600 block mb-1">URL</label>
        <div className="flex items-center gap-2">
          {faviconUrl ? (
            <img 
              src={faviconUrl} 
              alt="Favicon" 
              className="w-4 h-4" 
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <Globe size={14} className="text-gray-400" />
          )}
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={handleSave}
            placeholder="https://example.com"
            className="flex-1 bg-white bg-opacity-50 border border-gray-300 rounded px-2 py-1 text-sm outline-none"
          />
        </div>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={handleSave}
        placeholder="Why is this link useful?"
        className="w-full bg-white bg-opacity-50 border border-gray-300 rounded px-2 py-1 text-sm outline-none resize-none mb-3"
        rows={3}
      />

      {isValidUrl(url) && (
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Eye size={12} />
            <span>Click to preview</span>
          </div>
          <span className="truncate max-w-[150px]">
            {url.replace(/^https?:\/\//, '')}
          </span>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </motion.div>
  );
};

export default LinkNode;