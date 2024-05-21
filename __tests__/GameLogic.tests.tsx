import {wallBlocked} from "../src/components/WallBlocked.tsx";
import {impassabilityGridHorizontalMovement} from "../src/components/ImpassabilityGridHorizontalMovement.tsx";
import {impassabilityGridVerticalMovement} from "../src/components/ImpassabilityGridVerticalMovement.tsx";



describe('wallBlocked', () => {

  const walls:{ row: number; col: number; orientation: "horizontal" | "vertical", color: string }[] = [
    { row: 0, col: 3, orientation: "horizontal", color: "" },
    // { row: 1, col: 4, orientation: "horizontal", color: "" },
    // { row: 1, col: 3, orientation: "vertical", color: "" },
    // { row: 1, col: 4, orientation: "vertical", color: "" },
    // { row: 2, col: 4, orientation: "horizontal", color: "" },
  ]

  const movementHorizontal= impassabilityGridHorizontalMovement(walls)

  const movementVertical = impassabilityGridVerticalMovement(walls)

  it('should allow movement within one square with no walls', () => {
    // expect(movementVertical[4][2]).toBe(true);
    // expect(movementVertical[3][2]).toBe(true);
  });


  it('should allow movement within one square with no walls', () => {

    // console.log(movementHorizontal[4][2])
    expect(wallBlocked(4, 1, movementVertical, "up")).toBe(true);
    expect(wallBlocked(4, 1, movementHorizontal, "left")).toBe(false);
    expect(wallBlocked(4, 1, movementHorizontal, "right")).toBe(false);
    expect(wallBlocked(4, 1, movementVertical, "down")).toBe(false);
  });

  it('should allow movement within one square with no walls', () => {
    expect(wallBlocked(5, 1, movementVertical, "up")).toBe(false);
    expect(wallBlocked(5, 1, movementHorizontal, "left")).toBe(false);
    expect(wallBlocked(5, 1, movementHorizontal, "right")).toBe(false);
    expect(wallBlocked(5, 1, movementVertical, "down")).toBe(false);
  });

  it('should allow movement within one square with no walls', () => {
    expect(wallBlocked(3, 1, movementVertical, "up")).toBe(true);
    expect(wallBlocked(3, 1, movementHorizontal, "left")).toBe(false);
    expect(wallBlocked(3, 1, movementHorizontal, "right")).toBe(false);
    expect(wallBlocked(3, 1, movementVertical, "down")).toBe(false);
  });


  it('should allow movement within one square with no walls', () => {

    // console.log(movementHorizontal[4][2])
    expect(wallBlocked(4, 0, movementVertical, "up")).toBe(false);
    expect(wallBlocked(4, 0, movementHorizontal, "left")).toBe(false);
    expect(wallBlocked(4, 0, movementHorizontal, "right")).toBe(false);
    expect(wallBlocked(4, 0, movementVertical, "down")).toBe(true);
  });

  it('should allow movement within one square with no walls', () => {
    expect(wallBlocked(5, 0, movementVertical, "up")).toBe(false);
    expect(wallBlocked(5, 0, movementHorizontal, "left")).toBe(false);
    expect(wallBlocked(5, 0, movementHorizontal, "right")).toBe(false);
    expect(wallBlocked(5, 0, movementVertical, "down")).toBe(false);
  });

  it('should allow movement within one square with no walls', () => {
    expect(wallBlocked(3, 0, movementVertical, "up")).toBe(false);
    expect(wallBlocked(3, 0, movementHorizontal, "left")).toBe(false);
    expect(wallBlocked(3, 0, movementHorizontal, "right")).toBe(false);
    expect(wallBlocked(3, 0, movementVertical, "down")).toBe(true);
  });

});
