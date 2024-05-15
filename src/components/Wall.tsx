import React from 'react';
import {View, StyleSheet} from 'react-native';

interface WallProps {
  position: {
    row: number;
    col: number;
  };
  orientation: 'horizontal' | 'vertical';
}

const Wall: React.FC<WallProps> = ({position, orientation}) => {
  const {row, col} = position;
  const isHorizontal = orientation === 'horizontal';
  const style = isHorizontal ? styles.horizontalWall : styles.verticalWall;

  return (
    <View
      style={[
        style,
        {
          top: isHorizontal ? row * 40 - 5 : row * 40,
          left: isHorizontal ? col * 40 : col * 40 - 5,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontalWall: {
    width: 80,
    height: 10,
    backgroundColor: 'brown',
    position: 'absolute',
  },
  verticalWall: {
    width: 10,
    height: 80,
    backgroundColor: 'brown',
    position: 'absolute',
  },
});

export default Wall;
