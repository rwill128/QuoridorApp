import { GameLogic, GameState } from './GameLogic.tsx'; // Import the necessary classes

self.onmessage = function(e: MessageEvent) {
    const { initialState, iterations } = e.data;

    // Initialize the game logic with the initial state
    const gameLogic = new GameLogic(initialState);
    gameLogic.run(iterations); // Run MCTS for the specified iterations

    // Find the best move
    const chosenMove = gameLogic.bestWinRatio(gameLogic.root);

    // Send the result back to the main thread
    self.postMessage(chosenMove);
};
