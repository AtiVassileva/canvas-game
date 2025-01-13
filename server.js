const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const PORT = 3000;

let users = [
  { username: 'pesho', password: 'pesho1234' },
  { username: 'gosho', password: 'gosho1234' },
  { username: 'stamat', password: 'stamat1234' },
];

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// HTTP - Регистрация
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: 'Потребителското име вече съществува!' });
  }
  users.push({ username, password });
  res.status(200).json({ message: 'Регистрацията е успешна!' });
});

// HTTP - Вход
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Грешно потребителско име или парола!' });
  }
  res.status(200).json({ message: 'Успешен вход!' });
});

// Създаване на WebSocket сървър
const wss = new WebSocket.Server({ noServer: true });

// Слушане на WebSocket връзки
wss.on('connection', (ws) => {
  console.log('Нова WebSocket връзка!');

  // Изпращане на съобщение към клиента
  ws.send('Здравейте! Вие сте свързани с WebSocket сървъра.');

  // Обработка на съобщения от клиента
  ws.on('message', (message) => {
    console.log('Получено съобщение от клиента: ', message);
    ws.send(`Получих съобщение: ${message}`);
  });

  // При затваряне на връзката
  ws.on('close', () => {
    console.log('WebSocket връзката е затворена');
  });
});

// Пренасочване на WebSocket връзките през HTTP сървъра
app.server = app.listen(PORT, () => {
  console.log(`Сървърът е стартиран на http://localhost:${PORT}`);
});

app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});