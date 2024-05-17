import React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native';
import Piece from './Piece';
import Wall from './Wall';
import Game from './Game';

interface BoardProps {
  game: Game;
  onWallPlace: (row: number, col: number) => void;
}

const Board: React.FC<BoardProps> = ({game, onWallPlace}) => {
  const handleCellPress = (row: number, col: number) => {
    onWallPlace(row, col);
  };

  const grid = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      grid.push(
        <TouchableWithoutFeedback
          key={`${row}-${col}`}
          onPress={() => handleCellPress(row, col)}>
          <ImageBackground
            source={require('../assets/grid_texture.png')}
            style={styles.cell}
          />
        </TouchableWithoutFeedback>,
      );
    }
  }

  return (
    <View style={styles.board}>
      {grid}
      <Piece
        position={game.pawnOfTurn.position}
        isSelected={false}
        onPress={handleCellPress}
      />
      {game.board.walls.horizontal.map((row, rowIndex) =>
        row.map((hasWall, colIndex) =>
          hasWall ? (
            <Wall
              key={`h-${rowIndex}-${colIndex}`}
              position={{row: rowIndex, col: colIndex}}
              orientation="horizontal"
            />
          ) : null,
        ),
      )}
      {game.board.walls.vertical.map((row, rowIndex) =>
        row.map((hasWall, colIndex) =>
          hasWall ? (
            <Wall
              key={`v-${rowIndex}-${colIndex}`}
              position={{row: rowIndex, col: colIndex}}
              orientation="vertical"
            />
          ) : null,
        ),
      )}
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
