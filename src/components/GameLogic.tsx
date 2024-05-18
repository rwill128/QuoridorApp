import {MCTS} from './MCTS';

type GameState = {
  board: boolean[][];
  playerOneRow: number;
  playerOneCol: number;
  playerTwoRow: number;
  playerTwoCol: number;
  playerTurn: number;
};

class GameLogic extends MCTS<GameState> {
  constructor(initialState: GameState, uctK: number = 1.41) {
    super(initialState, uctK);
  }

  getPossibleMoves(state: GameState): GameState[] {
    const possibleMoves: GameState[] = [];

    if (state.playerTurn === 0) {
      if (
        state.playerOneRow <= 7 &&
        !state.board[state.playerOneCol][state.playerOneRow + 1]
      ) {
        const newState = JSON.parse(JSON.stringify(state));
        newState.board[newState.playerOneCol][newState.playerOneRow] = false;
        newState.playerOneRow += 1;
        newState.board[newState.playerOneCol][newState.playerOneRow] = true;
        newState.playerTurn = 1;
        possibleMoves.push(newState);
      }
      if (
        state.playerOneRow >= 1 &&
        !state.board[state.playerOneCol][state.playerOneRow - 1]
      ) {
        const newState = JSON.parse(JSON.stringify(state));
        newState.board[newState.playerOneCol][newState.playerOneRow] = false;
        newState.playerOneRow -= 1;
        newState.board[newState.playerOneCol][newState.playerOneRow] = true;
        newState.playerTurn = 1;
        possibleMoves.push(newState);
      }
      if (
        state.playerOneCol <= 7 &&
        !state.board[state.playerOneCol + 1][state.playerOneRow]
      ) {
        const newState = JSON.parse(JSON.stringify(state));
        newState.board[newState.playerOneCol][newState.playerOneRow] = false;
        newState.playerOneCol += 1;
        newState.board[newState.playerOneCol][newState.playerOneRow] = true;
        newState.playerTurn = 1;
        possibleMoves.push(newState);
      }
      if (
        state.playerOneCol >= 1 &&
        !state.board[state.playerOneCol - 1][state.playerOneRow]
      ) {
        const newState = JSON.parse(JSON.stringify(state));
        newState.board[newState.playerOneCol][newState.playerOneRow] = false;
        newState.playerOneCol -= 1;
        newState.board[newState.playerOneCol][newState.playerOneRow] = true;
        newState.playerTurn = 1;
        possibleMoves.push(newState);
      }
    } else if (state.playerTurn === 1) {
      if (
        state.playerTwoRow >= 1 &&
        !state.board[state.playerTwoCol][state.playerTwoRow - 1]
      ) {
        const newState = JSON.parse(JSON.stringify(state));
        newState.board[newState.playerTwoCol][newState.playerTwoRow] = false;
        newState.playerTwoRow -= 1;
        newState.board[newState.playerTwoCol][newState.playerTwoRow] = true;
        newState.playerTurn = 0;
        possibleMoves.push(newState);
      }
      if (
          state.playerTwoRow <= 7 &&
          !state.board[state.playerTwoCol][state.playerTwoRow + 1]
      ) {
        const newState = JSON.parse(JSON.stringify(state));
        newState.board[newState.playerTwoCol][newState.playerTwoRow] = false;
        newState.playerTwoRow += 1;
        newState.board[newState.playerTwoCol][newState.playerTwoRow] = true;
        newState.playerTurn = 0;
        possibleMoves.push(newState);
      }
      if (
        state.playerTwoCol <= 7 &&
        !state.board[state.playerTwoCol + 1][state.playerTwoRow]
      ) {
        const newState = JSON.parse(JSON.stringify(state));
        newState.board[newState.playerTwoCol][newState.playerTwoRow] = false;
        newState.playerTwoCol += 1;
        newState.board[newState.playerTwoCol][newState.playerTwoRow] = true;
        newState.playerTurn = 0;
        possibleMoves.push(newState);
      }
      if (
        state.playerTwoCol >= 1 &&
        !state.board[state.playerTwoCol - 1][state.playerTwoRow]
      ) {
        const newState = JSON.parse(JSON.stringify(state));
        newState.board[newState.playerTwoCol][newState.playerTwoRow] = false;
        newState.playerTwoCol -= 1;
        newState.board[newState.playerTwoCol][newState.playerTwoRow] = true;
        newState.playerTurn = 0;
        possibleMoves.push(newState);
      }
    }

    return possibleMoves;
  }

  statesEqual(state1: GameState, state2: GameState): boolean {
    return JSON.stringify(state1) === JSON.stringify(state2);
  }

  applyMove(state: GameState, move: GameState): GameState {
    return JSON.parse(JSON.stringify(move));
  }

  isTerminal(state: GameState): boolean {
    if (state.playerTwoRow >= 8) {
      return true;
    }
    if (state.playerOneRow <= 0) {
      return true;
    }
    return false;
  }

  getResult(state: GameState, depth: number): number {
    if (depth % 2 === 1) {
      if (state.playerTwoRow >= 8) {
        return 1;
      } else if (state.playerOneRow <= 0) {
        return 0;
      }
    } else {
      if (state.playerTwoRow >= 8) {
        return 0;
      } else if (state.playerOneRow <= 0) {
        return 1;
      }
    }
    return -1000;
  }
}

export {GameLogic};
export type {GameState};
