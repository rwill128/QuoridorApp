import React from 'react';
import {View, StyleSheet} from 'react-native';

interface WallProps {
  position: {
    row: number;
    col: number;
  };
  orientation: 'horizontal' | 'vertical';
  color: string;
}

const Wall: React.FC<WallProps> = ({position, orientation, color}) => {
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
          backgroundColor: color,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontalWall: {
    width: 80,
    height: 10,
    position: 'absolute',
  },
  verticalWall: {
    width: 10,
    height: 80,
    position: 'absolute',
  },
});

export default Wall;
