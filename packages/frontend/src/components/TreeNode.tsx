import React from 'react';
import { TreeNode as TreeNodeType } from '../types';

interface Props {
  node: TreeNodeType;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
  position: { x: number; y: number };
}

export const TreeNodeComponent: React.FC<Props> = ({ node, isSelected, onSelect, position }) => {
  const handleClick = () => {
    onSelect(node.id);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: 80,
        height: 80,
        borderRadius: '50%',
        backgroundColor: node.value,
        border: isSelected ? '3px solid #000' : '2px solid #666',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textShadow: '1px 1px 1px rgba(0,0,0,0.8)',
        fontSize: '12px',
        fontWeight: 'bold',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        transition: 'all 0.2s ease',
        zIndex: 2
      }}
    >
      {node.value}
    </div>
  );
};