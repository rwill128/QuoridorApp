class Player {
  id: number;
  name: string;
  color: string;
  position: { row: number, col: number };
  availableWalls: number;
  isSelected: boolean;
  isAI: boolean;

  constructor(id: number, name: string, color: string, startRow: number, startCol: number, isAI: boolean = false) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.position = { row: startRow, col: startCol };
    this.availableWalls = 10; // Initial number of available walls
    this.isSelected = false;
    this.isAI = isAI;
  }

  // Add other methods as needed, e.g., movePlayer, placeWall, etc.
}
