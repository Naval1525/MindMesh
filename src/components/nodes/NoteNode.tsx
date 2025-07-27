import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@reactflow/core';
import { motion } from 'framer-motion';
import { Edit3, Eye, Palette } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useData } from '../../contexts/DataContext';

interface NoteData {
  title: string;
  content: string;
  color: string;
}

const NoteNode: React.FC<NodeProps<NoteData>> = ({ data, id, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title || 'Note');
  const [content, setContent] = useState(data.content || '');
  const [showPreview, setShowPreview] = useState(false);
  const { updateNode } = useData();

  const handleSave = useCallback(() => {
    updateNode(id, { data: { ...data, title, content } });
    setIsEditing(false);
  }, [id, data, title, content, updateNode]);

  const colors = ['blue', 'green', 'purple', 'orange', 'pink', 'yellow'];
  const colorClasses = {
    blue: 'border-blue-300 bg-blue-50 node-glow',
    green: 'border-green-300 bg-green-50 node-glow-green',
    purple: 'border-purple-300 bg-purple-50 node-glow-purple',
    orange: 'border-orange-300 bg-orange-50 node-glow-orange',
    pink: 'border-pink-300 bg-pink-50 node-glow-pink',
    yellow: 'border-yellow-300 bg-yellow-50 node-glow-yellow',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`
        min-w-[280px] max-w-[400px] border-2 rounded-lg p-4 shadow-lg glass
        ${colorClasses[data.color as keyof typeof colorClasses] || colorClasses.blue}
        ${selected ? 'ring-2 ring-blue-400' : ''}
      `}
    >
      <Handle type="target" position={Position.Top} />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📝</span>
          {isEditing ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-semibold bg-transparent border-b border-gray-300 outline-none"
              onBlur={handleSave}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          ) : (
            <h3 
              className="font-semibold cursor-pointer hover:text-blue-600"
              onClick={() => setIsEditing(true)}
            >
              {title}
            </h3>
          )}
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-1 hover:bg-white hover:bg-opacity-50 rounded"
            title="Toggle preview"
          >
            {showPreview ? <Edit3 size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      <div className="min-h-[120px]">
        {showPreview && content ? (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleSave}
            placeholder="Write your note here... (Markdown supported)"
            className="w-full h-full min-h-[120px] bg-transparent border-none outline-none resize-none text-sm"
          />
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </motion.div>
  );
};

export default NoteNode;