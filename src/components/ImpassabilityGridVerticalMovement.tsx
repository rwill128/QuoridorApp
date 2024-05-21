export function impassabilityGridVerticalMovement(walls: {
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
            wallPlacementGridReturn[wall.col][wall.row + 1] = true;
        }
    });
    return wallPlacementGridReturn;
}