import { v4 as uuidv4 } from 'uuid';
import { TreeNode, CreateNodeRequest, TreeStructure } from './types';

class TreeService {
  private tree: TreeStructure = {
    nodes: {},
    rootId: null
  };

  getTree(): TreeStructure {
    return this.tree;
  }

  createNode(request: CreateNodeRequest): TreeNode {
    const nodeId = uuidv4();
    const newNode: TreeNode = {
      id: nodeId,
      value: request.value,
      parentId: request.parentId,
      children: []
    };

    this.tree.nodes[nodeId] = newNode;

    if (request.parentId === null) {
      // This is the root node
      if (this.tree.rootId === null) {
        this.tree.rootId = nodeId;
      } else {
        throw new Error('Root node already exists');
      }
    } else {
      // Add this node as a child to its parent
      const parentNode = this.tree.nodes[request.parentId];
      if (!parentNode) {
        throw new Error('Parent node not found');
      }
      parentNode.children.push(nodeId);
    }

    return newNode;
  }

  getNode(nodeId: string): TreeNode | null {
    return this.tree.nodes[nodeId] || null;
  }

  deleteNode(nodeId: string): boolean {
    const node = this.tree.nodes[nodeId];
    if (!node) {
      return false;
    }

    // Don't allow deleting root node if it has children
    if (node.parentId === null && node.children.length > 0) {
      throw new Error('Cannot delete root node with children');
    }

    // Remove from parent's children array
    if (node.parentId) {
      const parent = this.tree.nodes[node.parentId];
      if (parent) {
        parent.children = parent.children.filter(childId => childId !== nodeId);
      }
    } else {
      // This is root node
      this.tree.rootId = null;
    }

    // Delete all children recursively
    for (const childId of node.children) {
      this.deleteNode(childId);
    }

    delete this.tree.nodes[nodeId];
    return true;
  }
}

export const treeService = new TreeService();