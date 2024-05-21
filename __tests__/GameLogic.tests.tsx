import {wallBlocked} from "../src/components/WallBlocked.tsx";
import {impassabilityGridHorizontalMovement} from "../src/components/ImpassabilityGridHorizontalMovement.tsx";
import {impassabilityGridVerticalMovement} from "../src/components/ImpassabilityGridVerticalMovement.tsx";



describe('wallBlocked', () => {

  const walls:{ row: number; col: number; orientation: "horizontal" | "vertical", color: string }[] = [
    { row: 1, col: 3, orientation: "horizontal", color: "" },
    { row: 1, col: 3, orientation: "vertical", color: "" },
    { row: 1, col: 4, orientation: "vertical", color: "" },
    { row: 2, col: 4, orientation: "horizontal", color: "" },
  ]

  const movementHorizontal= impassabilityGridHorizontalMovement(walls)

  const movementVertical = impassabilityGridVerticalMovement(walls)


  it('should allow movement within one square with no walls', () => {
    expect(wallBlocked(4, 2, movementVertical, "up")).toBe(true);
    expect(wallBlocked(4, 2, movementHorizontal, "left")).toBe(true);
    expect(wallBlocked(4, 2, movementHorizontal, "right")).toBe(true);
    expect(wallBlocked(4, 2, movementVertical, "down")).toBe(true);
  });

  it('should allow movement within one square with no walls', () => {
    expect(wallBlocked(4, 2, movementVertical, "up")).toBe(true);
    expect(wallBlocked(4, 2, movementHorizontal, "left")).toBe(true);
    expect(wallBlocked(4, 2, movementHorizontal, "right")).toBe(true);
    expect(wallBlocked(4, 2, movementVertical, "down")).toBe(true);
  });

});
