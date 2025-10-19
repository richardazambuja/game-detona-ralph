// ...existing code...
const state = {
    view: {
        squares: document.querySelectorAll('.square'),
        enemy: document.querySelector('.enemy'),
        timeLeft: document.querySelector('#time-left'),
        score: document.querySelector('#score'),
        live: document.querySelector('#live'),
    },
    values: {
        timerId: null,
        countDownTimerId: null, // não iniciar aqui
        gameVelociuty: 600,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        lives: 3,
        isRunning: false, // controla se o jogo está ativo
    },
};
// ...existing code...

function countDown() {
    if (!state.values.isRunning) return;

    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0) {
        // finaliza o jogo e reinicia
        endGame('O tempo acabou! Seu placar final é: ' + state.values.result);
        restartGame();
    }
}

function playSound() {
    let audio = new Audio('./src/audios/hit.m4a');
    audio.volume = 0.2;
    audio.play();
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove('enemy');
    });

    let randomNumber = Math.floor(Math.random() * state.view.squares.length); // usa length
    let randomSquare = state.view.squares[randomNumber];
    if (!randomSquare) return;
    randomSquare.classList.add('enemy');
    state.values.hitPosition = randomSquare.id;
}

function moveEnemy() {
    // limpa timer anterior se houver
    if (state.values.timerId) {
        clearInterval(state.values.timerId);
        state.values.timerId = null;
    }
    if (!state.values.isRunning) return;

    state.values.timerId = setInterval(randomSquare, state.values.gameVelociuty);
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener('mousedown', () => {
            if (!state.values.isRunning) return; // não aceita cliques quando jogo parado

            if (square.id === state.values.hitPosition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound();
            } else {
                state.values.lives = Math.max(0, state.values.lives - 1); // evita negativo
                state.view.live.textContent = state.values.lives;
            }

            if (state.values.lives <= 0) {
                endGame('Game Over! Seu placar final é: ' + state.values.result);
                restartGame('oi');
            }
        });
    });
}

function endGame(message) {
    // para tudo e bloqueia ações
    state.values.isRunning = false;
    if (state.values.countDownTimerId) {
        clearInterval(state.values.countDownTimerId);
        state.values.countDownTimerId = null;
    }
    if (state.values.timerId) {
        clearInterval(state.values.timerId);
        state.values.timerId = null;
    }
    alert(message);
}

function restartGame() {
    // limpa timers por segurança
    endGame('Recomeçar o jogo!'); // garante que timers estejam limpos (alert vazio é rápido, mas endGame já limpa sem alert quando string vazia)
    // reseta valores
    state.values.result = 0;
    state.values.currentTime = 60;
    state.values.lives = 3;
    state.values.hitPosition = null;
    state.values.isRunning = true;

    // atualiza UI
    state.view.score.textContent = state.values.result;
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.live.textContent = state.values.lives;
    state.view.squares.forEach(sq => sq.classList.remove('enemy'));

    // reinicia timers
    state.values.countDownTimerId = setInterval(countDown, 1000);
    moveEnemy();
}

function initialize() {
    // adiciona listeners uma vez
    addListenerHitBox();

    // inicia jogo
    state.values.isRunning = true;
    state.view.score.textContent = state.values.result;
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.live.textContent = state.values.lives;

    state.values.countDownTimerId = setInterval(countDown, 1000);
    moveEnemy();
}

initialize();
// ...existing code...