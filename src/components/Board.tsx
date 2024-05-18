import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Switch,
  Text, TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import Piece from "./Piece";
import Wall from "./Wall";
import { canMoveTo } from "./CanMoveTo";
import { GameLogic, GameState } from "./GameLogic";

const Board: React.FC = () => {
  const [playerOnePiecePosition, setPlayerOnePiecePosition] = useState({
    row: 8,
    col: 4
  });
  const [playerTwoPiecePosition, setPlayerTwoPiecePosition] = useState({
    row: 0,
    col: 4
  });
  const [playerOneSelected, setPlayerOneSelected] = useState(false);
  const [playerTwoSelected, setPlayerTwoSelected] = useState(false);
  const [playerOneTurn, setPlayerOneTurn] = useState(true);
  const [playerTwoTurn, setPlayerTwoTurn] = useState(false);
  const [playerTwoIsAI, setPlayerTwoIsAI] = useState(true);
  const [walls, setWalls] = useState<
    { row: number; col: number; orientation: "horizontal" | "vertical", color: string }[]
  >([]);
  const [placingWall, setPlacingWall] = useState(false);
  const [wallOrientation, setWallOrientation] = useState<
    "horizontal" | "vertical"
  >("horizontal");
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
      const chosenColor = playerOneTurn ? "red" : "orange";
      setWalls([...walls, { row, col, orientation: wallOrientation, color: chosenColor }]);
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
            setPlayerOnePiecePosition({ row, col });
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
        if (playerTwoIsAI) {
          // Initialize the game logic with an initial state
          const initialState: GameState = {
            board: [[false, false, false, false, false, false, false, false, false],
              [false, false, false, false, false, false, false, false, false],
              [false, false, false, false, false, false, false, false, false],
              [false, false, false, false, false, false, false, false, false],
              [false, false, false, false, false, false, false, false, false],
              [false, false, false, false, false, false, false, false, false],
              [false, false, false, false, false, false, false, false, false],
              [false, false, false, false, false, false, false, false, false],
              [false, false, false, false, false, false, false, false, false]],
            playerTurn: 1,
            playerOneCol: playerOnePiecePosition.col,
            playerOneRow: playerOnePiecePosition.row,
            playerTwoCol: playerTwoPiecePosition.col,
            playerTwoRow: playerTwoPiecePosition.row,
          };
          initialState.board[playerOnePiecePosition.col][playerOnePiecePosition.row] = true
          initialState.board[playerTwoPiecePosition.col][playerTwoPiecePosition.row] = true

          const gameLogic = new GameLogic(initialState);
          gameLogic.run(10); // Run MCTS for 1000 iterations

          const chosenMove = gameLogic.mostWins(gameLogic.root)

          console.log(chosenMove)

          setPlayerTwoPiecePosition({ row: chosenMove.state.playerTwoRow, col: chosenMove.state.playerTwoCol} )
          setTurnToBlue();
          setPlayerTwoSelected(false);
        } else {
          if (playerTwoSelected) {
            if (canMoveTo(row, col, playerTwoPiecePosition, playerOnePiecePosition, walls)) {
              setPlayerTwoPiecePosition({ row, col });
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
        </TouchableWithoutFeedback>
      );
    }
  }

  function restartGame() {
    setWalls([]);
    setPlayerOneTurn(true);
    setPlayerTwoTurn(false);
    setPlayerTurnMessage("Blue's Turn");
    setPlayerOnePiecePosition({ row: 8, col: 4 });
    setPlayerTwoPiecePosition({ row: 0, col: 4 });
    setPlayerOneAvailableWalls(10);
    setPlayerTwoAvailableWalls(10);
  }

  return (
    <View style={styles.container}>
      <Button
        title="New Game"
        onPress={() => restartGame()}
      />
      <Text>{playerTurnMessage}</Text>
      <View style={styles.board}>
        {grid}
        <Piece
          position={playerOnePiecePosition}
          isSelected={playerOneSelected}
          color={"blue"}
          onPress={handleCellPress}
        />
        <Piece
          position={playerTwoPiecePosition}
          isSelected={playerTwoSelected}
          color={"black"}
          onPress={handleCellPress}
        />
        {walls.map((wall, index) => (
          <Wall
            key={index}
            position={{ row: wall.row, col: wall.col }}
            orientation={wall.orientation}
            color={wall.color}
          />
        ))}
      </View>
      <View>
        <Text>Black's available walls: {playerTwoAvailableWalls}</Text>
        <Text>Blue's available walls: {playerOneAvailableWalls}</Text>
      </View>
      <View style={styles.controls}>
        <Text>Orientation:</Text>
        <View style={styles.switchContainer}>
          <Text>Horizontal</Text>
          <Switch
            value={wallOrientation === "vertical"}
            onValueChange={value =>
              setWallOrientation(value ? "vertical" : "horizontal")
            }
            trackColor={{ false: "#ff8c00", true: "#ff8c00" }}
            thumbColor={"#f4f3f4"}
            disabled={playerOneAvailableWalls <= 0}
          />
          <Text>Vertical</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            placingWall ? styles.buttonEmphasis : null
          ]}
          onPress={() => setPlacingWall(true)}
        >
          <Text style={styles.buttonText}>Place Wall</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  board: {
    width: 360,
    height: 360,
    backgroundColor: "#eee",
    flexDirection: "row",
    flexWrap: "wrap",
    position: "relative"
  },
  cell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc"
  },
  controls: {
    marginTop: 20,
    alignItems: "center"
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  button: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: "#007BFF"
  },
  buttonEmphasis: {
    borderWidth: 2,
    borderColor: "yellow",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10
  },
  buttonText: {
    color: "#fff",
    textAlign: "center"
  }
});

export default Board;
