import { TreeStructure, TreeNode, CreateNodeRequest } from '../types';

const API_BASE_URL = '/api';

class ApiService {
  async getTree(): Promise<TreeStructure> {
    const response = await fetch(`${API_BASE_URL}/tree`);
    if (!response.ok) {
      throw new Error('Failed to fetch tree');
    }
    return response.json();
  }

  async createNode(request: CreateNodeRequest): Promise<TreeNode> {
    const response = await fetch(`${API_BASE_URL}/nodes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create node');
    }
    
    return response.json();
  }

  async deleteNode(nodeId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/nodes/${nodeId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete node');
    }
  }
}

export const apiService = new ApiService();