// Constants for players
const human = 'X';
const ai = 'O';

// Game state variables
let board = Array(9).fill(null);
let gameActive = true;

// Winning combinations (indices in the board array)
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Select all boxes (cells) from the DOM
const boxes = document.querySelectorAll('.box');

// Add click event listeners to each box
boxes.forEach((box, index) => {
  box.addEventListener('click', () => handleBoxClick(index));
});

// Listen for reset button click
document.getElementById('reset').addEventListener('click', resetGame);

/**
 * Handles the human’s click on a box.
 * @param {number} index - The index of the clicked box.
 */
function handleBoxClick(index) {
  // Only allow moves if game is active and the cell is empty
  if (!gameActive || board[index] !== null) return;

  // Human makes a move
  makeMove(index, human);

  // Check if the human move ends the game
  let result = checkWinner(board);
  if (result !== null) {
    endGame(result);
    return;
  }

  // Let the AI make its move after a short delay
  setTimeout(aiTurn, 500);
}

/**
 * Executes the AI’s turn using the minimax algorithm.
 */
function aiTurn() {
  if (!gameActive) return;

  // Use minimax to get the best available move for the AI
  const bestMove = minimax(board, ai).index;
  if (bestMove === undefined) return; // No moves left (should be a tie)

  // AI makes its move
  makeMove(bestMove, ai);

  // Check if the AI move ends the game
  let result = checkWinner(board);
  if (result !== null) {
    endGame(result);
  }
}

/**
 * Places a move on the board and updates the UI.
 * @param {number} index - The index on the board.
 * @param {string} player - The player symbol ("X" or "O").
 */
function makeMove(index, player) {
  board[index] = player;
  boxes[index].innerText = player;
}

/**
 * Checks the current board for a winner or tie.
 * @param {Array} board - The current board state.
 * @returns {string|null} - Returns "X", "O", "tie", or null if the game continues.
 */
function checkWinner(board) {
  // Check for a win in each winning combination
  for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // Return the winning symbol
    }
  }
  // If every cell is filled, it's a tie
  if (board.every(cell => cell !== null)) {
    return 'tie';
  }
  return null; // No winner yet
}

/**
 * Ends the game by setting gameActive to false, displaying the result,
 * and then automatically resetting the game after the user clicks "OK".
 * @param {string} result - "X", "O", or "tie".
 */
function endGame(result) {
  gameActive = false;
  if (result === 'tie') {
    alert("It's a tie!");
  } else {
    alert(`${result} wins!`);
  }
  // After clicking OK on the alert, reset the game automatically
  resetGame();
}

/**
 * Resets the game to its initial state.
 */
function resetGame() {
  board = Array(9).fill(null);
  gameActive = true;
  boxes.forEach(box => {
    box.innerText = "";
  });
}

/**
 * Returns an array of indexes on the board that are still empty.
 * @param {Array} newBoard - The board state to check.
 * @returns {number[]} - Array of indexes.
 */
function emptyIndices(newBoard) {
  return newBoard.map((cell, index) => (cell === null ? index : null))
                 .filter(index => index !== null);
}

/**
 * Implements the minimax algorithm to determine the best move.
 * @param {Array} newBoard - The current board state.
 * @param {string} player - The player to evaluate for ("X" or "O").
 * @returns {Object} - An object with properties 'index' and 'score'.
 */
function minimax(newBoard, player) {
  // Get available spots on the board
  let availSpots = emptyIndices(newBoard);

  // Check for terminal states and assign scores
  let winner = null;
  for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
      winner = newBoard[a];
      break;
    }
  }
  if (winner === human) {
    return { score: -10 };
  } else if (winner === ai) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  // Array to collect all move objects
  let moves = [];

  // Loop through available spots
  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = availSpots[i];

    // Temporarily set the spot to the current player
    newBoard[availSpots[i]] = player;

    // Recursively evaluate the resulting game state
    if (player === ai) {
      let result = minimax(newBoard, human);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, ai);
      move.score = result.score;
    }

    // Undo the move
    newBoard[availSpots[i]] = null;
    moves.push(move);
  }

  // Choose the best move based on who is playing
  let bestMove;
  if (player === ai) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
