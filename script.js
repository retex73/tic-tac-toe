// Cache DOM elements
const cells = document.querySelectorAll('.cell');
const winner = document.getElementById('winner');
winner.style.display = 'none';

// Set up game variables
let currentPlayer = 'X';
let gameEnded = false;

// Set up event listeners for cells
cells.forEach(function (cell) {
    cell.addEventListener('click', function () {
        cellClicked(cell.id);
    });
});

function setGameMessage(message) {
    winner.style.display = message !== '' ? 'block' : 'none';
    winner.innerHTML = message;
}
// Handle cell clicks
function cellClicked(cellId) {
    const cell = document.getElementById(cellId);
    if (cell.innerHTML !== '') {
        return;
    }
    // create a text node with the current player
    const text = document.createTextNode(currentPlayer);
    // append it to the cell
    cell.appendChild(text);
    // set the color style
    cell.style.color = currentPlayer === 'X' ? 'red' : 'blue';
    checkGameStatus();
}

// Check if game has ended
function checkGameStatus() {
    if (checkWin(currentPlayer)) {

        setGameMessage(`Player ${currentPlayer} has won!`);
        gameEnded = true;
    } else if (checkTie()) {

        setGameMessage(`It's a tie!`);
        gameEnded = true;
    } else {
        switchPlayer();
    }
}

// Switch player
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (currentPlayer === 'O') {
        computerMove();
    }

}

// Check for a win
function checkWin(player) {
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
    return winCombos.some(function (combo) {
        return combo.every(function (index) {
            return cells[index].innerHTML === player;
        });
    });
}

// Check for a tie
function checkTie() {
    return Array.from(cells).every(function (cell) {
        return cell.innerHTML !== '';
    });
}

// Reset game
function resetGame() {
    Array.from(cells).forEach(function (cell) {
        cell.innerHTML = '';
    });
    setGameMessage('');
    currentPlayer = 'X';
    gameEnded = false;
}

// Minimax algorithm for computer move
function minimax(board, player) {
    if (checkWin('O')) {
        return { score: 1 };
    } else if (checkWin('X')) {
        return { score: -1 };
    } else if (checkTie()) {
        return { score: 0 };
    }

    let bestScore = player === 'O' ? -Infinity : Infinity;
    let bestMove = -1;

    board.forEach((cell, i) => {
        if (cell === '') {
            board[i] = player;
            const result = minimax(board, player === 'X' ? 'O' : 'X');
            board[i] = '';
            bestScore = player === 'O' ? Math.max(bestScore, result.score) : Math.min(bestScore, result.score);
            bestMove = bestScore === result.score ? i : bestMove;
        }
    });

    return { score: bestScore, move: bestMove };
}

// Computer move
function computerMove() {
    const board = Array.from(cells).map(cell => cell.innerHTML);
    const result = minimax(board, 'O'); // get the result object
    const cellId = 'cell-' + result.move; // use the move property and add a dash
    // call the cellClicked function to make the computer move
    cellClicked(cellId); // use the move property
}
