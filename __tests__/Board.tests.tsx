import { canMoveTo } from "../src/components/CanMoveTo";

describe('canMoveTo', () => {
  const piecePosition = {row: 4, col: 4};
  const walls = [
    {row: 2, col: 2, orientation: 'horizontal'},
    {row: 5, col: 4, orientation: 'vertical'},
  ];

  it('should allow movement within one square with no walls', () => {
    expect(canMoveTo(3, 4, piecePosition, walls)).toBe(true);
    expect(canMoveTo(5, 4, piecePosition, walls)).toBe(true);
    expect(canMoveTo(4, 3, piecePosition, walls)).toBe(true);
    expect(canMoveTo(4, 5, piecePosition, walls)).toBe(true);
  });

  it('should block movement through a horizontal wall', () => {
    const horizontalWall = {row: 4, col: 4, orientation: 'horizontal'};
    const wallsWithHorizontal = [...walls, horizontalWall];

    expect(canMoveTo(4, 4, piecePosition, wallsWithHorizontal)).toBe(false); // Stay in the same position
    expect(canMoveTo(3, 4, piecePosition, wallsWithHorizontal)).toBe(false); // Move blocked by horizontal wall
    expect(canMoveTo(5, 4, piecePosition, wallsWithHorizontal)).toBe(true); // Move not blocked
  });

  it('should block movement through a vertical wall', () => {
    const verticalWall = {row: 4, col: 4, orientation: 'vertical'};
    const wallsWithVertical = [...walls, verticalWall];

    expect(canMoveTo(4, 4, piecePosition, wallsWithVertical)).toBe(false); // Stay in the same position
    expect(canMoveTo(4, 3, piecePosition, wallsWithVertical)).toBe(false); // Move blocked by vertical wall
    expect(canMoveTo(4, 5, piecePosition, wallsWithVertical)).toBe(true); // Move not blocked
  });

  it('should allow movement when no wall blocks the path', () => {
    expect(canMoveTo(5, 4, piecePosition, walls)).toBe(true);
    expect(canMoveTo(3, 4, piecePosition, walls)).toBe(true);
  });

  it('should block movement outside one square range', () => {
    expect(canMoveTo(2, 4, piecePosition, walls)).toBe(false);
    expect(canMoveTo(6, 4, piecePosition, walls)).toBe(false);
    expect(canMoveTo(4, 2, piecePosition, walls)).toBe(false);
    expect(canMoveTo(4, 6, piecePosition, walls)).toBe(false);
  });
});
