export interface TreeNode {
  id: string;
  value: string;
  parentId: string | null;
  children: string[];
}

export interface TreeStructure {
  nodes: Record<string, TreeNode>;
  rootId: string | null;
}

export interface CreateNodeRequest {
  value: string;
  parentId: string | null;
}