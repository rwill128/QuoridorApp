import React, {useState} from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import Piece from './Piece';
import Wall from './Wall';

const Board: React.FC = () => {
  const [piecePosition, setPiecePosition] = useState({row: 4, col: 4});
  const [selected, setSelected] = useState(false);
  const [walls] = useState([
    {row: 1, col: 1, orientation: 'vertical'},
    // Add other walls as needed
  ]);

  const handleCellPress = (row: number, col: number) => {
    if (selected) {
      if (canMoveTo(row, col)) {
        setPiecePosition({row, col});
      }
      setSelected(false);
    } else {
      if (piecePosition.row === row && piecePosition.col === col) {
        setSelected(true);
      }
    }
  };

  const canMoveTo = (row: number, col: number) => {
    // Ensure the move is within one square
    if (
      (Math.abs(piecePosition.row - row) === 1 && piecePosition.col === col) ||
      (Math.abs(piecePosition.col - col) === 1 && piecePosition.row === row)
    ) {
      // Check for walls in the path
      for (let wall of walls) {
        if (wall.orientation === 'horizontal') {
          if (
            ((piecePosition.row === wall.row && row === wall.row - 1) ||
              (piecePosition.row === wall.row - 1 && row === wall.row)) &&
            (piecePosition.col === wall.col ||
              piecePosition.col === wall.col + 1)
          ) {
            return false;
          }
        } else if (wall.orientation === 'vertical') {
          if (
            ((piecePosition.col === wall.col && col === wall.col - 1) ||
              (piecePosition.col === wall.col - 1 && col === wall.col)) &&
            (piecePosition.row === wall.row ||
              piecePosition.row === wall.row + 1)
          ) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  };

  // Create a 9x9 grid
  const grid = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      grid.push(
        <TouchableWithoutFeedback
          key={`${row}-${col}`}
          onPress={() => handleCellPress(row, col)}>
          <View style={styles.cell} />
        </TouchableWithoutFeedback>,
      );
    }
  }

  return (
    <View style={styles.board}>
      {grid}
      <Piece
        position={piecePosition}
        isSelected={selected}
        onPress={handleCellPress}
      />
      {walls.map((wall, index) => (
        <Wall
          key={index}
          position={{row: wall.row, col: wall.col}}
          orientation={wall.orientation}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    width: 360,
    height: 360,
    backgroundColor: '#eee',
    flexDirection: 'row',
    flexWrap: 'wrap',
    position: 'relative',
  },
  cell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default Board;
