require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const process = require('process');
const helmet = require('helmet'); // библиотека для защиты от уязвимостей
const { errors } = require('celebrate');
const NotFoundError = require('./errors/not-found-err');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const {
  createUser, login, logout,
} = require('./controllers/users');

const { signUpValidation, signInValidation } = require('./middlewares/validators/userValidator');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cookieParser()); // подключаем парсер кук как мидлвэр
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { });

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', signInValidation, login);
app.post('/signup', signUpValidation, createUser);

// Все роуты ниже защищены авторизацией
app.use(auth);

app.post('/signout', logout);
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница с таким адресом не найдена'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());
app.use(require('./middlewares/errorHandler'));

app.listen(PORT, () => {
  console.log('Сервер запущен');
});

process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
});
