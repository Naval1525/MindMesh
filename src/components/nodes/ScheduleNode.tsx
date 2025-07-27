import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@reactflow/core';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface ScheduleData {
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  category: string;
  color: string;
}

const ScheduleNode: React.FC<NodeProps<ScheduleData>> = ({ data, id, selected }) => {
  const [title, setTitle] = useState(data.title || 'Schedule Block');
  const [startTime, setStartTime] = useState(data.startTime || '09:00');
  const [endTime, setEndTime] = useState(data.endTime || '10:00');
  const [description, setDescription] = useState(data.description || '');
  const [category, setCategory] = useState(data.category || 'work');
  const { updateNode } = useData();

  const handleSave = useCallback(() => {
    updateNode(id, {
      data: { ...data, title, startTime, endTime, description, category }
    });
  }, [id, data, title, startTime, endTime, description, category, updateNode]);

  const categories = [
    { value: 'work', label: 'Work', color: 'bg-blue-100 text-blue-800' },
    { value: 'personal', label: 'Personal', color: 'bg-green-100 text-green-800' },
    { value: 'health', label: 'Health', color: 'bg-red-100 text-red-800' },
    { value: 'learning', label: 'Learning', color: 'bg-purple-100 text-purple-800' },
    { value: 'social', label: 'Social', color: 'bg-pink-100 text-pink-800' },
  ];

  const currentCategory = categories.find(c => c.value === category) || categories[0];

  const calculateDuration = () => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours > 0 ? `${diffHours.toFixed(1)}h` : '0h';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`
        min-w-[300px] max-w-[380px] border-2 border-purple-300 bg-purple-50 rounded-lg p-4 shadow-lg glass node-glow-purple
        ${selected ? 'ring-2 ring-purple-400' : ''}
      `}
    >
      <Handle type="target" position={Position.Top} />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-lg">📅</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            className="font-semibold bg-transparent border-b border-gray-300 outline-none flex-1"
          />
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${currentCategory.color}`}>
          {currentCategory.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs text-gray-600 block mb-1">Start Time</label>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gray-400" />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              onBlur={handleSave}
              className="bg-white bg-opacity-50 border border-gray-300 rounded px-2 py-1 text-sm outline-none"
            />
          </div>
        </div>
        
        <div>
          <label className="text-xs text-gray-600 block mb-1">End Time</label>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gray-400" />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              onBlur={handleSave}
              className="bg-white bg-opacity-50 border border-gray-300 rounded px-2 py-1 text-sm outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Duration: {calculateDuration()}</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onBlur={handleSave}
            className="text-xs bg-transparent border-none outline-none"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={handleSave}
        placeholder="Add description or notes..."
        className="w-full bg-white bg-opacity-50 border border-gray-300 rounded px-2 py-1 text-sm outline-none resize-none"
        rows={3}
      />

      <Handle type="source" position={Position.Bottom} />
    </motion.div>
  );
};

export default ScheduleNode;