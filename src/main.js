import './style.css'

const cells = document.querySelectorAll(".Cell")
const yearSpan = document.getElementById("year");
const currentYear = new Date().getFullYear();
yearSpan.textContent = currentYear;



const combinations = [
    [1,2,3], [4,5,6], [7,8,9],
    [1,4,7], [2,5,8], [3,6,9],
    [1,5,9], [7,5,3]
]


const winCombos = combinations.sort(() => Math.random() -0.5).slice(0, 2)


let gameOver = false;

function checkWin(combo) {
    if (gameOver) return;

    if (combo.length >= 3) {
        for (let win of winCombos) {
            if (win.every(num => combo.includes(num))) {
                console.log("you win");
                gameOver = true; 
                return true;
        }
    }   
}
return false;
}


function makeMove(cell, symbol) {

  const img = document.createElement("img");
  img.src = symbol;
  img.alt = "player move";
  img.className = "play-img";

  cell.textContent = "";
  cell.appendChild(img)
  cell.style.pointerEvents = "none";
}


let playerMoves = [];
let computerMoves = [];
let availableCells = [1,2,3,4,5,6,7,8,9];

let computerTargetCombo = winCombos[Math.floor(Math.random() * winCombos.length)];


function computerPlay() {
  if (availableCells.length === 0 || gameOver) return;

  let winningMove;
  for (let combo of winCombos) {
    const matches = combo.filter(num => computerMoves.includes(num));
    const emptySpot = combo.find(num => availableCells.includes(num));

    if (matches.length === 2 && emptySpot !== undefined) {
      winningMove = emptySpot;
      break;
    }
  }

  let blockingMove;
  for (let combo of winCombos) {
    const matches = combo.filter(num => playerMoves.includes(num));
    const emptySpot = combo.find(num => availableCells.includes(num));

    if (matches.length === 2 && emptySpot !== undefined) {
      blockingMove = emptySpot;
      break;
    }
  }

  const move = computerTargetCombo.find(num => availableCells.includes(num));

   const finalMove = winningMove !== undefined
    ? winningMove
    : blockingMove !== undefined
      ? blockingMove
      : move !== undefined
        ? move
        : availableCells[Math.floor(Math.random() * availableCells.length)];


    const cell = document.querySelector(`[data-index='${finalMove}']`);

    computerMoves.push(finalMove);
    availableCells = availableCells.filter(num => num !== finalMove);


    makeMove(cell, "robot GIF.webp");



    if (checkWin(computerMoves)) {
        showMessage("Computer wins 😔", "lose");
        gameOver = true;
    } else if (availableCells.length === 0 && !gameOver) {
      resetTwoCells();
    }
}

function showMessage(text, type = "info") {
  const msgBox = document.getElementById("game-message");
  msgBox.textContent = text;
  msgBox.className = `show ${type}`;
  
  setTimeout(() => {
    msgBox.className = "hidden";
  }, 2000);
}


function resetTwoCells() {
  const cellsToClear = [];

  for (let i = 0; i < winCombos.length && cellsToClear.length < 2; i++) {
    const combo = winCombos[i];
    const occupiedCombo = combo.filter(n => !availableCells.includes(n));

    let pick = occupiedCombo.length > 0
      ? occupiedCombo[Math.floor(Math.random() * occupiedCombo.length)]
      : combo[Math.floor(Math.random() * combo.length)];

    if (cellsToClear.includes(pick)) {
      const alternatives = combo.filter(n => n !== pick);
      const altOccupied = alternatives.filter(n => !availableCells.includes(n));
      pick = (altOccupied.length > 0
        ? altOccupied[Math.floor(Math.random() * altOccupied.length)]
        : alternatives[Math.floor(Math.random() * alternatives.length)]) || pick;
    }

    cellsToClear.push(pick);
  }

  while (cellsToClear.length < 2 && availableCells.length > 0) {
    const cand = availableCells[Math.floor(Math.random() * availableCells.length)];
    if (!cellsToClear.includes(cand)) cellsToClear.push(cand);
  }

  cellsToClear.forEach(num => {
    const cell = document.querySelector(`[data-index='${num}']`);
    if (!cell) return;

    const img = document.createElement("img");
    img.src = "on fire fart GIF.webp";
    img.alt = "fire fart";
    img.className = "cell-img";

    cell.textContent = "";
    cell.appendChild(img);
  });

  setTimeout(() => {
    cellsToClear.forEach(num => {
      const cell = document.querySelector(`[data-index='${num}']`);
      if (!cell) return;

      cell.textContent = "";
      cell.style.pointerEvents = "auto";

      playerMoves = playerMoves.filter(m => m !== num);
      computerMoves = computerMoves.filter(m => m !== num);

      if (!availableCells.includes(num)) {
        availableCells.push(num);
      }
    });

    availableCells.sort((a, b) => a - b);
    gameOver = false;
     showMessage("🔥 Two cells reopened! Keep playing!", "info");
}, 1000);
}



cells.forEach(cell => {
  cell.addEventListener("click", () => {
    if (gameOver) return;

    const idx = parseInt(cell.dataset.index, 10);
    if (!availableCells.includes(idx)) return;

    playerMoves.push(idx);
    availableCells = availableCells.filter(num => num !== idx);
    makeMove(cell, "Simpson GIF.webp");

    if (checkWin(playerMoves)) {
      showMessage("You win 🎉", "win");
      gameOver = true;
      return;
    }

    if (availableCells.length === 0 && !gameOver) {
      resetTwoCells();
      return;
    }

    setTimeout(computerPlay, 500); 
  });
});



const resetBtn = document.getElementById("reset-btn");

resetBtn.addEventListener("click", resetGame);

function resetGame() {
  // Clear all cell content
  cells.forEach(cell => {
    cell.textContent = "";
    cell.style.pointerEvents = "auto";
  });

  // Reset variables
  playerMoves = [];
  computerMoves = [];
  availableCells = [1,2,3,4,5,6,7,8,9];
  gameOver = false;

  // Shuffle new win combinations
  const shuffled = combinations.sort(() => Math.random() - 0.5);
  winCombos.length = 0;
  winCombos.push(...shuffled.slice(0, 2));

  // Pick new computer target combo
  computerTargetCombo = winCombos[Math.floor(Math.random() * winCombos.length)];

  showMessage("Game reset! New combos ready 🔁", "info");
}
