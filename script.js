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

  const cellValue = (row, column, player) => {
    const obj = board[row][column];

    if (obj.getValue() === "") {
      obj.addValue(player);
    }
  };

  return { getBoard, cellValue };
};

const Cell = () => {
  let value = "";

  const addValue = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addValue, getValue };
};

const gameController = (playerOne = "Player One", playerTwo = "Player Two") => {
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
    board.cellValue(row, column, getActivePlayer().value);
    switchPlayer();
  };

  return { playRound, getActivePlayer, getBoard: board.getBoard };
};

const DisplayController = () => {
  const displayDiv = document.querySelector("#game-board");
  const game = gameController();

  const display = () => {
    const board = game.getBoard();
    let num = 0;
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

          if (square.textContent === "") {
            game.playRound(selectedRow, selectedColumn);
            display();
          }
        })
      );
    }
    clickHandler();
  };
  display();
};
DisplayController();
