const startButton = document.querySelector('button[data-start]');
const stopButton = document.querySelector('button[data-stop]');

let timerI = null;

startButton.addEventListener('click', onButtonStart);
stopButton.addEventListener('click', onButtonStop);

function onButtonStart() {
    timerI = setInterval(() => {
        document.body.style.backgroundColor = getRandomHexColor();
        startButton.setAttribute('disabled', 'disabled');
    }, 1000);
}

function onButtonStop() {
    clearInterval(timerI);
    startButton.removeAttribute('disabled', 'disabled')
}

function getRandomHexColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
} x

