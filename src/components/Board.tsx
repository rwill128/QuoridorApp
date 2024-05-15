import React, {useState} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import Piece from './Piece';
import Wall from './Wall';
import {canMoveTo} from './CanMoveTo';

const Board: React.FC = () => {
  const [piecePosition, setPiecePosition] = useState({row: 4, col: 4});
  const [selected, setSelected] = useState(false);
  const [walls] = useState([
    {row: 1, col: 1, orientation: 'vertical'},
    {row: 1, col: 1, orientation: 'horizontal'},
    {row: 1, col: 3, orientation: 'horizontal'},
    // Add other walls as needed
  ]);

  const handleCellPress = (row: number, col: number) => {
    if (selected) {
      if (canMoveTo(row, col, piecePosition, walls)) {
        setPiecePosition({row, col});
      }
      setSelected(false);
    } else {
      if (piecePosition.row === row && piecePosition.col === col) {
        setSelected(true);
      }
    }
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
