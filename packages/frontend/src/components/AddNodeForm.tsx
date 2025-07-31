import React, { useState } from 'react';

interface Props {
  selectedNodeId: string | null;
  onAddNode: (color: string, parentId: string | null) => void;
}

const PREDEFINED_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
  '#10AC84', '#EE5A24', '#0652DD', '#9C88FF', '#FFC312'
];

export const AddNodeForm: React.FC<Props> = ({ selectedNodeId, onAddNode }) => {
  const [selectedColor, setSelectedColor] = useState(PREDEFINED_COLORS[0]);
  const [customColor, setCustomColor] = useState('');
  const [useCustomColor, setUseCustomColor] = useState(false);

  const handleAddNode = () => {
    const colorToUse = useCustomColor ? customColor : selectedColor;
    if (colorToUse) {
      onAddNode(colorToUse, selectedNodeId);
      setCustomColor('');
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>Add New Node</h3>
      <div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="radio"
              checked={!useCustomColor}
              onChange={() => setUseCustomColor(false)}
            />
            Choose from predefined colors
          </label>
        </div>
        
        {!useCustomColor && (
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', maxWidth: '300px' }}>
              {PREDEFINED_COLORS.map((color) => (
                <div
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: color,
                    border: selectedColor === color ? '3px solid #000' : '2px solid #ccc',
                    borderRadius: '50%',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>
        )}
        
        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="radio"
              checked={useCustomColor}
              onChange={() => setUseCustomColor(true)}
            />
            Enter custom color
          </label>
        </div>
        
        {useCustomColor && (
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              placeholder="Enter color (e.g., #FF0000, red, rgb(255,0,0))"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
        )}
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Parent: </strong>
          {selectedNodeId ? `Selected node (${selectedNodeId.slice(0, 8)}...)` : 'Root (no parent)'}
        </div>
        
        <button
          onClick={handleAddNode}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Node
        </button>
      </div>
    </div>
  );
};