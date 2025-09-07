// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});

// Typing Animation for Hero Text
const texts = ["Hello World!", "Hi, I'm Sarthak..!", "Let's design something amazing!"];
let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typing-text');

function typeText() {
    const currentText = texts[currentTextIndex];
    
    if (!isDeleting && currentCharIndex < currentText.length) {
        typingElement.textContent = currentText.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        setTimeout(typeText, 100);
    } else if (isDeleting && currentCharIndex > 0) {
        typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        setTimeout(typeText, 50);
    } else if (!isDeleting && currentCharIndex === currentText.length) {
        setTimeout(() => {
            isDeleting = true;
            typeText();
        }, 2000);
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % texts.length;
        setTimeout(typeText, 200);
    }
}

// Start typing animation after page loads
setTimeout(typeText, 1000);

// Theme Toggle
const themeToggleNav = document.getElementById('themeToggleNav');
const body = document.body;

if (themeToggleNav) {
    themeToggleNav.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        
        // Update icon
        const icon = themeToggleNav.querySelector('i');
        if (icon) {
            icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    });
}

// Game System Variables
let currentGame = null;
let gameCanvas = null;
let gameCtx = null;
let gameAnimationFrame = null;
let gameScore = 0;
let gameRunning = false;

// Game Modal Functions
function openGame(gameType) {
    const modal = document.getElementById('gameModal');
    const gameTitle = document.getElementById('gameTitle');
    const gameInstructions = document.getElementById('gameInstructions');
    
    if (!modal || !gameTitle || !gameInstructions) {
        console.error('Game modal elements not found');
        return;
    }
    
    modal.style.display = 'block';
    currentGame = gameType;
    gameCanvas = document.getElementById('gameCanvas');
    
    if (!gameCanvas) {
        console.error('Game canvas not found');
        return;
    }
    
    gameCtx = gameCanvas.getContext('2d');
    gameScore = 0;
    gameRunning = true;
    
    // Clear any existing animation frame
    if (gameAnimationFrame) {
        cancelAnimationFrame(gameAnimationFrame);
    }
    
    // Setup game based on type
    switch(gameType) {
        case 'doodler':
            gameTitle.textContent = 'Space Doodler';
            gameInstructions.textContent = 'Use arrow keys or click to move';
            initDoodlerGame();
            break;
        case 'cricket':
            gameTitle.textContent = 'Mini Cricket';
            gameInstructions.textContent = 'Click to hit the ball';
            initCricketGame();
            break;
        case 'golf':
            gameTitle.textContent = 'Pixel Golf';
            gameInstructions.textContent = 'Click and drag to aim';
            initGolfGame();
            break;
        case 'snake':
            gameTitle.textContent = 'Snake Remix';
            gameInstructions.textContent = 'Arrow keys to move';
            initSnakeGame();
            break;
        default:
            console.error('Unknown game type:', gameType);
    }
}

function closeGame() {
    const modal = document.getElementById('gameModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    gameRunning = false;
    
    if (gameAnimationFrame) {
        cancelAnimationFrame(gameAnimationFrame);
        gameAnimationFrame = null;
    }
    
    currentGame = null;
    gameCanvas = null;
    gameCtx = null;
}

function updateScore(score) {
    gameScore = score;
    const scoreElement = document.getElementById('gameScore');
    if (scoreElement) {
        scoreElement.textContent = `Score: ${score}`;
    }
}

// Space Doodler Game
function initDoodlerGame() {
    if (!gameCanvas || !gameCtx) return;
    
    const player = {
        x: 200,
        y: 500,
        width: 40,
        height: 40,
        velY: 0,
        jumping: false,
        color: '#00C29B'
    };

    const platforms = [];
    const stars = [];
    let keys = {};

    // Generate platforms
    for (let i = 0; i < 8; i++) {
        platforms.push({
            x: Math.random() * 320,
            y: 600 - i * 75,
            width: 80,
            height: 15
        });
    }

    // Generate stars
    for (let i = 0; i < 5; i++) {
        stars.push({
            x: Math.random() * 380,
            y: Math.random() * 600,
            width: 20,
            height: 20,
            collected: false
        });
    }

    function drawDoodler() {
        gameCtx.fillStyle = player.color;
        gameCtx.fillRect(player.x, player.y, player.width, player.height);
        
        // Draw simple face
        gameCtx.fillStyle = 'white';
        gameCtx.fillRect(player.x + 10, player.y + 10, 5, 5);
        gameCtx.fillRect(player.x + 25, player.y + 10, 5, 5);
        gameCtx.fillRect(player.x + 15, player.y + 25, 10, 3);
    }

    function drawPlatforms() {
        gameCtx.fillStyle = '#FFB800';
        platforms.forEach(platform => {
            gameCtx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });
    }

    function drawStars() {
        gameCtx.fillStyle = '#FFD24D';
        stars.forEach(star => {
            if (!star.collected) {
                gameCtx.beginPath();
                gameCtx.arc(star.x + 10, star.y + 10, 8, 0, Math.PI * 2);
                gameCtx.fill();
            }
        });
    }

    function updateDoodler() {
        // Horizontal movement
        if (keys['ArrowLeft'] && player.x > 0) {
            player.x -= 5;
        }
        if (keys['ArrowRight'] && player.x < 360) {
            player.x += 5;
        }

        // Gravity
        player.velY += 0.8;
        player.y += player.velY;

        // Platform collision
        platforms.forEach(platform => {
            if (player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y < platform.y + platform.height &&
                player.y + player.height > platform.y &&
                player.velY > 0) {
                player.velY = -15;
                player.jumping = true;
            }
        });

        // Star collection
        stars.forEach(star => {
            if (!star.collected &&
                player.x < star.x + star.width &&
                player.x + player.width > star.x &&
                player.y < star.y + star.height &&
                player.y + player.height > star.y) {
                star.collected = true;
                updateScore(gameScore + 10);
            }
        });

        // Reset if falls
        if (player.y > 600) {
            player.y = 500;
            player.x = 200;
            player.velY = 0;
        }
    }

    function gameLoop() {
        if (!gameRunning || !gameCtx) return;
        
        gameCtx.clearRect(0, 0, 400, 600);
        gameCtx.fillStyle = '#000';
        gameCtx.fillRect(0, 0, 400, 600);

        drawPlatforms();
        drawStars();
        drawDoodler();
        updateDoodler();

        if (gameRunning) {
            gameAnimationFrame = requestAnimationFrame(gameLoop);
        }
    }

    // Remove existing event listeners to prevent duplicates
    function handleKeyDown(e) {
        if (currentGame === 'doodler') {
            keys[e.key] = true;
        }
    }

    function handleKeyUp(e) {
        if (currentGame === 'doodler') {
            keys[e.key] = false;
        }
    }

    function handleCanvasClick(e) {
        if (currentGame !== 'doodler' || !gameCanvas) return;
        
        const rect = gameCanvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        if (clickX < 200) {
            player.x = Math.max(0, player.x - 20);
        } else {
            player.x = Math.min(360, player.x + 20);
        }
    }

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    gameCanvas.addEventListener('click', handleCanvasClick);

    // Store cleanup function
    currentGame.cleanup = () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
        gameCanvas.removeEventListener('click', handleCanvasClick);
    };

    gameLoop();
}

// Mini Cricket Game
function initCricketGame() {
    if (!gameCanvas || !gameCtx) return;
    
    const ball = {
        x: 50,
        y: 300,
        radius: 10,
        speedX: 3,
        speedY: 0,
        color: '#FF0000'
    };

    const bat = {
        x: 350,
        y: 280,
        width: 10,
        height: 40,
        color: '#8B4513'
    };

    let ballMoving = false;
    let runs = 0;

    function drawBall() {
        gameCtx.beginPath();
        gameCtx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        gameCtx.fillStyle = ball.color;
        gameCtx.fill();
    }

    function drawBat() {
        gameCtx.fillStyle = bat.color;
        gameCtx.fillRect(bat.x, bat.y, bat.width, bat.height);
    }

    function drawField() {
        // Ground
        gameCtx.fillStyle = '#90EE90';
        gameCtx.fillRect(0, 400, 400, 200);
        
        // Stumps
        gameCtx.fillStyle = '#8B4513';
        gameCtx.fillRect(370, 260, 5, 40);
        gameCtx.fillRect(380, 260, 5, 40);
        gameCtx.fillRect(390, 260, 5, 40);
    }

    function updateBall() {
        if (ballMoving) {
            ball.x += ball.speedX;
            ball.y += ball.speedY;

            // Bounce off walls
            if (ball.y <= 0 || ball.y >= 400) {
                ball.speedY = -ball.speedY;
            }

            // Check bat collision
            if (ball.x + ball.radius >= bat.x && 
                ball.x - ball.radius <= bat.x + bat.width &&
                ball.y >= bat.y && 
                ball.y <= bat.y + bat.height) {
                ball.speedX = -Math.abs(ball.speedX) * 1.1;
                ball.speedY = (Math.random() - 0.5) * 6;
                runs += 4;
                updateScore(runs);
            }

            // Reset if goes off screen
            if (ball.x > 400 || ball.x < 0) {
                resetBall();
            }
        }
    }

    function resetBall() {
        ball.x = 50;
        ball.y = 300;
        ball.speedX = 3 + Math.random() * 2;
        ball.speedY = (Math.random() - 0.5) * 4;
        ballMoving = false;
    }

    function cricketGameLoop() {
        if (!gameRunning || !gameCtx) return;
        
        gameCtx.clearRect(0, 0, 400, 600);
        gameCtx.fillStyle = '#87CEEB';
        gameCtx.fillRect(0, 0, 400, 400);

        drawField();
        drawBat();
        drawBall();
        updateBall();

        if (gameRunning) {
            gameAnimationFrame = requestAnimationFrame(cricketGameLoop);
        }
    }

    function handleCanvasClick() {
        if (currentGame === 'cricket' && !ballMoving) {
            ballMoving = true;
        }
    }

    gameCanvas.addEventListener('click', handleCanvasClick);

    // Store cleanup function
    currentGame.cleanup = () => {
        gameCanvas.removeEventListener('click', handleCanvasClick);
    };

    cricketGameLoop();
}

// Pixel Golf Game
function initGolfGame() {
    if (!gameCanvas || !gameCtx) return;
    
    const ball = {
        x: 50,
        y: 300,
        radius: 8,
        velX: 0,
        velY: 0,
        color: 'white',
        moving: false
    };

    const hole = {
        x: 350,
        y: 150,
        radius: 15,
        color: '#000'
    };

    const obstacles = [
        { x: 150, y: 200, width: 20, height: 100 },
        { x: 250, y: 300, width: 100, height: 20 }
    ];

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let strokes = 0;

    function drawBall() {
        gameCtx.beginPath();
        gameCtx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        gameCtx.fillStyle = ball.color;
        gameCtx.fill();
        gameCtx.strokeStyle = '#ccc';
        gameCtx.stroke();
    }

    function drawHole() {
        gameCtx.beginPath();
        gameCtx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
        gameCtx.fillStyle = hole.color;
        gameCtx.fill();
    }

    function drawObstacles() {
        gameCtx.fillStyle = '#8B4513';
        obstacles.forEach(obs => {
            gameCtx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });
    }

    function drawAimLine() {
        if (isDragging && !ball.moving) {
            gameCtx.beginPath();
            gameCtx.moveTo(ball.x, ball.y);
            gameCtx.lineTo(startX, startY);
            gameCtx.strokeStyle = '#FF0000';
            gameCtx.lineWidth = 2;
            gameCtx.stroke();
            gameCtx.lineWidth = 1;
        }
    }

    function updateBall() {
        if (ball.moving) {
            ball.x += ball.velX;
            ball.y += ball.velY;

            // Friction
            ball.velX *= 0.98;
            ball.velY *= 0.98;

            // Wall bouncing
            if (ball.x <= ball.radius || ball.x >= 400 - ball.radius) {
                ball.velX = -ball.velX * 0.7;
                ball.x = Math.max(ball.radius, Math.min(400 - ball.radius, ball.x));
            }
            if (ball.y <= ball.radius || ball.y >= 600 - ball.radius) {
                ball.velY = -ball.velY * 0.7;
                ball.y = Math.max(ball.radius, Math.min(600 - ball.radius, ball.y));
            }

            // Obstacle collision
            obstacles.forEach(obs => {
                if (ball.x + ball.radius > obs.x && 
                    ball.x - ball.radius < obs.x + obs.width &&
                    ball.y + ball.radius > obs.y && 
                    ball.y - ball.radius < obs.y + obs.height) {
                    ball.velX = -ball.velX * 0.5;
                    ball.velY = -ball.velY * 0.5;
                }
            });

            // Stop if moving very slowly
            if (Math.abs(ball.velX) < 0.1 && Math.abs(ball.velY) < 0.1) {
                ball.velX = 0;
                ball.velY = 0;
                ball.moving = false;
            }

            // Check if in hole
            const distToHole = Math.sqrt(
                (ball.x - hole.x) ** 2 + (ball.y - hole.y) ** 2
            );
            if (distToHole < hole.radius) {
                updateScore(Math.max(0, 100 - strokes * 10));
                alert(`Hole in ${strokes} strokes!`);
                // Reset
                ball.x = 50;
                ball.y = 300;
                ball.velX = 0;
                ball.velY = 0;
                ball.moving = false;
                strokes = 0;
            }
        }
    }

    function golfGameLoop() {
        if (!gameRunning || !gameCtx) return;
        
        gameCtx.clearRect(0, 0, 400, 600);
        gameCtx.fillStyle = '#90EE90';
        gameCtx.fillRect(0, 0, 400, 600);

        drawHole();
        drawObstacles();
        drawBall();
        drawAimLine();
        updateBall();

        // Draw stroke counter
        gameCtx.fillStyle = '#000';
        gameCtx.font = '16px Arial';
        gameCtx.fillText(`Strokes: ${strokes}`, 10, 30);

        if (gameRunning) {
            gameAnimationFrame = requestAnimationFrame(golfGameLoop);
        }
    }

    // Mouse events for aiming
    function handleMouseDown(e) {
        if (currentGame !== 'golf' || ball.moving || !gameCanvas) return;
        
        const rect = gameCanvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        isDragging = true;
    }

    function handleMouseMove(e) {
        if (currentGame !== 'golf' || !isDragging || !gameCanvas) return;
        
        const rect = gameCanvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
    }

    function handleMouseUp() {
        if (currentGame !== 'golf' || !isDragging || ball.moving) return;
        
        const power = Math.sqrt(
            (startX - ball.x) ** 2 + (startY - ball.y) ** 2
        ) / 20;
        ball.velX = -(startX - ball.x) / 20;
        ball.velY = -(startY - ball.y) / 20;
        ball.moving = true;
        strokes++;
        isDragging = false;
    }

    gameCanvas.addEventListener('mousedown', handleMouseDown);
    gameCanvas.addEventListener('mousemove', handleMouseMove);
    gameCanvas.addEventListener('mouseup', handleMouseUp);

    // Store cleanup function
    currentGame.cleanup = () => {
        gameCanvas.removeEventListener('mousedown', handleMouseDown);
        gameCanvas.removeEventListener('mousemove', handleMouseMove);
        gameCanvas.removeEventListener('mouseup', handleMouseUp);
    };

    golfGameLoop();
}

// Snake Remix Game
function initSnakeGame() {
    if (!gameCanvas || !gameCtx) return;
    
    const gridSize = 20;
    const tileCount = 20;
    
    const snake = [
        { x: 10, y: 10 }
    ];
    
    const food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    let dx = 0;
    let dy = 0;
    let score = 0;

    function drawGame() {
        // Clear canvas
        gameCtx.fillStyle = '#000';
        gameCtx.fillRect(0, 0, 400, 400);

        // Draw snake
        snake.forEach((segment, index) => {
            if (index === 0) {
                // Head
                gameCtx.fillStyle = '#FFB800';
            } else {
                gameCtx.fillStyle = '#00C29B';
            }
            gameCtx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });

        // Draw food
        gameCtx.fillStyle = '#FF0000';
        gameCtx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

        // Draw score
        gameCtx.fillStyle = '#FFF';
        gameCtx.font = '20px Arial';
        gameCtx.fillText(`Score: ${score}`, 10, 450);
    }

    function update() {
        if (dx === 0 && dy === 0) return; // Don't move if no direction set
        
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        // Wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            resetSnakeGame();
            return;
        }

        // Self collision
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            resetSnakeGame();
            return;
        }

        snake.unshift(head);

        // Food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            updateScore(score);
            // Generate new food position
            do {
                food.x = Math.floor(Math.random() * tileCount);
                food.y = Math.floor(Math.random() * tileCount);
            } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
        } else {
            snake.pop();
        }
    }

    function resetSnakeGame() {
        snake.length = 0;
        snake.push({ x: 10, y: 10 });
        dx = 0;
        dy = 0;
        score = 0;
        updateScore(score);
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
    }

    function snakeGameLoop() {
        if (!gameRunning) return;
        
        update();
        drawGame();
        
        setTimeout(() => {
            if (gameRunning) {
                gameAnimationFrame = requestAnimationFrame(snakeGameLoop);
            }
        }, 150);
    }

    // Controls
    function handleKeyDown(e) {
        if (currentGame !== 'snake') return;
        
        switch(e.key) {
            case 'ArrowUp':
                if (dy !== 1) { dx = 0; dy = -1; }
                break;
            case 'ArrowDown':
                if (dy !== -1) { dx = 0; dy = 1; }
                break;
            case 'ArrowLeft':
                if (dx !== 1) { dx = -1; dy = 0; }
                break;
            case 'ArrowRight':
                if (dx !== -1) { dx = 1; dy = 0; }
                break;
        }
    }

    document.addEventListener('keydown', handleKeyDown);

    // Store cleanup function
    currentGame.cleanup = () => {
        document.removeEventListener('keydown', handleKeyDown);
    };

    snakeGameLoop();
}

// Scroll Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const speed = scrolled * 0.4;
    
    if (hero) {
        const heroContent = hero.querySelector('.hero-content');
        if(heroContent) {
            heroContent.style.transform = `translateY(${speed}px)`;
            heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
        }
    }
});

// Enhanced Coding Animation Background
function createCodeWindow() {
    const bgAnimation = document.querySelector('.bg-animation');
    if (!bgAnimation) return;
    
    const codeWindow = document.createElement('div');
    codeWindow.classList.add('code-window');
    
    // Create window controls
    const controls = document.createElement('div');
    controls.classList.add('window-controls');
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.classList.add('window-dot');
        controls.appendChild(dot);
    }
    
    // Create code content
    const codeContent = document.createElement('div');
    codeContent.classList.add('code-content');
    
    const codeSnippets = [
        `import React from 'react';\n\nfunction App() {\n  const [state, setState] = useState();\n  \n  return (\n    <div className="app">\n      <h1>Hello World</h1>\n    </div>\n  );\n}`,
        `const express = require('express');\nconst app = express();\n\napp.get('/', (req, res) => {\n  res.json({\n    message: 'API Working!'\n  });\n});\n\napp.listen(3000);`,
        `function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n-1) + \n         fibonacci(n-2);\n}\n\nconsole.log(fibonacci(10));`,
        `SELECT users.name, \n       COUNT(orders.id) as orders\nFROM users \nLEFT JOIN orders \n  ON users.id = orders.user_id\nGROUP BY users.name;`,
        `class DataProcessor {\n  constructor(data) {\n    this.data = data;\n  }\n  \n  process() {\n    return this.data\n      .filter(item => item.active)\n      .map(item => item.value);\n  }\n}`
    ];
    
    const randomSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    const lines = randomSnippet.split('\n');
    
    lines.forEach((line, index) => {
        const codeLine = document.createElement('div');
        codeLine.classList.add('code-line');
        codeLine.textContent = line;
        codeLine.style.animationDelay = `${index * 0.1}s`;
        codeContent.appendChild(codeLine);
    });
    
    codeWindow.appendChild(controls);
    codeWindow.appendChild(codeContent);
    
    // Random positioning
    codeWindow.style.left = Math.random() * (window.innerWidth - 320) + 'px';
    codeWindow.style.animationDelay = Math.random() * 4 + 's';
    codeWindow.style.animationDuration = (Math.random() * 4 + 8) + 's';
    
    bgAnimation.appendChild(codeWindow);
    
    setTimeout(() => {
        if (codeWindow.parentNode) {
            codeWindow.remove();
        }
    }, 12000);
}

function createFloatingTech() {
    const bgAnimation = document.querySelector('.bg-animation');
    if (!bgAnimation) return;
    
    const techSymbols = [
        '</>', '{}', '()', '=>', 'fn', 'var', 'let', 'const',
        'HTML', 'CSS', 'JS', 'React', 'Node', 'API', 'JSON',
        '<?', '/>', '<div>', 'async', 'await', 'import', 'export'
    ];
    
    const tech = document.createElement('div');
    tech.classList.add('floating-tech');
    tech.textContent = techSymbols[Math.floor(Math.random() * techSymbols.length)];
    tech.style.left = Math.random() * 100 + '%';
    tech.style.animationDelay = Math.random() * 2 + 's';
    tech.style.animationDuration = (Math.random() * 5 + 10) + 's';
    tech.style.fontSize = (Math.random() * 1.5 + 1.5) + 'rem';
    
    bgAnimation.appendChild(tech);
    
    setTimeout(() => {
        if (tech.parentNode) {
            tech.remove();
        }
    }, 15000);
}

// Create background animations with safety checks
let codeWindowInterval;
let floatingTechInterval;

function startBackgroundAnimations() {
    if (document.querySelector('.bg-animation')) {
        codeWindowInterval = setInterval(createCodeWindow, 2000);
        floatingTechInterval = setInterval(createFloatingTech, 500);
    }
}

function stopBackgroundAnimations() {
    if (codeWindowInterval) clearInterval(codeWindowInterval);
    if (floatingTechInterval) clearInterval(floatingTechInterval);
}

// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Enhanced hover effects for interactive elements
document.addEventListener('DOMContentLoaded', () => {
    const interactiveElements = document.querySelectorAll('.btn, .project-card, .skill-item, .social-link, .game-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor && cursorFollower) {
                cursor.style.transform = 'scale(1.8)';
                cursorFollower.style.transform = 'scale(1.8)';
                cursor.style.background = 'var(--secondary-color)';
            }
        });
        
        el.addEventListener('mouseleave', () => {
            if (cursor && cursorFollower) {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
                cursor.style.background = 'var(--primary-color)';
            }
        });
    });
});

// Enhanced form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Add submission animation
            const submitBtn = e.target.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.style.background = 'var(--gradient-secondary)';
            
            setTimeout(() => {
                submitBtn.textContent = 'Sent! ✓';
                submitBtn.style.background = 'var(--gradient-accent)';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = 'var(--gradient-primary)';
                    e.target.reset();
                }, 2000);
            }, 1500);
            
            // Show notification
            const notification = document.createElement('div');
            notification.innerHTML = 'Thank you! I\'ll get back to you soon.';
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--gradient-primary);
                color: white;
                padding: 1rem 2rem;
                border-radius: 50px;
                box-shadow: var(--glow);
                z-index: 10000;
                opacity: 0;
                transform: translateX(100px);
                transition: all 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100px)';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        });
    }
});

// Enhanced logo hover effect with glitch
document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            logo.style.animation = 'glitch 0.5s ease-in-out';
            setTimeout(() => {
                logo.style.animation = '';
            }, 500);
        });
    }
});

// Add form input focus effects
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('focus', (e) => {
            e.target.style.borderColor = 'var(--primary-color)';
            e.target.style.boxShadow = '0 0 0 3px rgba(0, 194, 155, 0.2)';
        });
        
        input.addEventListener('blur', (e) => {
            e.target.style.borderColor = 'var(--border-color)';
            e.target.style.boxShadow = 'none';
        });
    });
});

// Add intersection observer for project cards with stagger effect
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length > 0) {
        const projectObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 150);
                }
            });
        }, { threshold: 0.1 });

        projectCards.forEach(card => {
            projectObserver.observe(card);
        });
    }
});

// Chatbot Logic
let messageStep = 0;
let chatOpened = false;

document.addEventListener('DOMContentLoaded', () => {
    const floatingMessages = document.getElementById("floating-messages");
    const enhancedChatWindow = document.getElementById("enhanced-chat-window");
    const enhancedChatBody = document.getElementById("enhanced-chat-body");
    const enhancedUserInput = document.getElementById("enhanced-user-input");
    const enhancedSendBtn = document.getElementById("enhanced-send-btn");
    const closeChat = document.getElementById("close-chat");
    const chatWidgetIcon = document.getElementById("chat-widget-icon");
    const choiceBtns = document.querySelectorAll(".choice-btn-modern");

    // Fast message sequence - show first message immediately
    setTimeout(() => {
        showNextFloatingMessage();
    }, 1500);

    function showNextFloatingMessage() {
        if (messageStep === 0) {
            const msg1 = document.getElementById("msg-1");
            if (msg1) {
                msg1.style.display = "block";
                messageStep++;
                // Fast transition to second message
                setTimeout(() => showNextFloatingMessage(), 2000);
            }
        } else if (messageStep === 1) {
            const msg1 = document.getElementById("msg-1");
            const msg2 = document.getElementById("msg-2");
            if (msg1) msg1.style.display = "none";
            if (msg2) {
                msg2.style.display = "block";
                messageStep++;
            }
        }
    }

    // Handle choice buttons
    choiceBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const choice = e.target.getAttribute("data-choice");
            if (floatingMessages) floatingMessages.style.display = "none";
            if (enhancedChatWindow) {
                enhancedChatWindow.classList.remove("hidden");
                chatOpened = true;
            }
            
            // Fast responses
            if (choice === "yes") {
                setTimeout(() => {
                    addModernMessage("That's awesome! Let me tell you more about Sarthak. He's a talented full-stack developer with expertise in modern technologies.", "bot");
                    setTimeout(() => {
                        addModernMessage("Feel free to ask about his skills, projects, or how to get in touch!", "bot");
                    }, 600);
                }, 300);
            } else {
                setTimeout(() => {
                    addModernMessage("No worries! I'm still here if you want to learn more about Sarthak's amazing projects and skills.", "bot");
                    setTimeout(() => {
                        addModernMessage("Try the quick buttons above or ask me anything!", "bot");
                    }, 600);
                }, 300);
            }
        });
    });

    // Handle close button
    if (closeChat) {
        closeChat.addEventListener("click", () => {
            if (enhancedChatWindow) enhancedChatWindow.classList.add("hidden");
            if (chatWidgetIcon) chatWidgetIcon.style.display = "block";
            chatOpened = false;
        });
    }

    // Handle chat icon click
    if (chatWidgetIcon) {
        chatWidgetIcon.addEventListener("click", () => {
            chatWidgetIcon.style.display = "none";
            if (enhancedChatWindow) {
                enhancedChatWindow.classList.remove("hidden");
                chatOpened = true;
            }
        });
    }

    // Handle quick buttons
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("quick-btn-modern")) {
            const query = e.target.getAttribute("data-query");
            addModernMessage(getQueryText(query), "user");
            setTimeout(() => {
                addModernMessage(modernBotReply(query), "bot");
            }, 400);
        }
    });

    function getQueryText(query) {
        const texts = {
            skills: "Tell me about Sarthak's skills",
            projects: "What projects has Sarthak worked on?",
            contact: "How can I contact Sarthak?",
            experience: "Tell me about Sarthak's experience"
        };
        return texts[query] || query;
    }

    function addModernMessage(message, sender) {
        if (!enhancedChatBody) return;
        
        const msgElement = document.createElement("div");
        msgElement.classList.add(sender === "bot" ? "bot-msg-modern" : "user-msg-modern");
        
        if (sender === "bot") {
            msgElement.innerHTML = `
                <div class="message-content-modern">
                    <div class="bot-avatar-small"></div>
                    <div class="bubble-modern">
                        <p>${message}</p>
                    </div>
                </div>
            `;
        } else {
            msgElement.innerHTML = `
                <div class="message-content-modern">
                    <div class="bubble-modern">
                        <p>${message}</p>
                    </div>
                </div>
            `;
        }
        
        enhancedChatBody.appendChild(msgElement);
        enhancedChatBody.scrollTop = enhancedChatBody.scrollHeight;
    }

    function modernBotReply(input) {
        if (typeof input !== 'string') {
            input = input.toString();
        }
        input = input.toLowerCase();
        
        if (input.includes("hi") || input.includes("hello")) {
            return "Hey there! I'm SamBot, Sarthak's personal assistant. I'm here to help you learn about his amazing skills and projects!";
        } else if (input.includes("skills")) {
            return "<strong>Sarthak's Tech Stack:</strong><br><br><strong>Frontend:</strong> HTML, CSS, JavaScript, React.js, Tailwind CSS<br><strong>Backend:</strong> Node.js, Python, Java<br><strong>Database:</strong> MongoDB, SQL<br><strong>Tools:</strong> Git, VS Code<br><br>He's always exploring cutting-edge technologies!";
        } else if (input.includes("projects")) {
            return "<strong>Featured Projects:</strong><br><br><strong>1. SynQ - QR Ticketing System</strong><br>Comprehensive event management platform with real-time validation<br><br><strong>2. Parkinson's Disease Prediction</strong><br>ML model achieving 90% accuracy using advanced algorithms<br><br><strong>3. RuralConnect WorkKutumbh</strong><br>Full-stack platform connecting rural communities with opportunities";
        } else if (input.includes("contact")) {
            return "<strong>Get in Touch:</strong><br><br><strong>Email:</strong> sarthaksant2004@gmail.com<br><strong>Phone:</strong> +91 9822766484<br><strong>Location:</strong> Bhopal, India<br><br><strong>Social Links:</strong><br>• GitHub: github.com/SarthakSant<br>• LinkedIn: linkedin.com/in/sarthaksant";
        } else if (input.includes("experience")) {
            return "<strong>About Sarthak:</strong><br><br>• Computer Science Engineering student at VIT Bhopal<br>• Maintains impressive 8.25 CGPA<br>• Passionate about full-stack development<br>• Experience in modern web technologies<br>• Strong problem-solving skills<br>• Always eager to learn and innovate";
        } else if (input.includes("hire") || input.includes("job")) {
            return "<strong>Looking for opportunities in:</strong><br><br>• Full-Stack Development<br>• Frontend Development<br>• Software Engineering<br>• Tech Innovation roles<br><br>Sarthak is passionate, skilled, and ready to make an impact!";
        } else {
            return "I'd love to help you learn more about Sarthak! Try asking about:<br><br>• His <strong>skills</strong> and technologies<br>• His <strong>projects</strong> and work<br>• <strong>Contact</strong> information<br>• His <strong>experience</strong> and background";
        }
    }

    // Handle send button
    if (enhancedSendBtn && enhancedUserInput) {
        enhancedSendBtn.addEventListener("click", () => {
            const text = enhancedUserInput.value.trim();
            if (text) {
                addModernMessage(text, "user");
                setTimeout(() => {
                    addModernMessage(modernBotReply(text), "bot");
                }, 400);
                enhancedUserInput.value = "";
            }
        });

        // Handle enter key
        enhancedUserInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                enhancedSendBtn.click();
            }
        });
    }

    // Show chat widget icon after messages disappear
    setTimeout(() => {
        if (!chatOpened && floatingMessages && floatingMessages.style.display !== "none") {
            floatingMessages.style.animation = "fadeOut 0.6s ease-out forwards";
            setTimeout(() => {
                floatingMessages.style.display = "none";
                if (chatWidgetIcon) chatWidgetIcon.style.display = "block";
            }, 600);
        }
    }, 12000);

    // Start background animations
    startBackgroundAnimations();

    // Create initial background elements
    setTimeout(() => {
        createCodeWindow();
        createFloatingTech();
    }, 1000);
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    closeGame();
    stopBackgroundAnimations();
});