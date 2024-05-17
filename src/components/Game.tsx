const MOVE_UP: [number, number] = [-1, 0];
const MOVE_DOWN: [number, number] = [1, 0];
const MOVE_LEFT: [number, number] = [0, -1];
const MOVE_RIGHT: [number, number] = [0, 1];

function create2DArrayInitializedTo<T>(
  numOfRow: number,
  numOfCol: number,
  initialValue: T,
): T[][] {
  const arr2D: T[][] = [];
  for (let i = 0; i < numOfRow; i++) {
    let row: T[] = [];
    for (let j = 0; j < numOfCol; j++) {
      row.push(initialValue);
    }
    arr2D.push(row);
  }
  return arr2D;
}

function set2DArrayEveryElementToValue<T>(arr2D: T[][], value: T): void {
  for (let i = 0; i < arr2D.length; i++) {
    for (let j = 0; j < arr2D[0].length; j++) {
      arr2D[i][j] = value;
    }
  }
}

function create2DArrayClonedFrom<T>(arr2D: T[][]): T[][] {
  const arr2DCloned: T[][] = [];
  for (let i = 0; i < arr2D.length; i++) {
    arr2DCloned.push([...arr2D[i]]);
  }
  return arr2DCloned;
}

function logicalAndBetween2DArray(
  arr2DA: boolean[][],
  arr2DB: boolean[][],
): boolean[][] {
  const arr2D: boolean[][] = [];
  for (let i = 0; i < arr2DA.length; i++) {
    let row: boolean[] = [];
    for (let j = 0; j < arr2DA[0].length; j++) {
      row.push(arr2DA[i][j] && arr2DB[i][j]);
    }
    arr2D.push(row);
  }
  return arr2D;
}

class PawnPosition {
  row: number;
  col: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  equals(otherPosition: PawnPosition): boolean {
    return this.row === otherPosition.row && this.col === otherPosition.col;
  }

  newAddMove(pawnMoveTuple: [number, number]): PawnPosition {
    return new PawnPosition(
      this.row + pawnMoveTuple[0],
      this.col + pawnMoveTuple[1],
    );
  }
}

class Pawn {
  index: number;
  isHumanSide: boolean;
  isHumanPlayer: boolean;
  position: PawnPosition;
  goalRow: number;
  numberOfLeftWalls: number;

  constructor(
    index: number,
    isHumanSide: boolean,
    isHumanPlayer: boolean,
    forClone = false,
  ) {
    this.index = index;
    this.isHumanSide = isHumanSide;
    this.isHumanPlayer = isHumanPlayer;
    if (!forClone) {
      if (isHumanSide === true) {
        this.position = new PawnPosition(8, 4);
        this.goalRow = 0;
      } else {
        this.position = new PawnPosition(0, 4);
        this.goalRow = 8;
      }
      this.numberOfLeftWalls = 10;
    }
  }
}

class Board {
  pawns: Pawn[];
  walls: {horizontal: boolean[][]; vertical: boolean[][]};

  constructor(isHumanPlayerFirst: boolean, forClone = false) {
    if (!forClone) {
      this.pawns = isHumanPlayerFirst
        ? [new Pawn(0, true, true), new Pawn(1, false, false)]
        : [new Pawn(0, false, false), new Pawn(1, true, true)];
      this.walls = {
        horizontal: create2DArrayInitializedTo(8, 8, false),
        vertical: create2DArrayInitializedTo(8, 8, false),
      };
    }
  }
}

class Game {
  board: Board;
  winner: Pawn | null;
  private _turn: number;
  validNextWalls: {horizontal: boolean[][]; vertical: boolean[][]};
  private _probableNextWalls: {horizontal: boolean[][]; vertical: boolean[][]};
  private _probableValidNextWalls: {
    horizontal: boolean[][];
    vertical: boolean[][];
  } | null;
  private _probableValidNextWallsUpdated: boolean;
  openWays: {upDown: boolean[][]; leftRight: boolean[][]};
  private _validNextPositions: boolean[][];
  private _validNextPositionsUpdated: boolean;

  constructor(isHumanPlayerFirst: boolean, forClone = false) {
    if (!forClone) {
      this.board = new Board(isHumanPlayerFirst);
      this.winner = null;
      this._turn = 0;
      this.validNextWalls = {
        horizontal: create2DArrayInitializedTo(8, 8, true),
        vertical: create2DArrayInitializedTo(8, 8, true),
      };
      this._probableNextWalls = {
        horizontal: create2DArrayInitializedTo(8, 8, false),
        vertical: create2DArrayInitializedTo(8, 8, false),
      };
      this._probableValidNextWalls = null;
      this._probableValidNextWallsUpdated = false;
      this.openWays = {
        upDown: create2DArrayInitializedTo(8, 9, true),
        leftRight: create2DArrayInitializedTo(9, 8, true),
      };
      this._validNextPositions = create2DArrayInitializedTo(9, 9, false);
      this._validNextPositionsUpdated = false;
    }
  }

  get turn(): number {
    return this._turn;
  }

  set turn(newTurn: number) {
    this._turn = newTurn;
    this._validNextPositionsUpdated = false;
    this._probableValidNextWallsUpdated = false;
  }

  get pawn0(): Pawn {
    return this.board.pawns[0];
  }

  get pawn1(): Pawn {
    return this.board.pawns[1];
  }

  get pawnIndexOfTurn(): number {
    return this.turn % 2;
  }

  get pawnIndexOfNotTurn(): number {
    return (this.turn + 1) % 2;
  }

  get pawnOfTurn(): Pawn {
    return this.board.pawns[this.pawnIndexOfTurn];
  }

  get pawnOfNotTurn(): Pawn {
    return this.board.pawns[this.pawnIndexOfNotTurn];
  }

  get probableValidNextWalls(): {
    horizontal: boolean[][];
    vertical: boolean[][];
  } {
    if (this._probableValidNextWallsUpdated) {
      return this._probableValidNextWalls!;
    }
    this._probableValidNextWallsUpdated = true;
    const _probableValidNextWalls = {
      horizontal: create2DArrayClonedFrom(this._probableNextWalls.horizontal),
      vertical: create2DArrayClonedFrom(this._probableNextWalls.vertical),
    };

    if (this.turn >= 6) {
      for (let i = 0; i < 8; i++) {
        _probableValidNextWalls.horizontal[i][0] = true;
        _probableValidNextWalls.horizontal[i][7] = true;
      }
    }

    if (this.turn >= 3) {
      Game.setWallsBesidePawn(_probableValidNextWalls, this.pawnOfNotTurn);
    }
    if (
      this.turn >= 6 ||
      indicesOfValueIn2DArray(this.board.walls.horizontal, true).length > 0 ||
      indicesOfValueIn2DArray(this.board.walls.vertical, true).length > 0
    ) {
      Game.setWallsBesidePawn(_probableValidNextWalls, this.pawnOfTurn);
    }

    _probableValidNextWalls.horizontal = logicalAndBetween2DArray(
      _probableValidNextWalls.horizontal,
      this.validNextWalls.horizontal,
    );
    _probableValidNextWalls.vertical = logicalAndBetween2DArray(
      _probableValidNextWalls.vertical,
      this.validNextWalls.vertical,
    );
    this._probableValidNextWalls = _probableValidNextWalls;
    return _probableValidNextWalls;
  }

  get validNextPositions(): boolean[][] {
    if (this._validNextPositionsUpdated) {
      return this._validNextPositions;
    }
    this._validNextPositionsUpdated = true;
    set2DArrayEveryElementToValue(this._validNextPositions, false);

    this._set_validNextPositionsToward(MOVE_UP, MOVE_LEFT, MOVE_RIGHT);
    this._set_validNextPositionsToward(MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT);
    this._set_validNextPositionsToward(MOVE_LEFT, MOVE_UP, MOVE_DOWN);
    this._set_validNextPositionsToward(MOVE_RIGHT, MOVE_UP, MOVE_DOWN);

    return this._validNextPositions;
  }

  _set_validNextPositionsToward(
    mainMove: [number, number],
    subMove1: [number, number],
    subMove2: [number, number],
  ): void {
    if (
      this.isValidNextMoveNotConsideringOtherPawn(
        this.pawnOfTurn.position,
        mainMove,
      )
    ) {
      let mainMovePosition = this.pawnOfTurn.position.newAddMove(mainMove);
      if (mainMovePosition.equals(this.pawnOfNotTurn.position)) {
        if (
          this.isValidNextMoveNotConsideringOtherPawn(
            mainMovePosition,
            mainMove,
          )
        ) {
          let mainMainMovePosition = mainMovePosition.newAddMove(mainMove);
          this._validNextPositions[mainMainMovePosition.row][
            mainMainMovePosition.col
          ] = true;
        } else {
          if (
            this.isValidNextMoveNotConsideringOtherPawn(
              mainMovePosition,
              subMove1,
            )
          ) {
            let mainSub1MovePosition = mainMovePosition.newAddMove(subMove1);
            this._validNextPositions[mainSub1MovePosition.row][
              mainSub1MovePosition.col
            ] = true;
          }
          if (
            this.isValidNextMoveNotConsideringOtherPawn(
              mainMovePosition,
              subMove2,
            )
          ) {
            let mainSub2MovePosition = mainMovePosition.newAddMove(subMove2);
            this._validNextPositions[mainSub2MovePosition.row][
              mainSub2MovePosition.col
            ] = true;
          }
        }
      } else {
        this._validNextPositions[mainMovePosition.row][mainMovePosition.col] =
          true;
      }
    }
  }

  isValidNextMoveNotConsideringOtherPawn(
    currentPosition: PawnPosition,
    pawnMoveTuple: [number, number],
  ): boolean {
    if (pawnMoveTuple[0] === -1 && pawnMoveTuple[1] === 0) {
      return (
        currentPosition.row > 0 &&
        this.openWays.upDown[currentPosition.row - 1][currentPosition.col]
      );
    }
    if (pawnMoveTuple[0] === 1 && pawnMoveTuple[1] === 0) {
      return (
        currentPosition.row < 8 &&
        this.openWays.upDown[currentPosition.row][currentPosition.col]
      );
    }
    if (pawnMoveTuple[0] === 0 && pawnMoveTuple[1] === -1) {
      return (
        currentPosition.col > 0 &&
        this.openWays.leftRight[currentPosition.row][currentPosition.col - 1]
      );
    }
    if (pawnMoveTuple[0] === 0 && pawnMoveTuple[1] === 1) {
      return (
        currentPosition.col < 8 &&
        this.openWays.leftRight[currentPosition.row][currentPosition.col]
      );
    }
    throw new Error(
      'pawnMoveTuple should be one of [1, 0], [-1, 0], [0, 1], [0, -1]',
    );
  }

  isOpenWay(
    currentRow: number,
    currentCol: number,
    pawnMoveTuple: [number, number],
  ): boolean {
    if (pawnMoveTuple[0] === -1 && pawnMoveTuple[1] === 0) {
      return currentRow > 0 && this.openWays.upDown[currentRow - 1][currentCol];
    }
    if (pawnMoveTuple[0] === 1 && pawnMoveTuple[1] === 0) {
      return currentRow < 8 && this.openWays.upDown[currentRow][currentCol];
    }
    if (pawnMoveTuple[0] === 0 && pawnMoveTuple[1] === -1) {
      return (
        currentCol > 0 && this.openWays.leftRight[currentRow][currentCol - 1]
      );
    }
    if (pawnMoveTuple[0] === 0 && pawnMoveTuple[1] === 1) {
      return currentCol < 8 && this.openWays.leftRight[currentRow][currentCol];
    }
    throw new Error(
      'pawnMoveTuple should be one of [1, 0], [-1, 0], [0, 1], [0, -1]',
    );
  }

  movePawn(row: number, col: number, needCheck = false): boolean {
    if (needCheck && this.validNextPositions[row][col] !== true) {
      return false;
    }
    this.pawnOfTurn.position.row = row;
    this.pawnOfTurn.position.col = col;
    if (this.pawnOfTurn.goalRow === this.pawnOfTurn.position.row) {
      this.winner = this.pawnOfTurn;
    }
    this.turn++;
    return true;
  }

  placeHorizontalWall(row: number, col: number, needCheck = false): boolean {
    if (
      needCheck &&
      !this.testIfExistPathsToGoalLinesAfterPlaceHorizontalWall(row, col)
    ) {
      return false;
    }
    this.openWays.upDown[row][col] = false;
    this.openWays.upDown[row][col + 1] = false;
    this.validNextWalls.vertical[row][col] = false;
    this.validNextWalls.horizontal[row][col] = false;
    if (col > 0) {
      this.validNextWalls.horizontal[row][col - 1] = false;
    }
    if (col < 7) {
      this.validNextWalls.horizontal[row][col + 1] = false;
    }
    this.board.walls.horizontal[row][col] = true;

    this.adjustProbableValidNextWallForAfterPlaceHorizontalWall(row, col);
    this.pawnOfTurn.numberOfLeftWalls--;
    this.turn++;
    return true;
  }

  placeVerticalWall(row: number, col: number, needCheck = false): boolean {
    if (
      needCheck &&
      !this.testIfExistPathsToGoalLinesAfterPlaceVerticalWall(row, col)
    ) {
      return false;
    }
    this.openWays.leftRight[row][col] = false;
    this.openWays.leftRight[row + 1][col] = false;
    this.validNextWalls.horizontal[row][col] = false;
    this.validNextWalls.vertical[row][col] = false;
    if (row > 0) {
      this.validNextWalls.vertical[row - 1][col] = false;
    }
    if (row < 7) {
      this.validNextWalls.vertical[row + 1][col] = false;
    }
    this.board.walls.vertical[row][col] = true;

    this.adjustProbableValidNextWallForAfterPlaceVerticalWall(row, col);
    this.pawnOfTurn.numberOfLeftWalls--;
    this.turn++;
    return true;
  }

  private testIfExistPathsToGoalLinesAfterPlaceHorizontalWall(
    row: number,
    col: number,
  ): boolean {
    if (!this.testIfConnectedOnTwoPointsForHorizontalWall(row, col)) {
      return true;
    }
    this.openWays.upDown[row][col] = false;
    this.openWays.upDown[row][col + 1] = false;
    const result = this._existPathsToGoalLines();
    this.openWays.upDown[row][col] = true;
    this.openWays.upDown[row][col + 1] = true;
    return result;
  }

  private testIfExistPathsToGoalLinesAfterPlaceVerticalWall(
    row: number,
    col: number,
  ): boolean {
    if (!this.testIfConnectedOnTwoPointsForVerticalWall(row, col)) {
      return true;
    }
    this.openWays.leftRight[row][col] = false;
    this.openWays.leftRight[row + 1][col] = false;
    const result = this._existPathsToGoalLines();
    this.openWays.leftRight[row][col] = true;
    this.openWays.leftRight[row + 1][col] = true;
    return result;
  }

  private _existPathsToGoalLines(): boolean {
    return (
      this._existPathToGoalLineFor(this.pawnOfTurn) &&
      this._existPathToGoalLineFor(this.pawnOfNotTurn)
    );
  }

  private _existPathToGoalLineFor(pawn: Pawn): boolean {
    const visited = create2DArrayInitializedTo(9, 9, false);
    const pawnMoveTuples = [MOVE_UP, MOVE_LEFT, MOVE_RIGHT, MOVE_DOWN];
    const depthFirstSearch = (
      currentRow: number,
      currentCol: number,
      goalRow: number,
    ): boolean => {
      for (const pawnMoveTuple of pawnMoveTuples) {
        if (this.isOpenWay(currentRow, currentCol, pawnMoveTuple)) {
          const nextRow = currentRow + pawnMoveTuple[0];
          const nextCol = currentCol + pawnMoveTuple[1];
          if (!visited[nextRow][nextCol]) {
            visited[nextRow][nextCol] = true;
            if (nextRow === goalRow) {
              return true;
            }
            if (depthFirstSearch(nextRow, nextCol, goalRow)) {
              return true;
            }
          }
        }
      }
      return false;
    };
    return depthFirstSearch(pawn.position.row, pawn.position.col, pawn.goalRow);
  }

  static setWallsBesidePawn(
    wall2DArrays: {horizontal: boolean[][]; vertical: boolean[][]},
    pawn: Pawn,
  ): void {
    const row = pawn.position.row;
    const col = pawn.position.col;
    if (row >= 1) {
      if (col >= 1) {
        wall2DArrays.horizontal[row - 1][col - 1] = true;
        wall2DArrays.vertical[row - 1][col - 1] = true;
        if (col >= 2) {
          wall2DArrays.horizontal[row - 1][col - 2] = true;
        }
      }
      if (col <= 7) {
        wall2DArrays.horizontal[row - 1][col] = true;
        wall2DArrays.vertical[row - 1][col] = true;
        if (col <= 6) {
          wall2DArrays.horizontal[row - 1][col + 1] = true;
        }
      }
      if (row >= 2) {
        if (col >= 1) {
          wall2DArrays.vertical[row - 2][col - 1] = true;
        }
        if (col <= 7) {
          wall2DArrays.vertical[row - 2][col] = true;
        }
      }
    }
    if (row <= 7) {
      if (col >= 1) {
        wall2DArrays.horizontal[row][col - 1] = true;
        wall2DArrays.vertical[row][col - 1] = true;
        if (col >= 2) {
          wall2DArrays.horizontal[row][col - 2] = true;
        }
      }
      if (col <= 7) {
        wall2DArrays.horizontal[row][col] = true;
        wall2DArrays.vertical[row][col] = true;
        if (col <= 6) {
          wall2DArrays.horizontal[row][col + 1] = true;
        }
      }
      if (row <= 6) {
        if (col >= 1) {
          wall2DArrays.vertical[row + 1][col - 1] = true;
        }
        if (col <= 7) {
          wall2DArrays.vertical[row + 1][col] = true;
        }
      }
    }
  }

  adjustProbableValidNextWallForAfterPlaceHorizontalWall(
    row: number,
    col: number,
  ): void {
    if (row >= 1) {
      this._probableNextWalls.vertical[row - 1][col] = true;
    }
    if (row <= 6) {
      this._probableNextWalls.vertical[row + 1][col] = true;
    }
    if (col >= 1) {
      this._probableNextWalls.vertical[row][col - 1] = true;
      if (row >= 1) {
        this._probableNextWalls.vertical[row - 1][col - 1] = true;
      }
      if (row <= 6) {
        this._probableNextWalls.vertical[row + 1][col - 1] = true;
      }
      if (col >= 2) {
        this._probableNextWalls.horizontal[row][col - 2] = true;
        this._probableNextWalls.vertical[row][col - 2] = true;
        if (col >= 3) {
          this._probableNextWalls.horizontal[row][col - 3] = true;
        }
      }
    }
    if (col <= 6) {
      this._probableNextWalls.vertical[row][col + 1] = true;
      if (row >= 1) {
        this._probableNextWalls.vertical[row - 1][col + 1] = true;
      }
      if (row <= 6) {
        this._probableNextWalls.vertical[row + 1][col + 1] = true;
      }
      if (col <= 5) {
        this._probableNextWalls.horizontal[row][col + 2] = true;
        this._probableNextWalls.vertical[row][col + 2] = true;
        if (col <= 4) {
          this._probableNextWalls.horizontal[row][col + 3] = true;
        }
      }
    }
  }

  adjustProbableValidNextWallForAfterPlaceVerticalWall(
    row: number,
    col: number,
  ): void {
    if (col >= 1) {
      this._probableNextWalls.horizontal[row][col - 1] = true;
    }
    if (col <= 6) {
      this._probableNextWalls.horizontal[row][col + 1] = true;
    }
    if (row >= 1) {
      this._probableNextWalls.horizontal[row - 1][col] = true;
      if (col >= 1) {
        this._probableNextWalls.horizontal[row - 1][col - 1] = true;
      }
      if (col <= 6) {
        this._probableNextWalls.horizontal[row - 1][col + 1] = true;
      }
      if (row >= 2) {
        this._probableNextWalls.vertical[row - 2][col] = true;
        this._probableNextWalls.horizontal[row - 2][col] = true;
        if (row >= 3) {
          this._probableNextWalls.vertical[row - 3][col] = true;
        }
      }
    }
    if (row <= 6) {
      this._probableNextWalls.horizontal[row + 1][col] = true;
      if (col >= 1) {
        this._probableNextWalls.horizontal[row + 1][col - 1] = true;
      }
      if (col <= 6) {
        this._probableNextWalls.horizontal[row + 1][col + 1] = true;
      }
      if (row <= 5) {
        this._probableNextWalls.vertical[row + 2][col] = true;
        this._probableNextWalls.horizontal[row + 2][col] = true;
        if (row <= 4) {
          this._probableNextWalls.vertical[row + 3][col] = true;
        }
      }
    }
  }

  isPossibleNextMove(move: any[]): boolean {
    const movePawnTo = move[0];
    const placeHorizontalWallAt = move[1];
    const placeVerticalWallAt = move[2];
    if (movePawnTo) {
      return this.validNextPositions[movePawnTo[0]][movePawnTo[1]];
    } else if (placeHorizontalWallAt) {
      return this.testIfExistPathsToGoalLinesAfterPlaceHorizontalWall(
        placeHorizontalWallAt[0],
        placeHorizontalWallAt[1],
      );
    } else if (placeVerticalWallAt) {
      return this.testIfExistPathsToGoalLinesAfterPlaceVerticalWall(
        placeVerticalWallAt[0],
        placeVerticalWallAt[1],
      );
    }
    return false;
  }

  doMove(move: any[], needCheck = false): boolean {
    if (this.winner !== null) {
      console.log('error: doMove after already terminal......');
    }
    const movePawnTo = move[0];
    const placeHorizontalWallAt = move[1];
    const placeVerticalWallAt = move[2];
    if (movePawnTo) {
      return this.movePawn(movePawnTo[0], movePawnTo[1], needCheck);
    } else if (placeHorizontalWallAt) {
      return this.placeHorizontalWall(
        placeHorizontalWallAt[0],
        placeHorizontalWallAt[1],
        needCheck,
      );
    } else if (placeVerticalWallAt) {
      return this.placeVerticalWall(
        placeVerticalWallAt[0],
        placeVerticalWallAt[1],
        needCheck,
      );
    }
    return false;
  }
}

export default Game;
