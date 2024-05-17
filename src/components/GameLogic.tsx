import { canMoveTo } from './CanMoveTo';
import { selectPlayerTwoMove } from './AI';

interface Position {
  row: number;
  col: number;
}

interface Wall {
  row: number;
  col: number;
  orientation: 'horizontal' | 'vertical';
}

class GameLogic {
  playerOnePosition: Position;
  playerTwoPosition: Position;

  playerOneSelected: boolean;
  playerTwoSelected: boolean;
  walls: Wall[];
  playerTwoIsAI: boolean;

  constructor(playerTwoIsAI: boolean) {
    this.playerOnePosition = { row: 8, col: 4 };
    this.playerTwoPosition = { row: 0, col: 4 };
    this.playerOneSelected = false;
    this.playerTwoSelected = false;
    this.walls = [{ row: 2, col: 2, orientation: 'horizontal' }];
    this.playerTwoIsAI = playerTwoIsAI;
  }

  handlePlayerMove(row: number, col: number): boolean {
    if (canMoveTo(row, col, this.playerOnePosition, this.playerTwoPosition, this.walls)) {
      this.playerOnePosition = { row, col };
      return true;
    }
    return false;
  }

  handleAIMove() {
    if (this.playerTwoIsAI) {
      const playerTwoMove = selectPlayerTwoMove(
        this.playerOnePosition,
        this.playerTwoPosition,
        this.walls
      );
      this.playerTwoPosition = playerTwoMove;
    }
  }

  placeWall(row: number, col: number, orientation: 'horizontal' | 'vertical'): boolean {
    this.walls.push({ row, col, orientation });
    return true;
  }
}

export default GameLogic;
