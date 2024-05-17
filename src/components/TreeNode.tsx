interface Node<T> {
  state: T;
  parent: Node<T> | null;
  children: Node<T>[];
  visits: number;
  wins: number;
  isFullyExpanded: boolean;
  addChild(childState: T): Node<T>;
  update(result: number): void;
}

class TreeNode<T> implements Node<T> {
  state: T;
  parent: Node<T> | null;
  children: Node<T>[];
  visits: number;
  wins: number;
  isFullyExpanded: boolean;

  constructor(state: T, parent: Node<T> | null = null) {
    this.state = state;
    this.parent = parent;
    this.children = [];
    this.visits = 0;
    this.wins = 0;
    this.isFullyExpanded = false;
  }

  addChild(childState: T): Node<T> {
    const childNode = new TreeNode(childState, this);
    this.children.push(childNode);
    return childNode;
  }

  update(result: number): void {
    this.visits += 1;
    this.wins += result;
  }
}

export { TreeNode }
export type { Node }
