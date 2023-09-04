require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { DocumentNotFoundError } = require('mongoose').Error;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const process = require('process');
const helmet = require('helmet'); // библиотека для защиты от уязвимостей
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');

const {
  createUser, login,
} = require('./controllers/users');

const { signUpValidation } = require('./middlewares/validators/userValidator');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cookieParser()); // подключаем парсер кук как мидлвэр
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', { });

app.post('/signin', login);
app.post('/signup', signUpValidation, createUser);

// Все роуты ниже защищены авторизацией
app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new DocumentNotFoundError());
});

app.use(errors());
app.use(require('./middlewares/errorHandler'));

app.listen(PORT, () => {
  console.log('Сервер запущен');
});

process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
});
