import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';

interface PieceProps {
  position: {
    row: number;
    col: number;
  };
  isSelected?: boolean;
  onPress: (row: number, col: number) => void; // Add onPress prop
}

const Piece: React.FC<PieceProps> = ({ position, isSelected, onPress }) => {
  const { row, col } = position;

  return (
    <TouchableWithoutFeedback onPress={() => onPress(row, col)}>
      <View style={[styles.piece, { top: row * 40, left: col * 40, borderColor: isSelected ? 'yellow' : 'transparent' }]} />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  piece: {
    width: 40,
    height: 40,
    backgroundColor: 'blue',
    position: 'absolute',
    borderWidth: 3,
  },
});

export default Piece;
