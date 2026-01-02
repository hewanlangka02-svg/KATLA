const ANSWER = "SURYA"; // Ganti dengan logika random dari kamus KBBI
const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

let currentAttempt = 0;
let currentGuess = "";

const board = document.getElementById("board");

// Inisialisasi Board
for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < WORD_LENGTH; j++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        row.appendChild(tile);
    }
    board.appendChild(row);
}

// Logika Input Keyboard
document.addEventListener("keydown", (e) => {
    if (currentAttempt >= MAX_ATTEMPTS) return;

    if (e.key === "Enter") {
        if (currentGuess.length === WORD_LENGTH) {
            checkGuess();
        }
    } else if (e.key === "Backspace") {
        currentGuess = currentGuess.slice(0, -1);
    } else if (currentGuess.length < WORD_LENGTH && /^[a-zA-Z]$/.test(e.key)) {
        currentGuess += e.key.toUpperCase();
    }
    updateBoard();
});

function updateBoard() {
    const rows = document.querySelectorAll(".row");
    const tiles = rows[currentAttempt].querySelectorAll(".tile");
    
    for (let i = 0; i < WORD_LENGTH; i++) {
        tiles[i].innerText = currentGuess[i] || "";
    }
}

function checkGuess() {
    const rows = document.querySelectorAll(".row");
    const tiles = rows[currentAttempt].querySelectorAll(".tile");
    let checkAnswer = ANSWER;

    for (let i = 0; i < WORD_LENGTH; i++) {
        const char = currentGuess[i];
        if (char === ANSWER[i]) {
            tiles[i].classList.add("correct");
        } else if (ANSWER.includes(char)) {
            tiles[i].classList.add("present");
        } else {
            tiles[i].classList.add("absent");
        }
    }

    if (currentGuess === ANSWER) {
        alert("Selamat! Anda Benar!");
    } else {
        currentAttempt++;
        currentGuess = "";
        if (currentAttempt === MAX_ATTEMPTS) {
            alert("Game Over! Jawabannya adalah: " + ANSWER);
        }
    }
}
