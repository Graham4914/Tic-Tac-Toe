//GAMEBOARD MODULE
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""]; //Gameboard array

    //funtion to reder board to console/dom
    const render = () => {
        console.log(board[0] + "|" + board[1] + "|" + board[2]);
        console.log("-----");
        console.log(board[3] + "|" + board[4] + "|" + board[5]);
        console.log("-----")
        console.log(board[6] + "|" + board[7] + "|" + board[8]);
    };

    //function to move
    const makeMove = (position, player) => {
        //check if position is valid and empty
        if (position >= 0 && position < board.length && board[position] === "") {
            board[position] = player; // player either X or O
            render();    // re-render the gameboard
            return true;
        } else {
            console.log("Invalid move. Try again");
            return false;
        }
    };

    //function to reset the board
    const reset = () => {
        board = ["", "", "", "", "", "", "", "", ""];
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

//GAME CONTROLLER 
const GameController = (() => {
    const player1 = Player('Player 1', 'X');
    const player2 = Player('Player 2', 'O');
    let currentPlayer = player1;

    //funtction to change current player
    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    //funtion to start or reset the game
    const startGame = () => {
        Gameboard.reset();
        //set player 1 to start
        currentPlayer = player1;
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
    //function to play round
    const playRound = (position) => {
        if (Gameboard.makeMove(position, currentPlayer.getMarker())) {
            console.log(`${currentPlayer.getName()} made a move at position ${position}.`);

            if (checkWin(currentPlayer.getMarker())) {
                console.log(`${currentPlayer.getName()} Wins!`);
                return;
            } else if (checkTie()) {
                console.log("It's a tie!");
                //handle tie
                return;
            } else {
                //otherwise switch players
                switchPlayer();
                console.log(`It's now ${currentPlayer.getName()}'s turn`);
            }

        }
    };

    return { startGame, playRound };
})();


GameController.startGame();
GameController.playRound(0);
GameController.playRound(7);
GameController.playRound(1);
GameController.playRound(4);
GameController.playRound(2);
GameController.playRound(3);
