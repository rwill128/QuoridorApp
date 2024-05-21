export function wallBlocked(playerCol: number, playerRow: number, board: boolean[][], direction: String) {

    if (direction === "down") {
        if (board[playerCol][playerRow + 1]) {
            return true;
        }
    }
    if (direction === "up") {
        if (board[playerCol][playerRow]) {
            return true;
        }
    }
    if (direction === "left") {
        if (board[playerCol-1][playerRow]) {
            return true;
        }
    }
    if (direction === "right") {
        if (board[playerCol][playerRow]) {
            return true;
        }
    }

    return false;
}