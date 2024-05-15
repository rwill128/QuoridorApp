import React, {useState} from 'react';
import {
  Button,
  StyleSheet,
  Switch,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Piece from './Piece';
import Wall from './Wall';
import {canMoveTo} from './CanMoveTo';

const Board: React.FC = () => {
  const [piecePosition, setPiecePosition] = useState({row: 4, col: 4});
  const [selected, setSelected] = useState(false);
  const [walls, setWalls] = useState<
    {row: number; col: number; orientation: 'horizontal' | 'vertical'}[]
  >([
    {row: 2, col: 2, orientation: 'horizontal'},
    // Add other walls as needed
  ]);
  const [placingWall, setPlacingWall] = useState(false);
  const [wallOrientation, setWallOrientation] = useState<
    'horizontal' | 'vertical'
  >('horizontal');
  const [availableWalls, setAvailableWalls] = useState(10);

  const handleCellPress = (row: number, col: number) => {
    if (placingWall && availableWalls > 0) {
      setWalls([...walls, {row, col, orientation: wallOrientation}]);
      setPlacingWall(false);
      setAvailableWalls(availableWalls - 1);
    } else if (selected) {
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
    <View style={styles.container}>
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
      <View style={styles.controls}>
        <Text>Orientation:</Text>
        <View style={styles.switchContainer}>
          <Text>Horizontal</Text>
          <Switch
            value={wallOrientation === 'vertical'}
            onValueChange={value =>
              setWallOrientation(value ? 'vertical' : 'horizontal')
            }
          />
          <Text>Vertical</Text>
        </View>
        <Button title="Place Wall" onPress={() => setPlacingWall(true)} />
      </View>
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
  controls: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default Board;
