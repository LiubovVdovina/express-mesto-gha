const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

function createUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch(next);
}

function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch(next);
}

function getUser(req, res, next) {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(200).send({ user }))
    .catch(next);
}

function updateUser(req, res, next) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(200).send({ user }))
    .catch(next);
}

function updateAvatar(req, res, next) {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(200).send({ user }))
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      // отправим токен, браузер сохранит его в куках
      res
        .cookie('jwt', token, {
        // token - наш JWT токен, который мы отправляем
          maxAge: '604800',
          httpOnly: true,
        })
        .status(200)
        .send({ message: 'Авторизация прошла успешно' });
    })
    .catch(next);
}

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .then((user) => res.send({ user }))
    .catch(next);
}

module.exports = {
  createUser, getUsers, getUser, updateUser, updateAvatar, login, getCurrentUser,
};
