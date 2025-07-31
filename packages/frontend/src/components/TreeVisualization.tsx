import React, { useMemo } from 'react';
import { TreeStructure } from '../types';
import { TreeNodeComponent } from './TreeNode';

interface Props {
  tree: TreeStructure;
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string) => void;
}

interface NodePosition {
  x: number;
  y: number;
}

export const TreeVisualization: React.FC<Props> = ({ tree, selectedNodeId, onNodeSelect }) => {
  const nodePositions = useMemo(() => {
    const positions: Record<string, NodePosition> = {};

    if (!tree.rootId || !tree.nodes[tree.rootId]) {
      return positions;
    }

    const calculatePositions = (nodeId: string, x: number, y: number) => {
      const node = tree.nodes[nodeId];
      if (!node) return;

      positions[nodeId] = { x, y };

      const children = node.children;
      if (children.length === 0) return;

      const childSpacing = Math.max(120, 300 / Math.max(children.length, 1));
      const totalWidth = (children.length - 1) * childSpacing;
      const startX = x - totalWidth / 2;

      children.forEach((childId, index) => {
        const childX = startX + index * childSpacing;
        const childY = y + 150;
        calculatePositions(childId, childX, childY);
      });
    };

    calculatePositions(tree.rootId, 400, 100);
    return positions;
  }, [tree]);

  const connections = useMemo(() => {
    const lines: Array<{ from: NodePosition; to: NodePosition }> = [];

    Object.values(tree.nodes).forEach(node => {
      if (node.parentId && nodePositions[node.id] && nodePositions[node.parentId]) {
        const parentPos = nodePositions[node.parentId];
        const childPos = nodePositions[node.id];
        lines.push({
          from: { x: parentPos.x + 40, y: parentPos.y + 40 },
          to: { x: childPos.x + 40, y: childPos.y + 40 }
        });
      }
    });

    return lines;
  }, [tree.nodes, nodePositions]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '600px', border: '1px solid #ccc', overflow: 'auto' }}>
      <svg
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}
        width="100%"
        height="100%"
      >
        {connections.map((connection, index) => (
          <line
            key={index}
            x1={connection.from.x}
            y1={connection.from.y}
            x2={connection.to.x}
            y2={connection.to.y}
            stroke="#666"
            strokeWidth="2"
          />
        ))}
      </svg>

      {Object.entries(nodePositions).map(([nodeId, position]) => {
        const node = tree.nodes[nodeId];
        if (!node) return null;

        return (
          <TreeNodeComponent
            key={nodeId}
            node={node}
            isSelected={selectedNodeId === nodeId}
            onSelect={onNodeSelect}
            position={position}
          />
        );
      })}
    </div>
  );
};
