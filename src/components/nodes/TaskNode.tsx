import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@reactflow/core';
import { motion } from 'framer-motion';
import { Plus, X, Clock } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskData {
  title: string;
  tasks: TaskItem[];
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'doing' | 'done';
  dueTime?: string;
  color: string;
}

const TaskNode: React.FC<NodeProps<TaskData>> = ({ data, id, selected }) => {
  const [title, setTitle] = useState(data.title || 'Task List');
  const [tasks, setTasks] = useState<TaskItem[]>(data.tasks || []);
  const [newTask, setNewTask] = useState('');
  const { updateNode } = useData();

  const handleSave = useCallback(() => {
    updateNode(id, {
      data: { ...data, title, tasks }
    });
  }, [id, data, title, tasks, updateNode]);

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskItem: TaskItem = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false
      };
      setTasks([...tasks, newTaskItem]);
      setNewTask('');
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const updateStatus = (newStatus: TaskData['status']) => {
    updateNode(id, {
      data: { ...data, status: newStatus }
    });
  };

  const updatePriority = (newPriority: TaskData['priority']) => {
    updateNode(id, {
      data: { ...data, priority: newPriority }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'doing': return 'text-blue-600 bg-blue-100';
      case 'done': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  React.useEffect(() => {
    handleSave();
  }, [tasks]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`
        min-w-[320px] max-w-[420px] border-2 border-green-300 bg-green-50 rounded-lg p-4 shadow-lg glass node-glow-green
        ${selected ? 'ring-2 ring-green-400' : ''}
      `}
    >
      <Handle type="target" position={Position.Top} />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-lg">✅</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            className="font-semibold bg-transparent border-b border-gray-300 outline-none flex-1"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <select
          value={data.status}
          onChange={(e) => updateStatus(e.target.value as TaskData['status'])}
          className={`text-xs px-2 py-1 rounded-full border-none outline-none ${getStatusColor(data.status)}`}
        >
          <option value="todo">Todo</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>

        <select
          value={data.priority}
          onChange={(e) => updatePriority(e.target.value as TaskData['priority'])}
          className={`text-xs px-2 py-1 rounded-full border-none outline-none ${getPriorityColor(data.priority)}`}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 group"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="w-4 h-4 text-green-600 rounded"
            />
            <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.text}
            </span>
            <button
              onClick={() => removeTask(task.id)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
            >
              <X size={14} className="text-red-500" />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add new task..."
          className="flex-1 text-sm bg-white bg-opacity-50 border border-gray-300 rounded px-2 py-1 outline-none"
        />
        <button
          onClick={addTask}
          className="p-1 bg-green-200 hover:bg-green-300 rounded transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </motion.div>
  );
};

export default TaskNode;