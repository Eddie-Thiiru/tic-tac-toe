const GameBoard = () => {
  const rows = 3;
  const columns = 3;
  const board = [];

  // Creates a 2d array
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

  return { getBoard, addCellValue };
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

  const addPlayers = (playerOne, playerTwo) => {
    if (playerOne === "" && playerTwo === "") {
      players.push({ name: "Player One" }, { name: "Player Two" });
    } else {
      players.push({ name: playerOne }, { name: playerTwo });
    }

    activePlayer = players[0];
  };

  const switchPlayer = () => {
    if (winner.textContent !== "") {
      return;
    }
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const resetPlayer = () => {
    if (winner.textContent !== "") {
      [players[0], players[1]] = [players[1], players[0]];
      activePlayer = players[0];
    } else {
      activePlayer = players[0];
    }
  };

  const getActivePlayer = () => activePlayer;

  const getComputerChoice = () => {
    if (winner.textContent !== "") {
      return;
    }

    const array = board.getBoard();
    const randomRow = randomInt(3);
    const randomColumn = randomInt(3);
    const cellPosition = array[randomRow][randomColumn];

    function randomInt(max) {
      return Math.floor(Math.random() * max);
    }

    if (cellPosition.getValue() === "") {
      setTimeout(() => {
        playRound(randomRow, randomColumn);
      }, 0.8 * 1000);
    } else {
      getComputerChoice();
    }
  };

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
      } else if (playerTwoDiagonal(array) === true) {
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
    getComputerChoice,
    playRound,
    addPlayers,
    resetPlayer,
    getActivePlayer,
    getBoard: board.getBoard,
  };
};

const DisplayController = (function () {
  const container = document.querySelector(".container");
  const currentPlayer = document.querySelector(".turn");
  const winner = document.querySelector(".winner");
  const screen = document.querySelector(".screen");
  const multiPlayerContainer = document.querySelector(".multiple-players");
  const singlePlayerContainer = document.querySelector(".single-player");
  const form = document.querySelector(".game-form");
  const game = GameController();

  const startScreen = () => {
    currentPlayer.textContent = "Choose Opponent";

    // Creates a form for player name inputs
    const div1 = document.createElement("div");
    const div2 = document.createElement("div");
    const inputOneLabel = document.createElement("label");
    const inputOne = document.createElement("input");
    const inputTwoLabel = document.createElement("label");
    const inputTwo = document.createElement("input");
    const button = document.createElement("button");

    div1.setAttribute("class", "player1-container");
    div2.setAttribute("class", "player2-container");
    inputOneLabel.setAttribute("for", "player-one");
    inputOneLabel.textContent = "Player One Name";
    inputOne.setAttribute("type", "text");
    inputOne.setAttribute("id", "player-one");
    inputTwoLabel.setAttribute("for", "player-two");
    inputTwoLabel.textContent = "Player Two Name";
    inputTwo.setAttribute("type", "text");
    inputTwo.setAttribute("id", "player-two");
    button.type = "submit";
    button.classList.add("form-button");
    button.textContent = "Start Game";

    div1.appendChild(inputOneLabel);
    div1.appendChild(inputOne);
    div2.appendChild(inputTwoLabel);
    div2.appendChild(inputTwo);
    form.appendChild(div1);
    form.appendChild(div2);
    form.appendChild(button);

    // Creates a button for player vs computer option
    const singlePlayer = document.createElement("button");

    singlePlayer.type = "button";
    singlePlayer.classList.add("computer-button");
    singlePlayer.textContent = "Start Game";

    singlePlayerContainer.appendChild(singlePlayer);

    function clickHandler() {
      const formButton = document.querySelector(".form-button");
      const singlePlayerButton = document.querySelector(".computer-button");

      formButton.addEventListener("click", (e) => {
        const playerOne = document.getElementById("player-one").value;
        const playerTwo = document.getElementById("player-two").value;

        e.preventDefault();
        game.addPlayers(playerOne, playerTwo);

        screen.textContent = "";

        createBoardContainer();
        updateScreen();
      });

      singlePlayerButton.addEventListener("click", () => {
        game.addPlayers("Computer", "Player");

        screen.textContent = "";

        createBoardContainer();
        updateScreen();
        game.getComputerChoice();
      });
    }
    clickHandler();
  };

  // Creates board container and restart container
  const createBoardContainer = () => {
    const boardContainer = document.createElement("div");
    const restartContainer = document.createElement("div");
    const restartButton = document.createElement("button");

    boardContainer.id = "game-board";
    restartContainer.classList.add("restart-game");
    restartButton.classList.add("restart-button");
    restartButton.textContent = "Restart Game";

    screen.appendChild(boardContainer);
    screen.appendChild(restartContainer);
    restartContainer.appendChild(restartButton);

    function clickHandler() {
      const restartButton = document.querySelector(".restart-button");
      const board = game.getBoard();

      restartButton.addEventListener("click", () => {
        board.forEach((arr) =>
          arr.forEach((elem) => {
            elem.emptyValue();
          })
        );

        game.resetPlayer();
        winner.textContent = "";
        updateScreen();

        if (currentPlayer.textContent === "Computer's Turn") {
          game.getComputerChoice();
        }
      });
    }
    clickHandler();
  };

  const updateScreen = () => {
    const boardContainer = document.querySelector("#game-board");
    const board = game.getBoard();
    const player = game.getActivePlayer().name;

    let num = 0;

    currentPlayer.textContent =
      winner.textContent === "" ? `${player}'s Turn` : "";

    // Clear board
    boardContainer.textContent = "";

    // Create board cells
    board.forEach((row) => {
      row.forEach((cell, index) => {
        const square = document.createElement("button");
        square.type = "button";
        square.classList.add("cell");
        square.dataset.column = index;
        square.dataset.num = num;
        square.textContent = cell.getValue();
        boardContainer.appendChild(square);
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

          if (
            currentPlayer.textContent === "Computer's Turn" &&
            winner.textContent === ""
          ) {
            game.getComputerChoice();
          }
        })
      );
    }
    clickHandler();
  };

  return { startScreen, updateScreen };
})();
DisplayController.startScreen();
