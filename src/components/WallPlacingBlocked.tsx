export function wallPlacementGrid(walls: {
    row: number;
    col: number;
    orientation: "horizontal" | "vertical",
    color: string
}[]) {
    let wallPlacementGridReturn = [[false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false]];
    // Update the board with wall positions
    walls.forEach((wall) => {
        if (wall.orientation === 'horizontal') {
            wallPlacementGridReturn[wall.col][wall.row] = true;
            wallPlacementGridReturn[wall.col + 1][wall.row] = true;
        } else if (wall.orientation === 'vertical') {
            wallPlacementGridReturn[wall.col][wall.row] = true;
            wallPlacementGridReturn[wall.col][wall.row + 1] = true;
        }
    });
    return wallPlacementGridReturn;
}

export function wallPlacingBlocked(row: number, col: number, wallOrientation: string, walls: {
    row: number;
    col: number;
    orientation: "horizontal" | "vertical",
    color: string
}[], placementGrid: boolean[][]): boolean {
    let grid = placementGrid;
    if (wallOrientation == 'horizontal') {
        if (grid[col][row] || grid[col + 1][row]) {
            return true;
        }
    }
    if (wallOrientation == 'vertical') {
        if (grid[col][row] || grid[col][row + 1]) {
            return true;
        }
    }
    return false;
}
