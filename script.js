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
    board.forEach((arr) => arr.forEach((elem) => elem.emptyValue()));
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

const GameController = () => {
  const winner = document.querySelector(".winner");
  const board = GameBoard();
  const players = [];
  let activePlayer = players[0];

  const addPlayers = () => {
    const playerOne = document.getElementById("player-one").value;
    const playerTwo = document.getElementById("player-two").value;

    players.push({ name: playerOne }, { name: playerTwo });
    activePlayer = players[0];
  };

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const resetPlayer = () => {
    if (winner.textContent !== "" && activePlayer === players[0]) {
      [players[0], players[1]] = [players[1], players[0]];
    } else if (winner.textContent !== "" && activePlayer === players[1]) {
      [players[1], players[0]] = [players[0], players[1]];
      console.log(players);
    } else {
      activePlayer = players[0];
    }
  };
  const getActivePlayer = () => activePlayer;

  const playRound = (row, column) => {
    const array = board.getBoard();
    const player = getActivePlayer().name;
    let value = activePlayer === players[0] ? "X" : "O";

    board.addCellValue(row, column, value);

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

    const gameDraw = () => {
      const fullBoard = array.every((arr) =>
        arr.every((elem) => elem.getValue() !== "")
      );

      if (fullBoard === true && winner.textContent === "") {
        winner.textContent = "Game Drawn!";
      }
    };
    rowWinner();
    columnWinner();
    diagonalWinner();
    gameDraw();

    switchPlayer();
    DisplayController.updateScreen();
  };

  return {
    playRound,
    addPlayers,
    resetPlayer,
    getActivePlayer,
    getBoard: board.getBoard,
  };
};

const DisplayController = (function () {
  const displayDiv = document.querySelector("#game-board");
  const currentPlayer = document.querySelector(".turn");
  const winner = document.querySelector(".winner");
  const form = document.querySelector(".game-form");
  const restart = document.querySelector(".restart-game");
  const game = GameController();

  const initialDisplay = () => {
    const div1 = document.createElement("div");
    const div2 = document.createElement("div");
    const inputOneLabel = document.createElement("label");
    const inputOne = document.createElement("input");
    const inputTwoLabel = document.createElement("label");
    const inputTwo = document.createElement("input");
    const button = document.createElement("button");

    inputOneLabel.setAttribute("for", "player-one");
    inputOneLabel.textContent = "Player One Name";
    inputOne.setAttribute("type", "text");
    inputOne.setAttribute("id", "player-one");
    inputTwoLabel.setAttribute("for", "player-two");
    inputTwoLabel.textContent = "Player Two Name";
    inputTwo.setAttribute("type", "text");
    inputTwo.setAttribute("id", "player-two");
    button.classList.add("form-button");
    button.setAttribute("type", "submit");
    button.textContent = "Start Game";

    div1.appendChild(inputOneLabel);
    div1.appendChild(inputOne);
    div2.appendChild(inputTwoLabel);
    div2.appendChild(inputTwo);
    form.appendChild(div1);
    form.appendChild(div2);
    form.appendChild(button);

    function clickHandler() {
      const formButton = document.querySelector(".form-button");

      formButton.addEventListener("click", (e) => {
        e.preventDefault();
        game.addPlayers();
        form.textContent = "";
        updateScreen();
      });
    }
    clickHandler();
  };

  const updateScreen = () => {
    const board = game.getBoard();
    const player = game.getActivePlayer().name;
    console.log(player);
    let num = 0;

    currentPlayer.textContent =
      winner.textContent === "" ? `${player}'s Turn` : "";

    // Clear board
    displayDiv.textContent = "";
    restart.textContent = "";

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

    // Create restart-game button
    const restartButton = document.createElement("button");
    restartButton.classList.add("restart-button");
    restartButton.textContent = "Restart Game";
    restart.appendChild(restartButton);

    function clickHandler() {
      const squares = document.querySelectorAll(".cell");
      const restartButton = document.querySelector(".restart-button");

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

      restartButton.addEventListener("click", () => {
        board.forEach((arr) => arr.forEach((elem) => elem.emptyValue()));

        game.resetPlayer();

        winner.textContent = "";

        updateScreen();
      });
    }
    clickHandler();
  };

  return { initialDisplay, updateScreen };
})();
DisplayController.initialDisplay();
