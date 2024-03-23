//GAMEBOARD MODULE
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""]; //Gameboard array

    //funtion to reder board to console/dom
    const render = () => {
        console.log(board[0] + "|" + board[1] + "|" + board[2]);
        console.log("-----");
        console.log(board[3] + "|" + board[4] + "|" + board[5]);
        console.log("-----");
        console.log(board[6] + "|" + board[7] + "|" + board[8]);

        const cells = document.querySelectorAll('.grid-square');
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    //function to move
    const makeMove = (position, player) => {
        //check if position is valid and empty
        if (position >= 0 && position < board.length && board[position] === "") {
            board[position] = player; // player either X or O
            render();    // re-render the gameboard
            const cell = document.querySelector(`.grid-square[data-index="${position}"]`);
            if (player === 'X') {
                cell.classList.add('x-marker');
            } else if (player === 'O') {
                cell.classList.add('o-marker');
            }



            return true;
        } else {
            console.log("Invalid move. Try again");
            return false;
        }
    };

    //function to reset the board
    const reset = () => {
        board = ["", "", "", "", "", "", "", "", ""];
        // Additional code to reset square classes and content
        const squares = document.querySelectorAll('.grid-square');
        squares.forEach(square => {
            square.classList.remove('x-marker', 'o-marker'); // Replace with your actual classes
            square.textContent = '';
        });
    };

    const getValueAt = (index) => board[index];
    //publicly accessable
    return { render, makeMove, reset, getValueAt };
})();


//test log
// Gameboard.render();
// Gameboard.makeMove(0, 'X');
// Gameboard.makeMove(1, 'O');



//PLAYER FACTORY
const Player = (name, marker) => {
    const getName = () => name;
    const getMarker = () => marker;

    //return object with public props and methods
    return { getName, getMarker };
};

// //test log
// const player1 = Player('Alice', 'X');
// const player2 = Player('Bob', 'O');

// console.log(player1.getName());
// console.log(player1.getMarker());
// console.log(player2.getName());
// console.log(player2.getMarker());



// This function will toggle the board's interactivity
const toggleBoardInteractivity = (enable) => {
    const squares = document.querySelectorAll('.grid-square');
    squares.forEach(square => {
        if (enable) {
            square.classList.remove('disabled');
        } else {
            square.classList.add('disabled');
        }
    });
};


//GAME CONTROLLER 
const GameController = (() => {
    let player1;
    let player2;
    let currentPlayer; // to be set at game start


    //funtction to change current player
    const switchPlayer = () => {

        currentPlayer = currentPlayer === player1 ? player2 : player1;
        updateStatus(`${currentPlayer.getName()}'s Turn`);
    };

    //funtion to start or reset the game
    const startGame = (player1Name, player2Name) => {

        player1 = Player(player1Name, 'X');
        player2 = Player(player2Name, 'O');
        currentPlayer = player1;
        Gameboard.reset();

        toggleBoardInteractivity(true);
        document.getElementById('name-input').classList.add('hidden');
        updateStatus(`${currentPlayer.getName()}'s turn`)
        Gameboard.render();
    };
    const newGame = () => {
        // Clear the board and render it again
        Gameboard.reset();
        Gameboard.render();

        toggleBoardInteractivity(false);
        // Reset the game over flag
        isGameOver = false;

        // Clear the game info
        updateStatus("");


        document.getElementById('player1-name').value = '';
        document.getElementById('player2-name').value = '';
        document.getElementById('name-input').classList.remove('hidden');

        isGameOver = false;
        updateStatus("Enter names to start a new game.");

        Gameboard.reset();

    };



    //function to check win
    const checkWin = (marker) => {
        //winning combos
        const winConditions = [
            [0, 1, 2], //top row
            [3, 4, 5], //middle row
            [6, 7, 8], //bottom row
            [0, 3, 6], //left col
            [1, 4, 7], //middle col
            [2, 5, 8], //right col
            [0, 4, 8], //left diagonal
            [2, 4, 6]  //right diagonal
        ];

        //check if an winning conditions
        return winConditions.some(combination => {
            return combination.every(index => {
                return Gameboard.getValueAt(index) === marker;
            });
        });
    };

    //function to check tie
    const checkTie = () => {
        //check if all space are filled
        return [...Array(9).keys()].every(index => Gameboard.getValueAt(index) !== "");
    };
    // funtion to update status message
    let messageHistory = [];

    const updateStatus = (message) => {

        console.log(`Updating status to: ${message}`);
        const gameInfo = document.getElementById('game-info');
        gameInfo.textContent = message;
    };

    const restartGame = () => {
        Gameboard.reset();
        currentPlayer = player1;
        isGameOver = false;
        updateStatus(currentPlayer.getName() + "'s turn");
        Gameboard.render();
    }


    const endGame = (message) => {
        updateStatus(message);
        isGameOver = true;

    };

    let isGameOver = false;

    const getIsGameOver = () => isGameOver;

    //function to play round
    const playRound = (position) => {
        if (isGameOver) return;
        if (Gameboard.makeMove(position, currentPlayer.getMarker())) {
            updateStatus(`${currentPlayer.getName()} made a move at position ${position}.`);
            Gameboard.render();

            if (checkWin(currentPlayer.getMarker())) {
                endGame(`${currentPlayer.getName()} Wins!`);
                return true;
            } else if (checkTie()) {
                endGame("It's a tie!");
                //handle tie
                return true;
            } else {
                //otherwise switch players
                switchPlayer();
                updateStatus(`It's now ${currentPlayer.getName()}'s turn`);
            }

        }
    };

    const getCurrentPlayer = () => {
        return currentPlayer;
    }


    return { startGame, playRound, getCurrentPlayer, updateStatus, endGame, restartGame, getIsGameOver, newGame };
})();



document.addEventListener('DOMContentLoaded', () => {
    const newGameButton = document.getElementById('new-game-button');
    newGameButton.addEventListener('click', GameController.newGame);

    const startGameButton = document.getElementById('start-game-button');
    startGameButton.addEventListener('click', function () {
        const player1Name = document.getElementById('player1-name').value || 'Player 1';
        const player2Name = document.getElementById('player2-name').value || 'Player 2'

        document.getElementById('name-input');
        GameController.startGame(player1Name, player2Name);
    })
    // ---
    const restartButton = document.getElementById('restart-button');
    restartButton.addEventListener('click', GameController.restartGame);
    const boardElement = document.getElementById('game-board');
    const gameInfo = document.getElementById('game-info');

    //clear previous content
    boardElement.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const square = document.createElement('div');
        square.classList.add('grid-square');
        square.dataset.index = i;
        square.addEventListener('click', (function (index) {
            return function () {
                //if game is over dont allow moves
                if (GameController.getIsGameOver()) {
                    return;
                }
                //get marker before making move
                const marker = GameController.getCurrentPlayer().getMarker();
                //check if square is empty before move
                if (Gameboard.getValueAt(index) === "") {
                    if (GameController.playRound(index)) {

                    };
                    square.textContent = marker;

                }

            };
        })(i));
        boardElement.appendChild(square);

    }
});