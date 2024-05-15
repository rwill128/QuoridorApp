import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native';

interface PieceProps {
  position: {
    row: number;
    col: number;
  };
  isSelected?: boolean;
  onPress: (row: number, col: number) => void; // Add onPress prop
}

const Piece: React.FC<PieceProps> = ({position, isSelected, onPress}) => {
  const {row, col} = position;

  return (
    <TouchableWithoutFeedback onPress={() => onPress(row, col)}>
      <ImageBackground
        source={require('../../assets/piece_texture.png')}
        style={[
          styles.piece,
          {
            top: row * 40,
            left: col * 40,
            borderColor: isSelected ? 'yellow' : 'transparent',
          },
        ]}
      />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  piece: {
    width: 40,
    height: 40,
    position: 'absolute',
    borderWidth: 3,
  },
});

export default Piece;
