import React, {useState, useEffect} from 'react';
import {View, Button, StyleSheet, Text, Switch} from 'react-native';
import Game from './Game';
import Board from './Board-backup'; // Ensure this path is correct

const App: React.FC = () => {
  const [game, setGame] = useState(new Game(true));
  const [placingWall, setPlacingWall] = useState(false);
  const [wallOrientation, setWallOrientation] = useState<
    'horizontal' | 'vertical'
  >('horizontal');

  const handlePlaceWall = () => {
    setPlacingWall(true);
  };

  const handleWallPlacement = (row: number, col: number) => {
    if (placingWall) {
      if (wallOrientation === 'horizontal') {
        game.placeHorizontalWall(row, col, true);
      } else {
        game.placeVerticalWall(row, col, true);
      }
      setPlacingWall(false);
    }
  };

  useEffect(() => {
    setGame(new Game(true));
  }, []);

  return (
    <View style={styles.container}>
      <Board game={game} onWallPlace={handleWallPlacement} />
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
        <Button title="Place Wall" onPress={handlePlaceWall} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

export default App;
