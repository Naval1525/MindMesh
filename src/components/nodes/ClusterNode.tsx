import React from 'react';
import { Handle, Position, NodeProps } from '@reactflow/core';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface ClusterData {
  title: string;
  members: string[];
  collapsed: boolean;
}

const ClusterNode: React.FC<NodeProps<ClusterData>> = ({ id, data, selected }) => {
  const { updateNode, setNodes, nodes } = useData();

  const toggleCollapse = () => {
    const newCollapsed = !data.collapsed;
    // Update cluster collapsed state
    updateNode(id, { data: { ...data, collapsed: newCollapsed } });

    // Hide or show member nodes
    const updatedNodes = nodes.map((n) =>
      data.members.includes(n.id) ? { ...n, hidden: newCollapsed } : n
    );
    setNodes(updatedNodes);
  };

  return (
    <div
      
      className={`min-w-[220px] border-2 rounded-lg p-3 shadow-xl glass bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-600 select-none cursor-move ${
        selected ? 'ring-2 ring-blue-400' : ''
      }`}
    >
      <Handle type="target" position={Position.Top} />

      <div
        className="flex items-center justify-between mb-1 cursor-pointer"
        onClick={toggleCollapse}
      >
        <span className="font-bold text-lg text-gray-800 dark:text-white">
          {data.title || 'Group'} ({data.members.length})
        </span>
        {data.collapsed ? (
          <ChevronRight size={20} className="text-blue-600 dark:text-blue-400" />
        ) : (
          <ChevronDown size={20} className="text-blue-600 dark:text-blue-400" />
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default ClusterNode; 
