'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface MindscapeNodeData {
  label: string;
  title: string;
  content: string;
  type: 'project' | 'concept' | 'idea' | 'resource' | 'note' | 'code';
  tags: string[];
  color: string;
  size: number;
}

function MindscapeNode({ data, selected }: NodeProps<MindscapeNodeData>) {
  const typeEmojis = {
    project: '🚀',
    concept: '💡',
    idea: '✨',
    resource: '🔗',
    note: '📝',
    code: '💻',
  };

  const emoji = typeEmojis[data.type];

  return (
    <div
      className="relative transition-all duration-300"
      style={{
        width: data.size,
        height: data.size,
      }}
    >
      {/* Connection handles */}
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />

      {/* Node circle */}
      <div
        className={`
          w-full h-full rounded-full 
          backdrop-blur-md
          border-2 transition-all duration-300
          flex items-center justify-center
          cursor-pointer
          ${selected 
            ? 'border-white shadow-2xl scale-110' 
            : 'border-white/30 hover:border-white/60 hover:scale-105'
          }
        `}
        style={{
          backgroundColor: `${data.color}40`,
          boxShadow: selected 
            ? `0 0 30px ${data.color}, 0 0 60px ${data.color}40`
            : `0 0 10px ${data.color}40`,
        }}
      >
        <span className="text-3xl">{emoji}</span>
      </div>

      {/* Node label */}
      <div
        className={`
          absolute -bottom-8 left-1/2 -translate-x-1/2
          text-sm font-medium whitespace-nowrap
          transition-opacity duration-300
          ${selected ? 'opacity-100' : 'opacity-70'}
        `}
      >
        {data.title}
      </div>
    </div>
  );
}

export default memo(MindscapeNode);
