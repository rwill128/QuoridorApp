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
      if (state.playerOneRow <= 7 && !state.board[state.playerOneCol][state.playerOneRow + 1]) {
        const newState = JSON.parse(JSON.stringify(state))
        newState.playerOneRow += 1
        newState.board[state.playerOneCol][state.playerOneRow] = true
        possibleMoves.push(newState)
      }
      if (state.playerOneRow >= 0 && !state.board[state.playerOneCol][state.playerOneRow - 1]) {
        const newState = JSON.parse(JSON.stringify(state))
        newState.playerOneRow -= 1
        newState.board[state.playerOneCol][state.playerOneRow] = true
        possibleMoves.push(newState)
      }
      if (state.playerOneRow >= 7 && !state.board[state.playerOneCol + 1][state.playerOneRow]) {
        const newState = JSON.parse(JSON.stringify(state))
        newState.playerOneCol += 1
        newState.board[state.playerOneCol + 1][state.playerOneRow] = true
        possibleMoves.push(newState)
      }
      if (state.playerOneCol >= 0 && !state.board[state.playerOneCol - 1][state.playerOneRow]) {
        const newState = JSON.parse(JSON.stringify(state))
        newState.playerOneCol -= 1
        newState.board[state.playerOneCol - 1][state.playerOneRow] = true
        possibleMoves.push(newState)
      }
    } else if (state.playerTurn === 1) {
      if (state.playerTwoRow <= 7 && !state.board[state.playerTwoCol][state.playerTwoRow + 1]) {
        const newState = JSON.parse(JSON.stringify(state))
        newState.playerTwoRow += 1
        newState.board[state.playerTwoCol][state.playerTwoRow] = true
        possibleMoves.push(newState)
      }
      if (state.playerTwoRow >= 0 && !state.board[state.playerTwoCol][state.playerTwoRow - 1]) {
        const newState = JSON.parse(JSON.stringify(state))
        newState.playerTwoRow -= 1
        newState.board[state.playerTwoCol][state.playerTwoRow] = true
        possibleMoves.push(newState)
      }
      if (state.playerTwoRow >= 7 && !state.board[state.playerTwoCol + 1][state.playerTwoRow]) {
        const newState = JSON.parse(JSON.stringify(state))
        newState.playerTwoCol += 1
        newState.board[state.playerTwoCol + 1][state.playerTwoRow] = true
        possibleMoves.push(newState)
      }
      if (state.playerTwoCol >= 0 && !state.board[state.playerTwoCol - 1][state.playerTwoRow]) {
        const newState = JSON.parse(JSON.stringify(state))
        newState.playerTwoCol -= 1
        newState.board[state.playerTwoCol - 1][state.playerTwoRow] = true
        possibleMoves.push(newState)
      }
    }

    return possibleMoves;
  }

  statesEqual(state1: GameState, state2: GameState): boolean {
    return JSON.stringify(state1) === JSON.stringify(state2);
  }

  applyMove(state: GameState, move: GameState): GameState {
    return move;
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

  getResult(state: GameState): number {
    if (state.playerTurn === 0) {
      if (state.playerOneRow <= 0) {
        return 1;
      } else if (state.playerTwoRow >= 8) {
        return -1;
      }
    } else if (state.playerTurn === 1) {
      if (state.playerTwoRow >= 8) {
        return 1;
      } else if (state.playerOneRow <= 0) {
        return -1;
      }
    }
    return 0;
  }
}
