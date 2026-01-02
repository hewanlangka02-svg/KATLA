const KAMUS = ["ABADI", "ACARA", "AKTIF", "ALBUM", "ANDAL", "ANGKA", "ARSIP", "ARTIS", "ASING", "BAGAN", "BAHWA", "BAKTI", "BALOK", "BATAS", "BEBAS", "BENAR", "BENDA", "BERAS", "BESAR", "BUKTI", "BUKIT", "BUNGA", "BUTUH", "CANDA", "CEPAT", "CERIA", "CUKUP", "DARAH", "DARAT", "DASAR", "DEKAT", "DERET", "DRAMA", "DUNIA", "EJAAN", "FAKTA", "FOKUS", "GARIS", "GAJAH", "GELAS", "GERAK", "GURUN", "HABIS", "HAKIM", "HARAP", "HARTA", "HASIL", "HIDUP", "HITAM", "IDEAL"];

// 1. Tentukan Jawaban Hari Ini
const today = new Date().toDateString();
const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
const ANSWER = KAMUS[seed % KAMUS.length];

let currentAttempt = 0;
let currentGuess = "";
let isGameOver = false;

// 2. Muat Data dari LocalStorage
let savedProgress = JSON.parse(localStorage.getItem("katla_save"));
let history = (savedProgress && savedProgress.date === today) ? savedProgress.history : [];

const board = document.getElementById("board");

function initGame() {
    // Buat Grid Kotak
    for (let i = 0; i < 6; i++) {
        const row = document.createElement("div");
        row.className = "row";
        for (let j = 0; j < 5; j++) {
            const tile = document.createElement("div");
            tile.className = "tile";
            row.appendChild(tile);
        }
        board.appendChild(row);
    }

    // Jika ada history tebakan hari ini, tampilkan kembali
    if (history.length > 0) {
        history.forEach((guess) => {
            renderGuess(guess);
            currentAttempt++;
        });
        checkWinLoss(history[history.length - 1]);
    }
}

// 3. Logika Input Keyboard
document.addEventListener("keydown", (e) => {
    if (isGameOver) return;

    if (e.key === "Enter") {
        if (currentGuess.length === 5) {
            processGuess(currentGuess);
        }
    } else if (e.key === "Backspace") {
        currentGuess = currentGuess.slice(0, -1);
        updateVisual();
    } else if (currentGuess.length < 5 && /^[a-zA-Z]$/.test(e.key)) {
        currentGuess += e.key.toUpperCase();
        updateVisual();
    }
});

function updateVisual() {
    const rows = document.querySelectorAll(".row");
    const tiles = rows[currentAttempt].querySelectorAll(".tile");
    for (let i = 0; i < 5; i++) {
        tiles[i].innerText = currentGuess[i] || "";
    }
}

function processGuess(guess) {
    renderGuess(guess);
    
    // Simpan ke History & LocalStorage
    history.push(guess);
    localStorage.setItem("katla_save", JSON.stringify({
        date: today,
        history: history
    }));

    checkWinLoss(guess);
    currentAttempt++;
    currentGuess = "";
}

function renderGuess(guess) {
    const rows = document.querySelectorAll(".row");
    const tiles = rows[currentAttempt].querySelectorAll(".tile");
    
    for (let i = 0; i < 5; i++) {
        const char = guess[i];
        tiles[i].innerText = char;
        
        if (char === ANSWER[i]) {
            tiles[i].classList.add("correct");
        } else if (ANSWER.includes(char)) {
            tiles[i].classList.add("present");
        } else {
            tiles[i].classList.add("absent");
        }
    }
}

function checkWinLoss(guess) {
    if (guess === ANSWER) {
        document.getElementById("message").innerText = "🎉 Menang! Jawaban: " + ANSWER;
        isGameOver = true;
    } else if (history.length === 6) {
        document.getElementById("message").innerText = "❌ Kalah! Jawaban: " + ANSWER;
        isGameOver = true;
    }
}

initGame();
