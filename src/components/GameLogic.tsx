import {MCTS} from './MCTS';
import {wallBlocked} from "./WallBlocked.tsx";
import { wallPlacementGrid, wallPlacingBlocked } from "./WallPlacingBlocked.tsx";
import {impassabilityGridVerticalMovement} from "./ImpassabilityGridVerticalMovement.tsx";
import {impassabilityGridHorizontalMovement} from "./ImpassabilityGridHorizontalMovement.tsx";

type GameState = {
    boardMovementHorizontal: boolean[][];
    boardMovementVertical: boolean[][];
    walls: { row: number; col: number; orientation: "horizontal" | "vertical", color: string }[];
    players: {
        row: number; col: number;
    }[];
    playerTurn: number;
};


function createNewGameStateWithAdditionalWall(state: GameState, j: number, i: number, wallColor: string, orientation: string = "horizontal") {
    const newState = {
        ...state,
        walls: [...state.walls, { row: j, col: i, orientation: orientation, color: wallColor }],
        boardMovementVertical: impassabilityGridVerticalMovement([...state.walls, {
            row: j,
            col: i,
            orientation: orientation,
            color: wallColor
        }]),
        boardMovementHorizontal: impassabilityGridHorizontalMovement([...state.walls, {
            row: j,
            col: i,
            orientation: orientation,
            color: wallColor
        }])
    };
    return newState;
}

// function moveTo(state: GameState, possibleMoves: GameState[], player, direction: string) {
//
//     const newState = {
//         ...state,
//         playerTurn: 1
//     };
//     possibleMoves.push(newState);
// }

class GameLogic extends MCTS<GameState> {
    constructor(initialState: GameState, uctK: number = 1.41) {
        super(initialState, uctK);
    }

    getPossibleMoves(state: GameState): GameState[] {
        const possibleMoves: GameState[] = [];

        const wallColor = state.playerTurn === 1 ? "orange" : "red"

        for (var i = 1; i < 6; i++) {
            for (var j = 1; j < 6; j++) {
                const wallGrid = wallPlacementGrid(state.walls)
                if (!wallPlacingBlocked(j, i, "horizontal", state.walls, wallGrid)) {
                    const newState = createNewGameStateWithAdditionalWall(state, j, i, wallColor, "horizontal");
                    possibleMoves.push(newState as GameState);
                }
                if (!wallPlacingBlocked(j, i, "vertical", state.walls, wallGrid)) {
                    const newState = createNewGameStateWithAdditionalWall(state, j, i, wallColor, "vertical");
                    possibleMoves.push(newState as GameState);
                }
            }
        }


        if (state.playerTurn === 0) {
            if (
                state.players[0].row <= 7
                // &&
                // !(state.players[0].col == state.players[1].col && state.players[0].row + 1 == state.players[1].row)
                && !wallBlocked(state.players[0].col, state.players[0].row, state.boardMovementVertical, "down")
            ) {
                const newState = JSON.parse(JSON.stringify(state));
                newState.playerTurn = 1;
                newState.players[0].row = newState.players[0].row + 1;
                possibleMoves.push(newState);
            }
            if (
                state.players[0].row >= 1
                // &&
                // !(state.players[0].col == state.players[1].col && state.players[0].row - 1 == state.players[1].row)
                && !wallBlocked(state.players[0].col, state.players[0].row, state.boardMovementVertical, "up")
            ) {
                const newState = JSON.parse(JSON.stringify(state));
                newState.playerTurn = 1;
                newState.players[0].row = state.players[0].row - 1
                possibleMoves.push(newState);
            }
            if (
                state.players[0].col <= 7
                //&&
                // !(state.players[0].col + 1 == state.players[1].col && state.players[0].row == state.players[1].row)
                && !wallBlocked(state.players[0].col, state.players[0].row, state.boardMovementHorizontal, "right")
            ) {
                const newState = JSON.parse(JSON.stringify(state));
                newState.playerTurn = 1;
                newState.players[0].col = state.players[0].col + 1
                possibleMoves.push(newState);
            }
            if (
                state.players[0].col >= 1
                // &&
                // !(state.players[0].col - 1 == state.players[1].col && state.players[0].row == state.players[1].row)
                && !wallBlocked(state.players[0].col, state.players[0].row, state.boardMovementHorizontal, "left")
            ) {
                const newState = JSON.parse(JSON.stringify(state));
                newState.playerTurn = 1;
                newState.players[0].col = state.players[0].col - 1
                possibleMoves.push(newState);
            }
        } else if (state.playerTurn === 1) {
            if (
                state.players[1].row >= 1
                // &&
                // !(state.players[0].col == state.players[1].col && state.players[0].row == state.players[1].row - 1)
                && !wallBlocked(state.players[1].col, state.players[1].row, state.boardMovementVertical, "up")
            ) {
                const newState = JSON.parse(JSON.stringify(state));
                newState.playerTurn = 0;
                newState.players[1].row = state.players[1].row - 1
                possibleMoves.push(newState);
            }
            if (
                state.players[1].row <= 7
                // &&
                // !(state.players[0].col == state.players[1].col && state.players[0].row == state.players[1].row + 1)
                && !wallBlocked(state.players[1].col, state.players[1].row, state.boardMovementVertical, "down")
            ) {
                const newState = JSON.parse(JSON.stringify(state));
                newState.playerTurn = 0;
                newState.players[1].row = state.players[1].row + 1
                possibleMoves.push(newState);
            }
            if (
                state.players[1].col <= 7
                // &&
                // !(state.players[0].col == state.players[1].col + 1 && state.players[0].row == state.players[1].row)
                && !wallBlocked(state.players[1].col, state.players[1].row, state.boardMovementHorizontal, "right")
            ) {
                const newState = JSON.parse(JSON.stringify(state));
                newState.playerTurn = 0;
                newState.players[1].col = state.players[1].col + 1
                possibleMoves.push(newState);
            }
            if (
                state.players[1].col >= 1
                // &&
                // !(state.players[0].col == state.players[1].col - 1 && state.players[0].row == state.players[1].row)
                && !wallBlocked(state.players[1].col, state.players[1].row, state.boardMovementHorizontal, "left")
            ) {
                const newState = JSON.parse(JSON.stringify(state));
                newState.playerTurn = 0;
                newState.players[1].col = state.players[1].col - 1
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
        if (state.players[1].row >= 8) {
            return true;
        }
        if (state.players[0].row <= 0) {
            return true;
        }
        return false;
    }

    getResult(state: GameState, depth: number): number {
        if (depth % 2 === 1) {
            if (state.players[1].row >= 8) {
                return 1;
            } else if (state.players[0].row <= 0) {
                return 0;
            }
        } else {
            if (state.players[1].row >= 8) {
                return 0;
            } else if (state.players[0].row <= 0) {
                return 1;
            }
        }
        return -1000;
    }
}

export {GameLogic};
export type {GameState};
