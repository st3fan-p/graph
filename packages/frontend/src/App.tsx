import { useState, useEffect } from 'react';
import { TreeStructure } from './types';
import { TreeVisualization } from './components/TreeVisualization';
import { AddNodeForm } from './components/AddNodeForm';
import { apiService } from './services/api';

function App() {
  const [tree, setTree] = useState<TreeStructure>({ nodes: {}, rootId: null });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTree = async () => {
    try {
      const treeData = await apiService.getTree();
      setTree(treeData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tree');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTree();
  }, []);

  const handleAddNode = async (color: string, parentId: string | null) => {
    try {
      await apiService.createNode({ value: color, parentId });
      await loadTree(); // Reload the tree to get updated data
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add node');
    }
  };

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId === selectedNodeId ? null : nodeId);
  };

  const handleDeleteNode = async () => {
    if (!selectedNodeId) return;

    try {
      await apiService.deleteNode(selectedNodeId);
      setSelectedNodeId(null);
      await loadTree();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete node');
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Tree Graph Builder</h1>

      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          Error: {error}
        </div>
      )}

      <AddNodeForm
        selectedNodeId={selectedNodeId}
        onAddNode={handleAddNode}
      />

      {selectedNodeId && (
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={handleDeleteNode}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Delete Selected Node
          </button>
          <button
            onClick={() => setSelectedNodeId(null)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Deselect
          </button>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h3>Instructions:</h3>
        <ul>
          <li>Click "Add Node" to create the root node (when none is selected)</li>
          <li>Click on any node to select it</li>
          <li>Add new nodes to selected parent by choosing a color and clicking "Add Node"</li>
          <li>Delete nodes using the "Delete Selected Node" button</li>
        </ul>
      </div>

      {Object.keys(tree.nodes).length === 0 ? (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h3>No nodes yet</h3>
          <p>Add your first node to start building the tree!</p>
        </div>
      ) : (
        <TreeVisualization
          tree={tree}
          selectedNodeId={selectedNodeId}
          onNodeSelect={handleNodeSelect}
        />
      )}
    </div>
  );
}

export default App;
