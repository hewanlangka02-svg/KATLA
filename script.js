const KAMUS = ["ABADI", "ACARA", "AKTIF", "ALBUM", "ANDAL", "ANGKA", "ARSIP", "ARTIS", "ASING", "BAGAN", "BAHWA", "BAKTI", "BALOK", "BATAS", "BEBAS", "BENAR", "BENDA", "BERAS", "BESAR", "BUKTI", "BUKIT", "BUNGA", "BUTUH", "CANDA", "CEPAT", "CERIA", "CUKUP", "DARAH", "DARAT", "DASAR", "DEKAT", "DERET", "DRAMA", "DUNIA", "EJAAN", "FAKTA", "FOKUS", "GARIS", "GAJAH", "GELAS", "GERAK", "GURUN", "HABIS", "HAKIM", "HARAP", "HARTA", "HASIL", "HIDUP", "HITAM", "IDEAL"];

// 1. Inisialisasi Jawaban (Satu kata per hari)
const today = new Date().toDateString();
const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
const ANSWER = KAMUS[seed % KAMUS.length];

let currentAttempt = 0;
let currentGuess = "";
let isGameOver = false;

// 2. Local Storage
let saved = JSON.parse(localStorage.getItem("katla_save"));
let history = (saved && saved.date === today) ? saved.history : [];

function init() {
    const board = document.getElementById("board");
    // Buat Grid
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

    createKeyboard();

    // Muat history jika ada
    if (history.length > 0) {
        history.forEach(guess => {
            renderGuess(guess);
            currentAttempt++;
        });
        checkEndGame(history[history.length - 1]);
    }
}

function createKeyboard() {
    const container = document.getElementById("keyboard-container");
    const rows = ["QWERTYUIOP", "ASDFGHJKL", "ENTER,ZXCVBNM,DEL"];
    
    rows.forEach(rowStr => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "key-row";
        const keys = rowStr.split(",");
        
        keys.forEach(k => {
            if (k.length > 1 && k !== "DEL" && k !== "ENTER") {
                k.split("").forEach(char => makeKey(char, rowDiv));
            } else {
                makeKey(k, rowDiv);
            }
        });
        container.appendChild(rowDiv);
    });
}

function makeKey(label, parent) {
    const btn = document.createElement("button");
    btn.innerText = label;
    btn.className = "key" + (label.length > 1 ? " large" : "");
    btn.onclick = () => handleInput(label === "DEL" ? "BACKSPACE" : label);
    parent.appendChild(btn);
}

function handleInput(key) {
    if (isGameOver) return;
    const k = key.toUpperCase();

    if (k === "ENTER") {
        if (currentGuess.length === 5) {
            processGuess(currentGuess);
        }
    } else if (k === "BACKSPACE") {
        currentGuess = currentGuess.slice(0, -1);
        updateBoard();
    } else if (currentGuess.length < 5 && /^[A-Z]$/.test(k)) {
        currentGuess += k;
        updateBoard();
    }
}

function updateBoard() {
    const rows = document.querySelectorAll(".row");
    const tiles = rows[currentAttempt].querySelectorAll(".tile");
    for (let i = 0; i < 5; i++) {
        tiles[i].innerText = currentGuess[i] || "";
    }
}

function processGuess(guess) {
    renderGuess(guess);
    history.push(guess);
    localStorage.setItem("katla_save", JSON.stringify({date: today, history: history}));
    checkEndGame(guess);
    currentAttempt++;
    currentGuess = "";
}

function renderGuess(guess) {
    const rows = document.querySelectorAll(".row");
    const tiles = rows[currentAttempt].querySelectorAll(".tile");
    let checkAns = ANSWER;

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

function checkEndGame(guess) {
    if (guess === ANSWER) {
        document.getElementById("message").innerText = "🎉 MANTAP!";
        isGameOver = true;
    } else if (history.length === 6) {
        document.getElementById("message").innerText = "SOLUSI: " + ANSWER;
        isGameOver = true;
    }
}

document.addEventListener("keydown", (e) => handleInput(e.key));
init();
