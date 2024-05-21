import {TreeNode} from "./TreeNode";

abstract class MCTS<T> {
  root: TreeNode<T>;
  uctK: number;

  constructor(rootState: T, uctK: number = 1.1) {
    this.root = new TreeNode(rootState);
    this.uctK = uctK;
  }

  async run(iterations: number, progressCallback?: (bestMove: TreeNode<T>) => void): Promise<void> {
    for (let i = 0; i < iterations; i++) {
      const node = this.selection();
      const expandedNode = this.expansion(node);
      const result = this.simulation(expandedNode);
      this.backpropagation(expandedNode, result);

      // Call the progress callback every N iterations
      if (progressCallback && i % 10 === 0) {
        const bestMove = this.bestWinRatio(this.root);
        progressCallback(bestMove);
        await new Promise(requestAnimationFrame); // Yield control back to the main thread
      }
    }
  }

  // run(iterations: number, progressCallback?: (bestMove: TreeNode<T>) => void): Promise<void> {
  //   for (let i = 0; i < iterations; i++) {
  //     const node = this.selection();
  //     const expandedNode = this.expansion(node);
  //     const result = this.simulation(expandedNode);
  //     this.backpropagation(expandedNode, result);
  //   }
  // }

  selection(): TreeNode<T> {
    let node = this.root;
    while (node.isFullyExpanded && node.children.length > 0) {
      node = this.bestUCT(node);
    }
    return node;
  }

  expansion(node: TreeNode<T>): TreeNode<T> {
    const possibleMoves = this.getPossibleMoves(node.state);
    for (const move of possibleMoves) {
      if (!node.children.some(child => this.statesEqual(child.state, move))) {
        return node.addChild(move);
      }
    }
    node.isFullyExpanded = true;
    return node;
  }

  simulation(node: TreeNode<T>): number {
    let currentState = node.state;
    while (!this.isTerminal(currentState)) {
      const possibleMoves = this.getPossibleMoves(currentState);
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      currentState = this.applyMove(currentState, randomMove);
    }
    return this.getResult(currentState, node.depth);
  }

  backpropagation(node: TreeNode<T>, result: number): void {
    let currentNode: TreeNode<T> | null = node;
    while (currentNode !== null) {
      currentNode.update(result)
      currentNode = currentNode.parent
      if (result === 1) {
        result = 0;
      } else if (result === 0) {
        result = 1;
      }
    }
  }

  bestUCT(node: TreeNode<T>): TreeNode<T> {
    return node.children.reduce((bestChild, child) => {
      const uctValue = (child.wins / child.visits) + this.uctK * Math.sqrt(Math.log(node.visits) / child.visits);
      return uctValue > (bestChild ? (bestChild.wins / bestChild.visits) + this.uctK * Math.sqrt(Math.log(node.visits) / bestChild.visits) : -Infinity) ? child : bestChild;
    }, null as TreeNode<T> | null)!;
  }

  bestWinRatio(node: TreeNode<T>): TreeNode<T> {
    return node.children.reduce((bestChild, child) => {
        let childWinRatio = child.visits > 0 ? child.wins / child.visits : 0;
        return childWinRatio  > (bestChild ? (bestChild.wins / bestChild.visits) : -Infinity) ? child : bestChild;
    }, null as TreeNode<T> | null)!;
  }

  // Abstract methods that must be implemented by subclasses
  abstract getPossibleMoves(state: T): T[];

  abstract statesEqual(state1: T, state2: T): boolean;

  abstract applyMove(state: T, move: T): T;

  abstract isTerminal(state: T): boolean;

  abstract getResult(state: T, depth: number): number;
}

export { MCTS }
