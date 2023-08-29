const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const helmet = require('helmet'); // библиотека для защиты от уязвимостей

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: '64e99face78a4415a3cd29e6', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', { });

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(404).send({
    message: 'Запрашиваемый адрес не найден.',
  });
});

app.listen(PORT, () => {
  console.log('Сервер запущен');
});

process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
});
