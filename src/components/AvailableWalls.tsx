import React from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  PanResponderInstance,
} from 'react-native';

interface AvailableWallsProps {
  count: number;
  onPickWall: (orientation: 'horizontal' | 'vertical') => void;
}

const AvailableWalls: React.FC<AvailableWallsProps> = ({count, onPickWall}) => {
  const panResponder: PanResponderInstance = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      console.log("Got to Pan Responder Grant")
      onPickWall('horizontal'); // Assume horizontal for simplicity
    },
  });

  const walls = [];
  for (let i = 0; i < count; i++) {
    walls.push(
      <View key={i} style={styles.wall} {...panResponder.panHandlers} />,
    );
  }

  return <View style={styles.container}>{walls}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  wall: {
    width: 20,
    height: 80,
    backgroundColor: 'brown',
    marginHorizontal: 5,
  },
});

export default AvailableWalls;
