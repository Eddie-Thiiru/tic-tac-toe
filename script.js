const gameBoard = () => {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(cell());
    }
  }

  const getBoard = () => board;

  return { getBoard };
};

const cell = () => {
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

  const board = gameBoard();

  let activePlayer = players[0];

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => switchPlayer();

  return { getBoard: board.getBoard, getActivePlayer };
};

const displayController = () => {
  const displayDiv = document.querySelector("#game-board");
  const game = gameController();

  const display = () => {
    const board = game.getBoard();
    console.log(board);

    board.forEach((row) => {
      row.forEach((cell, index) => {
        const square = document.createElement("button");
        square.classList.add("cell");
        square.dataset.cell = index;
        square.textContent = cell.getValue();

        displayDiv.appendChild(square);
      });
    });
  };
  display();
};
displayController();
