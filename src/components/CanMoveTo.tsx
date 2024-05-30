export const canMoveTo = (
  row: number,
  col: number,
  piecePosition: { row: number; col: number },
  opponentPiecePosition: { row: number; col: number },
  walls: { row: number; col: number; orientation: String }[]
) => {
  if (row === opponentPiecePosition.row && col === opponentPiecePosition.col) {
    return false;
  }

  if (
    (Math.abs(piecePosition.row - row) === 1 && piecePosition.col === col) ||
    (Math.abs(piecePosition.col - col) === 1 && piecePosition.row === row)
  ) {
    // Check for walls in the path
    for (let wall of walls) {
      if (wall.orientation === "horizontal") {
        if (
          ((piecePosition.row === wall.row && row === wall.row - 1) ||
            (piecePosition.row === wall.row - 1 && row === wall.row)) &&
          (piecePosition.col === wall.col || piecePosition.col === wall.col + 1)
        ) {
          return false;
        }
      } else if (wall.orientation === "vertical") {
        if (
          ((piecePosition.col === wall.col && col === wall.col - 1) ||
            (piecePosition.col === wall.col - 1 && col === wall.col)) &&
          (piecePosition.row === wall.row || piecePosition.row === wall.row + 1)
        ) {
          return false;
        }
      }
    }
    return true;
  }
  return false;
};
