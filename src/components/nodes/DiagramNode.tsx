import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@reactflow/core';

interface DiagramData {
  title: string;
  content?: string;
  color?: string;
}

const baseClasses = 'flex items-center justify-center text-xs font-semibold shadow-md select-none min-w-[120px] min-h-[60px] p-2 border-2 border-gray-300 dark:border-gray-600';

const DiagramNode: React.FC<NodeProps<DiagramData>> = ({ data, type, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title || 'New Shape');
  const [content, setContent] = useState(data.content || '');

  const shapeStyles: Record<string, string> = {
    rect: 'rounded-md',
    circle: 'rounded-full w-24 h-24',
    diamond: 'w-28 h-28 transform rotate-45',
    server: 'rounded-sm',
    database: 'rounded-t-full rounded-b-full',
    cloud: 'rounded-full',
  };

  const bgColor = data.color || '#ffffff';
  const textColor = '#ffffff'; // Always white text for better visibility
  const shapeClass = shapeStyles[type] || shapeStyles.rect;

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Update the node data
    data.title = title;
    data.content = content;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setTitle(data.title || 'New Shape');
      setContent(data.content || '');
    }
  };

  // Special handling for diamond shape
  if (type === 'diamond') {
    return (
      <div 
        className={`relative ${selected ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
      >
        {/* Top handle */}
        <Handle 
          type="target" 
          position={Position.Top} 
          className="w-3 h-3 bg-blue-500 border-2 border-white"
          style={{ top: '-6px', left: '50%', transform: 'translateX(-50%)' }}
        />
        
        {/* Left handle */}
        <Handle 
          type="target" 
          position={Position.Left} 
          className="w-3 h-3 bg-blue-500 border-2 border-white"
          style={{ left: '-6px', top: '50%', transform: 'translateY(-50%)' }}
        />
        
        {/* Right handle */}
        <Handle 
          type="source" 
          position={Position.Right} 
          className="w-3 h-3 bg-blue-500 border-2 border-white"
          style={{ right: '-6px', top: '50%', transform: 'translateY(-50%)' }}
        />
        
        {/* Bottom handle */}
        <Handle 
          type="source" 
          position={Position.Bottom} 
          className="w-3 h-3 bg-blue-500 border-2 border-white"
          style={{ bottom: '-6px', left: '50%', transform: 'translateX(-50%)' }}
        />
        
        <div
          className={`${baseClasses} ${shapeClass} cursor-pointer transition-all duration-200 hover:shadow-lg border-2 border-gray-400`}
          style={{ 
            background: bgColor,
            color: textColor,
          }}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <div className="w-full h-full flex flex-col gap-1 justify-center items-center" style={{ transform: 'rotate(-45deg)' }}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                className="w-full text-sm font-semibold bg-transparent border-none outline-none text-center"
                style={{ color: textColor }}
                autoFocus
              />
            </div>
          ) : (
            <div className="text-center flex items-center justify-center h-full" style={{ transform: 'rotate(-45deg)' }}>
              <div className="font-semibold text-sm px-2">{title}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative ${selected ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
    >
      <Handle type="target" position={Position.Top} />
      
      <div
        className={`${baseClasses} ${shapeClass} cursor-pointer transition-all duration-200 hover:shadow-lg`}
        style={{ 
          background: bgColor,
          color: textColor,
        }}
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <div className="w-full h-full flex flex-col gap-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="w-full text-xs font-semibold bg-transparent border-none outline-none text-center"
              style={{ color: textColor }}
              autoFocus
            />
            {type === 'rect' && (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                className="w-full text-xs bg-transparent border-none outline-none text-center resize-none"
                style={{ color: textColor }}
                rows={2}
                placeholder="Add description..."
              />
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="font-semibold">{title}</div>
            {content && type === 'rect' && (
              <div className="text-xs opacity-80 mt-1">{content}</div>
            )}
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default DiagramNode; 