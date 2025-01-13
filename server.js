const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

let users = [
  { username: 'pesho', password: 'pesho1234' },
  { username: 'gosho', password: 'gosho1234' },
  { username: 'stamat', password: 'stamat1234' },
];

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: 'Потребителското име вече съществува' });
  }
  users.push({ username, password });
  res.status(200).json({ message: 'Регистрацията е успешна!' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Грешно потребителско име или парола' });
  }
  res.status(200).json({ message: 'Успешен вход!' });
});

app.listen(PORT, () => {
  console.log(`Сървърът е стартиран на http://localhost:${PORT}`);
});