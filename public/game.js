const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const authMessage = document.getElementById('auth-message');
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');

const api = async (endpoint, data) => {
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return res.json();
};

registerBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const response = await api('/register', { username, password });

    authMessage.textContent = response.message;

    if (response.message === 'Регистрацията е успешна!') {
        authMessage.className = 'green-message';
        canvas.style.display = 'block';
        startGame();
    } else {
        authMessage.className = 'red-message';
    }
});

loginBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const response = await api('/login', { username, password });

    if (response.message === 'Успешен вход!') {
        authMessage.className = 'green-message';
        canvas.style.display = 'block';
        startGame();
    } else {
        authMessage.className = 'red-message';
    }

    authMessage.textContent = response.message;
});

const shapes = [
    { x: 50, y: 50, size: 50, color: 'red', type: 'square' },
    { x: 150, y: 100, size: 50, color: 'blue', type: 'circle' },
    { x: 250, y: 150, size: 50, color: 'green', type: 'rhombus' },
    { x: 350, y: 200, size: 50, color: 'yellow', type: 'triangle' },
    { x: 450, y: 250, size: 50, width: 70, height: 40, color: 'purple', type: 'rectangle' },
    { x: 550, y: 300, size: 50, color: 'orange', type: 'hexagon' },
];

function drawShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => {
        if (shape.type === 'square') {
            drawSquare(ctx, shape.x, shape.y, shape.size, shape.color);
        } else if (shape.type === 'circle') {
            drawCircle(ctx, shape.x, shape.y, shape.size, shape.color);
        } else if (shape.type === 'rhombus') {
            drawRhombus(ctx, shape.x, shape.y, shape.size, shape.color);
        } else if (shape.type === 'triangle') {
            drawTriangle(ctx, shape.x, shape.y, shape.size, shape.color);
        } else if (shape.type === 'rectangle') {
            drawRectangle(ctx, shape.x, shape.y, shape.width, shape.height, shape.color);
        } else if (shape.type === 'trapezoid') {
            drawTrapezoid(ctx, shape.x, shape.y, shape.size * 1.5, shape.size, shape.size, shape.color);
        } else if (shape.type === 'hexagon') {
            drawHexagon(ctx, shape.x, shape.y, shape.size, shape.color);
        }
    });
};

function drawSquare(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
};

function drawCircle(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
};

function drawRhombus(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - size / 2);
    ctx.lineTo(x + size / 2, y);
    ctx.lineTo(x, y + size / 2);
    ctx.lineTo(x - size / 2, y);
    ctx.closePath();
    ctx.fill();
};

function drawTriangle(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - size / 2); 
    ctx.lineTo(x + size / 2, y + size / 2); 
    ctx.lineTo(x - size / 2, y + size / 2); 
    ctx.closePath();
    ctx.fill();
};

function drawRectangle(ctx, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x - width / 2, y - height / 2, width, height);
};

function drawTrapezoid(ctx, x, y, width, height, topWidth, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x - topWidth / 2, y - height / 2);
    ctx.lineTo(x + topWidth / 2, y - height / 2);
    ctx.lineTo(x + width / 2, y + height / 2);
    ctx.lineTo(x - width / 2, y + height / 2);
    ctx.closePath();
    ctx.fill();
};

function drawHexagon(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = Math.PI / 3 * i;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);
        ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
};

function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    shapes.forEach(shape => {
        if (
            mouseX >= shape.x &&
            mouseX <= shape.x + shape.size &&
            mouseY >= shape.y &&
            mouseY <= shape.y + shape.size
        ) {
            shape.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            shape.x = Math.random() * (canvas.width - shape.size);
            shape.y = Math.random() * (canvas.height - shape.size);
        }
    });

    drawShapes();
};

function startGame() {
    drawShapes();
    canvas.addEventListener('click', handleClick);
};