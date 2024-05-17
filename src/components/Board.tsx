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
  const [playerOnePiecePosition, setPlayerOnePiecePosition] = useState({
    row: 8,
    col: 4,
  });
  const [playerTwoPiecePosition, setPlayerTwoPiecePosition] = useState({
    row: 0,
    col: 4,
  });
  const [playerOneSelected, setPlayerOneSelected] = useState(false);
  const [playerTwoSelected, setPlayerTwoSelected] = useState(false);
  const [playerOneTurn, setPlayerOneTurn] = useState(true);
  const [playerTwoTurn, setPlayerTwoTurn] = useState(false);
  const [playerTwoIsAI, setPlayerTwoIsAI] = useState(false);
  const [walls, setWalls] = useState<
    {row: number; col: number; orientation: 'horizontal' | 'vertical', color: string}[]
  >([
    {row: 2, col: 2, orientation: 'horizontal', color: 'red'},
    // Add other walls as needed
  ]);
  const [placingWall, setPlacingWall] = useState(false);
  const [wallOrientation, setWallOrientation] = useState<
    'horizontal' | 'vertical'
  >('horizontal');
  const [playerOneAvailableWalls, setPlayerOneAvailableWalls] = useState(10);
  const [playerTwoAvailableWalls, setPlayerTwoAvailableWalls] = useState(10);
  const [playerTurnMessage, setPlayerTurnMessage] = useState("Blue's Turn");

  function setTurnToBlack() {
    setPlayerTurnMessage("Black's Turn");
    setPlayerOneTurn(false);
    setPlayerTwoTurn(true);
  }

  function setTurnToBlue() {
    setPlayerTurnMessage("Blue's Turn");
    setPlayerOneTurn(true);
    setPlayerTwoTurn(false);
  }

  const handleCellPress = (row: number, col: number) => {
    if (placingWall && ((playerOneTurn && playerOneAvailableWalls > 0) || (playerTwoTurn && playerTwoAvailableWalls > 0))) {
      const chosenColor = playerOneTurn ? 'red' : 'orange'
      setWalls([...walls, {row, col, orientation: wallOrientation, color: chosenColor}]);
      setPlacingWall(false);
      if (playerOneTurn) {
        setPlayerOneAvailableWalls(playerOneAvailableWalls - 1);
        setTurnToBlack();
      }
      if (playerTwoTurn) {
        setPlayerTwoAvailableWalls(playerTwoAvailableWalls - 1);
        setTurnToBlue();
      }
    } else {
      if (playerOneTurn) {
        if (playerOneSelected) {
          if (canMoveTo(row, col, playerOnePiecePosition, playerTwoPiecePosition, walls)) {
            setPlayerOnePiecePosition({row, col});
            setTurnToBlack();
          }
          setPlayerOneSelected(false);
        } else {
          if (
            playerOnePiecePosition.row === row &&
            playerOnePiecePosition.col === col
          ) {
            setPlayerOneSelected(true);
          }
        }
      }

      if (playerTwoTurn) {
        if (playerTwoSelected) {
          if (canMoveTo(row, col, playerTwoPiecePosition, playerOnePiecePosition, walls)) {
            setPlayerTwoPiecePosition({row, col});
            setTurnToBlue();
          }
          setPlayerTwoSelected(false);
        } else {
          if (
            playerTwoPiecePosition.row === row &&
            playerTwoPiecePosition.col === col
          ) {
            setPlayerTwoSelected(true);
          }
        }
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
      <Text>{playerTurnMessage}</Text>
      <View style={styles.board}>
        {grid}
        <Piece
          position={playerOnePiecePosition}
          isSelected={playerOneSelected}
          color={'blue'}
          onPress={handleCellPress}
        />
        <Piece
          position={playerTwoPiecePosition}
          isSelected={playerTwoSelected}
          color={'black'}
          onPress={handleCellPress}
        />
        {walls.map((wall, index) => (
          <Wall
            key={index}
            position={{row: wall.row, col: wall.col}}
            orientation={wall.orientation}
            color={wall.color}
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
            disabled={playerOneAvailableWalls <= 0}
          />
          <Text>Vertical</Text>
        </View>
        <Button
          title="Place Wall"
          onPress={() => setPlacingWall(true)}
          disabled={playerOneAvailableWalls <= 0}
        />
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
