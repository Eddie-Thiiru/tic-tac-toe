const GameBoard = () => {
  const rows = 3;
  const columns = 3;
  const board = [];

  // Create a 2d array
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const addCellValue = (row, column, player) => {
    const elem = board[row][column];

    if (elem.getValue() === "") {
      elem.addValue(player);
    }
  };

  const removeCellValue = () => {
    board.map((arr) => arr.map((elem) => elem.emptyValue()));
  };

  return { getBoard, addCellValue, removeCellValue };
};

const Cell = () => {
  let value = "";

  const addValue = (player) => {
    value = player;
  };

  const emptyValue = () => {
    value = "";
  };

  const getValue = () => value;

  return { addValue, emptyValue, getValue };
};

const GameController = (playerOne = "Player One", playerTwo = "Player Two") => {
  const players = [
    { name: playerOne, value: "X" },
    { name: playerTwo, value: "O" },
  ];

  const board = GameBoard();

  let activePlayer = players[0];

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const playRound = (row, column) => {
    const winner = document.querySelector(".winner");
    const array = board.getBoard();
    const player = getActivePlayer().name;
    console.log(player.name);

    board.addCellValue(row, column, getActivePlayer().value);

    const rowWinner = () => {
      array.forEach((arr) => {
        const playerOneRow = arr.every((elem) => elem.getValue() === "X");
        const playerTwoRow = arr.every((elem) => elem.getValue() === "O");

        if (playerOneRow === true || playerTwoRow === true) {
          winner.textContent = `${player} Wins!`;
        }
      });
    };

    const columnWinner = () => {
      const playerOneColumn = (arr, n) =>
        arr.every((elem) => elem[n].getValue() === "X");
      const playerTwoColumn = (arr, n) =>
        arr.every((elem) => elem[n].getValue() === "O");

      if (
        playerOneColumn(array, 0) === true ||
        playerOneColumn(array, 1) === true ||
        playerOneColumn(array, 2) === true
      ) {
        winner.textContent = `${player} Wins!`;
      }

      if (
        playerTwoColumn(array, 0) === true ||
        playerTwoColumn(array, 1) === true ||
        playerTwoColumn(array, 2) === true
      ) {
        winner.textContent = `${player} Wins!`;
      }
    };

    const diagonalWinner = () => {
      const playerOneDiagonal = (arr) => {
        if (
          (arr[0][0].getValue() === "X" &&
            arr[1][1].getValue() === "X" &&
            arr[2][2].getValue() === "X") ||
          (arr[0][2].getValue() === "X" &&
            arr[1][1].getValue() === "X" &&
            arr[2][0].getValue() === "X")
        ) {
          return true;
        }
      };

      const playerTwoDiagonal = (arr) => {
        if (
          (arr[0][0].getValue() === "O" &&
            arr[1][1].getValue() === "O" &&
            arr[2][2].getValue() === "O") ||
          (arr[0][2].getValue() === "O" &&
            arr[1][1].getValue() === "O" &&
            arr[2][0].getValue() === "O")
        ) {
          return true;
        }
      };

      if (playerOneDiagonal(array) === true) {
        winner.textContent = `${player} Wins!`;
      }

      if (playerTwoDiagonal(array) === true) {
        winner.textContent = `${player} Wins!`;
      }
    };
    rowWinner();
    columnWinner();
    diagonalWinner();

    switchPlayer();
    DisplayController.display();
  };

  return { playRound, getActivePlayer, getBoard: board.getBoard };
};

const DisplayController = (function () {
  const displayDiv = document.querySelector("#game-board");
  const currentPlayer = document.querySelector(".turn");
  const winner = document.querySelector(".winner");
  const game = GameController();

  const display = () => {
    const board = game.getBoard();
    const player = game.getActivePlayer().name;
    let num = 0;

    currentPlayer.textContent = `${player}'s Turn`;

    // Clear board
    displayDiv.textContent = "";

    board.forEach((row) => {
      row.forEach((cell, index) => {
        const square = document.createElement("button");
        square.classList.add("cell");
        square.dataset.column = index;
        square.dataset.num = num;
        square.textContent = cell.getValue();
        displayDiv.appendChild(square);
      });
      num++;
    });

    function clickHandler() {
      const squares = document.querySelectorAll(".cell");

      squares.forEach((square) =>
        square.addEventListener("click", (e) => {
          const selectedRow = e.target.dataset.num;
          const selectedColumn = e.target.dataset.column;

          if (winner.textContent !== "") {
            return;
          }

          if (square.textContent === "") {
            game.playRound(selectedRow, selectedColumn);
          }
        })
      );
    }
    clickHandler();
  };

  return { display };
})();
DisplayController.display();
