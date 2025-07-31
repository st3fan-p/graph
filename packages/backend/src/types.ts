export interface TreeNode {
  id: string;
  value: string; // color value
  parentId: string | null;
  children: string[]; // array of child node IDs
}

export interface CreateNodeRequest {
  value: string;
  parentId: string | null;
}

export interface TreeStructure {
  nodes: Record<string, TreeNode>;
  rootId: string | null;
}