interface Node<T> {
  state: T;
  parent: Node<T> | null;
  children: Node<T>[];
  visits: number;
  wins: number;
  winRatio: number;
  utc: number;
  isFullyExpanded: boolean;
  depth: number;
  addChild(childState: T): Node<T>;
  update(result: number): void;
}

class TreeNode<T> implements Node<T> {
  state: T;
  parent: Node<T> | null;
  depth: number;
  children: Node<T>[];
  visits: number;
  wins: number;
  winRatio: number;
  utc: number;
  isFullyExpanded: boolean;

  constructor(state: T, parent: Node<T> | null = null) {
    this.state = state;
    this.parent = parent;
    this.children = [];
    this.visits = 0;
    this.wins = 0;
    this.winRatio = 0;
    this.utc = 0;
    if (parent) {
      this.depth = parent.depth + 1
    } else {
      this.depth = 0;
    }
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
    this.winRatio = this.wins / this.visits;
    if (this.parent !== null) {
      this.utc = (this.wins / this.visits) + 1.1 * Math.sqrt(Math.log(this.parent.visits) / this.visits);
    }
  }
}

export { TreeNode }
export type { Node }
