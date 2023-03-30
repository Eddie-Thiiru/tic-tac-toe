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
    const obj = board[row][column];

    if (obj.getValue() === "") {
      obj.addValue(player);
    }
  };

  const removeCellValue = () => {
    board.map((arr) => arr.map((obj) => obj.emptyValue()));
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
    board.addCellValue(row, column, getActivePlayer().value);
    // const cell = board.getBoard()[row][column];
    // console.log(cell.getValue());
    const winner = document.querySelector(".winner");
    const array = board.getBoard();

    let playerOneCount = 0;
    let playerTwoCount = 0;

    for (let i = 0; i < array.length; i++) {
      console.log(array[i]);

      for (let j = 0; j < array[i].length; j++) {
        const value = array[i][j].getValue();
        if (value === "X") {
          playerOneCount += 1;
        } else if (value === "O") {
          playerTwoCount += 1;
        }
      }
    }
    switchPlayer();
    DisplayController.display();

    console.log(playerOneCount, playerTwoCount);
    if (playerOneCount === 3) {
      console.log("player one has three! Player One Wins!");
      winner.textContent = `Player One Wins!`;
      // create new board to start a new game
      // board.removeCellValue();
      // DisplayController.display();
    }

    // array.map((arr) => {
    //   const playerOneCount = arr.filter(
    //     (obj) => obj.getValue() === "X"

    //     // if (objValue === "X") {
    //     //   x += 1;
    //     // } else if (objValue === "O") {
    //     //   o += 1;
    //     // }
    //   );
    //   const playerTwoCount = arr.filter((obj) => obj.getValue() === "O");
    //   console.log(playerOneCount);
    //   console.log(playerTwoCount);
    //   if (playerOneCount.length === 3) {
    //     console.log("player one has three");
    //     return;
    //   }
    // });
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
            // display();
          }
        })
      );
    }
    clickHandler();
  };

  return { display };
})();
DisplayController.display();
