import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@reactflow/core';
import { motion } from 'framer-motion';
import { Lightbulb, Tag, Plus, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface IdeaData {
  title: string;
  content: string;
  tags: string[];
  inspiration: string;
  color: string;
}

const IdeaNode: React.FC<NodeProps<IdeaData>> = ({ data, id, selected }) => {
  const [title, setTitle] = useState(data.title || 'Idea');
  const [content, setContent] = useState(data.content || '');
  const [tags, setTags] = useState<string[]>(data.tags || []);
  const [inspiration, setInspiration] = useState(data.inspiration || '');
  const [newTag, setNewTag] = useState('');
  const { updateNode } = useData();

  const handleSave = useCallback(() => {
    updateNode(id, {
      data: { ...data, title, content, tags, inspiration }
    });
  }, [id, data, title, content, tags, inspiration, updateNode]);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  React.useEffect(() => {
    handleSave();
  }, [tags]);

  const tagColors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-yellow-100 text-yellow-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
  ];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`
        min-w-[320px] max-w-[400px] border-2 border-cyan-300 bg-cyan-50 rounded-lg p-4 shadow-lg glass
        ${selected ? 'ring-2 ring-cyan-400' : ''}
      `}
      style={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}
    >
      <Handle type="target" position={Position.Top} />
      
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">💡</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          className="font-semibold bg-transparent border-b border-gray-300 outline-none flex-1"
        />
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleSave}
        placeholder="Capture your brilliant idea..."
        className="w-full bg-white bg-opacity-50 border border-gray-300 rounded px-2 py-1 text-sm outline-none resize-none mb-3"
        rows={4}
      />

      <div className="mb-3">
        <label className="text-xs text-gray-600 block mb-1">Inspiration Source</label>
        <input
          value={inspiration}
          onChange={(e) => setInspiration(e.target.value)}
          onBlur={handleSave}
          placeholder="Where did this idea come from?"
          className="w-full bg-white bg-opacity-50 border border-gray-300 rounded px-2 py-1 text-sm outline-none"
        />
      </div>

      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Tag size={14} className="text-gray-600" />
          <span className="text-xs text-gray-600">Tags</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((tag, index) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                tagColors[index % tagColors.length]
              }`}
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
              >
                <X size={10} />
              </button>
            </motion.span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
            placeholder="Add tag..."
            className="flex-1 text-xs bg-white bg-opacity-50 border border-gray-300 rounded px-2 py-1 outline-none"
          />
          <button
            onClick={addTag}
            className="p-1 bg-cyan-200 hover:bg-cyan-300 rounded transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </motion.div>
  );
};

export default IdeaNode;