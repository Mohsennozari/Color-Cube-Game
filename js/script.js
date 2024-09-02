document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const numCubes = [16, 25, 36];
    let currentDifficulty = 0;
    let score = 0;
    let timer = 0;
    let countdown = 60;
    let highScore = 0;
    let leaderboard = [];
    let timerInterval;
    let countdownInterval;
    const clickSound = document.getElementById('clickSound');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const toggleMusicButton = document.getElementById('toggleMusic');
    const instructionsOverlay = document.getElementById('instructions');
    const closeInstructionsButton = document.getElementById('closeInstructions');

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function createCubes(num) {
        gameBoard.innerHTML = '';
        for (let i = 0; i < num; i++) {
            const cube = document.createElement('div');
            cube.classList.add('cube', document.getElementById('shapeSelector').value);
            cube.style.backgroundColor = getRandomColor();
            cube.style.width = `${document.getElementById('cubeSizeSelector').value}px`;
            cube.style.height = `${document.getElementById('cubeSizeSelector').value}px`;

            cube.addEventListener('click', () => {
                cube.classList.add('rotate');
                setTimeout(() => {
                    cube.classList.remove('rotate');
                    cube.style.backgroundColor = getRandomColor();
                }, 500);
                score++;
                updateScore();
                increaseDifficulty();
                clickSound.play();
            });
            gameBoard.appendChild(cube);
        }
    }

    function updateScore() {
        document.getElementById('score').textContent = `Score: ${score}`;
        updateHighScore();
    }

    function updateHighScore() {
        if (score > highScore) {
            highScore = score;
            document.getElementById('highScore').textContent = `High Score: ${highScore}`;
        }
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timer++;
            document.getElementById('timer').textContent = `Time: ${timer}`;
        }, 1000);
    }

    function startCountdown() {
        countdownInterval = setInterval(() => {
            countdown--;
            document.getElementById('countdown').textContent = `Countdown: ${countdown}s`;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                alert('Time is up!');
                document.getElementById('countdown').textContent = 'Countdown: 0s';
            }
        }, 1000);
    }

    function increaseDifficulty() {
        if (score % 10 === 0) { // every 10 points
            currentDifficulty = Math.min(currentDifficulty + 1, numCubes.length - 1);
            createCubes(numCubes[currentDifficulty]);
        }
    }

    function saveScore() {
        leaderboard.push(score);
        leaderboard.sort((a, b) => b - a);
        if (leaderboard.length > 5) leaderboard.pop();
        updateLeaderboard();
    }

    function updateLeaderboard() {
        const leaderboardList = document.getElementById('leaderboardList');
        leaderboardList.innerHTML = '';
        leaderboard.forEach((score, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `Player ${index + 1}: ${score}`;
            leaderboardList.appendChild(listItem);
        });
    }

    document.getElementById('difficultySelector').addEventListener('change', (event) => {
        currentDifficulty = parseInt(event.target.value);
        createCubes(numCubes[currentDifficulty]);
    });

    document.getElementById('cubeSizeSelector').addEventListener('change', (event) => {
        const size = event.target.value;
        document.querySelectorAll('.cube').forEach(cube => {
            cube.style.width = `${size}px`;
            cube.style.height = `${size}px`;
        });
    });

    document.getElementById('shapeSelector').addEventListener('change', (event) => {
        const shape = event.target.value;
        document.querySelectorAll('.cube').forEach(cube => {
            cube.className = `cube ${shape}`;
        });
    });

    document.getElementById('colorPicker').addEventListener('input', (event) => {
        const color = event.target.value;
        document.querySelectorAll('.cube').forEach(cube => {
            cube.style.backgroundColor = color;
        });
    });

    document.getElementById('backgroundColorPicker').addEventListener('input', (event) => {
        const color = event.target.value;
        gameBoard.style.backgroundColor = color;
    });

    document.getElementById('saveProfile').addEventListener('click', () => {
        const username = document.getElementById('username').value;
        document.getElementById('userProfile').textContent = `Profile: ${username} - Score: ${score}`;
    });

    document.getElementById('resetButton').addEventListener('click', () => {
        score = 0;
        timer = 0;
        countdown = 60;
        createCubes(numCubes[currentDifficulty]);
        updateScore();
        document.getElementById('timer').textContent = `Time: ${timer}`;
        document.getElementById('countdown').textContent = `Countdown: ${countdown}s`;
    });

    document.getElementById('resetHighScore').addEventListener('click', () => {
        highScore = 0;
        document.getElementById('highScore').textContent = `High Score: ${highScore}`;
    });

    document.getElementById('toggleMusic').addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            toggleMusicButton.textContent = 'Pause Music';
        } else {
            backgroundMusic.pause();
            toggleMusicButton.textContent = 'Play Music';
        }
    });

    closeInstructionsButton.addEventListener('click', () => {
        instructionsOverlay.style.display = 'none';
    });

    createCubes(numCubes[currentDifficulty]);
    startTimer();
    startCountdown();
});
