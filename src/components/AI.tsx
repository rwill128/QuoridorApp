import {canMoveTo} from './CanMoveTo';

export const selectPlayerTwoMove = (
  playerOnePiecePosition: {row: number; col: number},
  playerTwoPiecePosition: {row: number; col: number},
  walls: {row: number; col: number; orientation: String}[],
) => {
  let nextMove = {
    row: playerTwoPiecePosition.row + 1,
    col: playerTwoPiecePosition.col,
  };
  if (
    canMoveTo(
      nextMove.row,
      nextMove.col,
      playerTwoPiecePosition,
      playerOnePiecePosition,
      walls,
    )
  ) {
    return nextMove;
  } else {
    return {row: playerTwoPiecePosition.row, col: playerTwoPiecePosition.col};
  }
};
