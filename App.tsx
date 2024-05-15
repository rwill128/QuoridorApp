/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';

import Board from './src/components/Board';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gameContainer}>
        <Board />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameContainer: {
    width: 360,
    height: 360,
  },
});

export default App;
