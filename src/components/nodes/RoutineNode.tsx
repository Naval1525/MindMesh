import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@reactflow/core';
import { motion } from 'framer-motion';
import { Repeat, Clock } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface RoutineData {
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  duration: string;
  category: string;
  color: string;
}

const RoutineNode: React.FC<NodeProps<RoutineData>> = ({ data, id, selected }) => {
  const [title, setTitle] = useState(data.title || 'Routine');
  const [description, setDescription] = useState(data.description || '');
  const [frequency, setFrequency] = useState(data.frequency || 'daily');
  const [time, setTime] = useState(data.time || '07:00');
  const [duration, setDuration] = useState(data.duration || '30');
  const [category, setCategory] = useState(data.category || 'health');
  const { updateNode } = useData();

  const handleSave = useCallback(() => {
    updateNode(id, {
      data: { ...data, title, description, frequency, time, duration, category }
    });
  }, [id, data, title, description, frequency, time, duration, category, updateNode]);

  const frequencies = [
    { value: 'daily', label: 'Daily', icon: '📅' },
    { value: 'weekly', label: 'Weekly', icon: '📊' },
    { value: 'monthly', label: 'Monthly', icon: '🗓️' },
  ];

  const categories = [
    { value: 'health', label: 'Health', color: 'bg-red-100 text-red-800' },
    { value: 'work', label: 'Work', color: 'bg-blue-100 text-blue-800' },
    { value: 'personal', label: 'Personal', color: 'bg-green-100 text-green-800' },
    { value: 'learning', label: 'Learning', color: 'bg-purple-100 text-purple-800' },
    { value: 'creative', label: 'Creative', color: 'bg-pink-100 text-pink-800' },
  ];

  const currentFreq = frequencies.find(f => f.value === frequency) || frequencies[0];
  const currentCategory = categories.find(c => c.value === category) || categories[0];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`
        min-w-[320px] max-w-[380px] border-2 border-pink-300 bg-pink-50 rounded-lg p-4 shadow-lg glass node-glow-pink
        ${selected ? 'ring-2 ring-pink-400' : ''}
      `}
    >
      <Handle type="target" position={Position.Top} />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-lg">🌀</span>
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
          <label className="text-xs text-gray-600 block mb-1">Frequency</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as RoutineData['frequency'])}
            onBlur={handleSave}
            className="w-full bg-white bg-opacity-50 border border-gray-300 rounded px-2 py-1 text-sm outline-none"
          >
            {frequencies.map(freq => (
              <option key={freq.value} value={freq.value}>
                {freq.icon} {freq.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="text-xs text-gray-600 block mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onBlur={handleSave}
            className="w-full bg-white bg-opacity-50 border border-gray-300 rounded px-2 py-1 text-sm outline-none"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs text-gray-600 block mb-1">Start Time</label>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gray-400" />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              onBlur={handleSave}
              className="bg-white bg-opacity-50 border border-gray-300 rounded px-2 py-1 text-sm outline-none"
            />
          </div>
        </div>
        
        <div>
          <label className="text-xs text-gray-600 block mb-1">Duration (min)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            onBlur={handleSave}
            min="5"
            max="480"
            className="w-full bg-white bg-opacity-50 border border-gray-300 rounded px-2 py-1 text-sm outline-none"
          />
        </div>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={handleSave}
        placeholder="Describe your routine..."
        className="w-full bg-white bg-opacity-50 border border-gray-300 rounded px-2 py-1 text-sm outline-none resize-none"
        rows={3}
      />

      <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
        <Repeat size={12} />
        <span>
          {currentFreq.label} at {time} for {duration} minutes
        </span>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </motion.div>
  );
};

export default RoutineNode;