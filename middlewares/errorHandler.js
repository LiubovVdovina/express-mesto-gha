const {
  ValidationError,
  DocumentNotFoundError,
  CastError,
} = require('mongoose').Error;

const ForbiddenError = require('../errors/forbidden-err');
const AuthorizationError = require('../errors/authorization-err');

module.exports = (err, req, res, next) => {
  if (err instanceof ForbiddenError) {
    return res.status(err.statusCode).send({
      message: err.message,
    });
  }
  if (err instanceof DocumentNotFoundError) {
    return res.status(404).send({
      message: 'Запрашиваемый документ не найден',
    });
  }
  if (err instanceof ValidationError) {
    const errorMessage = Object.values(err.errors).map((error) => error.message).join('. ');
    return res.status(400).send({ message: `Ошибка валидации данных. ${errorMessage}` });
  }
  if (err instanceof CastError) {
    return res.status(400).send({
      message: 'Переданы некорректные данные',
    });
  }
  if (err instanceof AuthorizationError) {
    return res.status(err.statusCode).send({
      message: 'Неправильные почта или пароль',
    });
  }
  if (err.code === 11000) {
    return res.status(409).send({
      message: 'Пользователь с указанным email уже существует',
    });
  }
  res.status(500).send({
    message: 'На сервере произошла ошибка',
  });
  return next();
};
