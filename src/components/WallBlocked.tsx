export function wallBlocked(playerCol: number, playerRow: number, board: boolean[][], direction: String) {

    if (direction === "down") {
        if (playerRow > board[playerCol].length - 2 || board[playerCol][playerRow + 1]) {
            return true;
        }
    }
    if (direction === "up") {
        if (playerRow < 1 || board[playerCol][playerRow]) {
            return true;
        }
    }
    if (direction === "left") {
        if (playerCol < 1 || board[playerCol][playerRow]) {
            return true;
        }
    }
    if (direction === "right") {
        if (playerCol > board.length - 2 || board[playerCol+1][playerRow]) {
            return true;
        }
    }

    return false;
}