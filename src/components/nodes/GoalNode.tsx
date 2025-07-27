import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@reactflow/core';
import { motion } from 'framer-motion';
import { Target, Plus, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface SubGoal {
  id: string;
  text: string;
  completed: boolean;
}

interface GoalData {
  title: string;
  description: string;
  progress: number;
  subGoals: SubGoal[];
  isCollapsed: boolean;
  color: string;
}

const GoalNode: React.FC<NodeProps<GoalData>> = ({ data, id, selected }) => {
  const [title, setTitle] = useState(data.title || 'Goal');
  const [description, setDescription] = useState(data.description || '');
  const [subGoals, setSubGoals] = useState<SubGoal[]>(data.subGoals || []);
  const [newSubGoal, setNewSubGoal] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(data.isCollapsed || false);
  const { updateNode } = useData();

  const handleSave = useCallback(() => {
    const completedCount = subGoals.filter(sg => sg.completed).length;
    const progress = subGoals.length > 0 ? (completedCount / subGoals.length) * 100 : 0;
    
    updateNode(id, {
      data: { ...data, title, description, subGoals, progress, isCollapsed }
    });
  }, [id, data, title, description, subGoals, isCollapsed, updateNode]);

  const addSubGoal = () => {
    if (newSubGoal.trim()) {
      const newGoal: SubGoal = {
        id: Date.now().toString(),
        text: newSubGoal.trim(),
        completed: false
      };
      setSubGoals([...subGoals, newGoal]);
      setNewSubGoal('');
    }
  };

  const toggleSubGoal = (subGoalId: string) => {
    setSubGoals(subGoals.map(sg =>
      sg.id === subGoalId ? { ...sg, completed: !sg.completed } : sg
    ));
  };

  const removeSubGoal = (subGoalId: string) => {
    setSubGoals(subGoals.filter(sg => sg.id !== subGoalId));
  };

  const completedCount = subGoals.filter(sg => sg.completed).length;
  const progress = subGoals.length > 0 ? (completedCount / subGoals.length) * 100 : 0;

  React.useEffect(() => {
    handleSave();
  }, [subGoals]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`
        min-w-[320px] max-w-[400px] border-2 border-yellow-300 bg-yellow-50 rounded-lg p-4 shadow-lg glass node-glow-yellow
        ${selected ? 'ring-2 ring-yellow-400' : ''}
      `}
    >
      <Handle type="target" position={Position.Top} />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-lg">🎯</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            className="font-semibold bg-transparent border-b border-gray-300 outline-none flex-1"
          />
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-yellow-200 rounded transition-colors"
        >
          {isCollapsed ? '▶' : '▼'}
        </button>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
          />
        </div>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={handleSave}
        placeholder="Describe your goal..."
        className="w-full bg-white bg-opacity-50 border border-gray-300 rounded px-2 py-1 text-sm outline-none resize-none mb-3"
        rows={2}
      />

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
              {subGoals.map((subGoal) => (
                <motion.div
                  key={subGoal.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 group"
                >
                  <input
                    type="checkbox"
                    checked={subGoal.completed}
                    onChange={() => toggleSubGoal(subGoal.id)}
                    className="w-4 h-4 text-yellow-600 rounded"
                  />
                  <span className={`flex-1 text-sm ${subGoal.completed ? 'line-through text-gray-500' : ''}`}>
                    {subGoal.text}
                  </span>
                  <button
                    onClick={() => removeSubGoal(subGoal.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                  >
                    <X size={14} className="text-red-500" />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={newSubGoal}
                onChange={(e) => setNewSubGoal(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSubGoal()}
                placeholder="Add sub-goal..."
                className="flex-1 text-sm bg-white bg-opacity-50 border border-gray-300 rounded px-2 py-1 outline-none"
              />
              <button
                onClick={addSubGoal}
                className="p-1 bg-yellow-200 hover:bg-yellow-300 rounded transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Handle type="source" position={Position.Bottom} />
    </motion.div>
  );
};

export default GoalNode;