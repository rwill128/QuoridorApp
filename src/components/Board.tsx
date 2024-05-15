import React, {useState} from 'react';
import {
  ImageBackground,
  PanResponder,
  PanResponderInstance,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from "react-native";
import Piece from './Piece';
import Wall from './Wall';
import {canMoveTo} from './CanMoveTo';
import AvailableWalls from './AvailableWalls';

const Board: React.FC = () => {
  const [piecePosition, setPiecePosition] = useState({row: 4, col: 4});
  const [selected, setSelected] = useState(false);
  const [walls, setWalls] = useState([
    { row: 2, col: 2, orientation: 'horizontal' },
    // Add other walls as needed
  ]);
  const [draggingWall, setDraggingWall] = useState<{
    row: number;
    col: number;
    orientation: 'horizontal' | 'vertical';
  } | null>(null);
  const [availableWalls, setAvailableWalls] = useState(10);

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

  const panResponder: PanResponderInstance = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const gridX = Math.floor(gestureState.moveX / 40);
      const gridY = Math.floor(gestureState.moveY / 40);
      setDraggingWall({row: gridY, col: gridX, orientation: 'horizontal'});
    },
    onPanResponderRelease: () => {
      if (draggingWall) {
        setWalls([...walls, draggingWall]);
        setDraggingWall(null);
        setAvailableWalls(availableWalls - 1);
      }
    },
  });

  const handlePickWall = (orientation: 'horizontal' | 'vertical') => {
    setDraggingWall({row: 0, col: 0, orientation});
  };

  const grid = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      grid.push(
        <ImageBackground
          key={`${row}-${col}`}
          source={require('../../assets/earth.png')}
          style={styles.cell}
        />
      );
    }
  }
  return (
    <View style={styles.container} {...panResponder.panHandlers}>
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
        {draggingWall && <Wall position={{ row: draggingWall.row, col: draggingWall.col }} orientation={draggingWall.orientation} />}
      </View>
      <AvailableWalls count={availableWalls} onPickWall={handlePickWall} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
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
