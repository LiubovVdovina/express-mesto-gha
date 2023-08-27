const User = require('../models/user');

function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.status(201).send({ user }))
    .catch((err) => {
      if(err.name === "ValidationError") {
        res.status(400).send({ message: err.message.split(": ")[2] })
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' })
      }
    });
}

function getUsers(req, res) {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch(err => res.status(500).send({ message: 'На сервере произошла ошибка' }))
}

function getUser(req, res) {
  User.findById(req.params.userId)
    .orFail(() => res.status(404).send({ message: 'Пользователь с переданным id не найден' }))
    .then(user => res.status(200).send({ user }))
    .catch((err) => {
      if(err.name === "CastError") {
        res.status(400).send({ message: 'Передан некорректный id пользователя' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка'})
      }
    })
}

function updateUser(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true  })
    .orFail(() => res.status(404).send({ message: 'Пользователь с переданным id не найден' }))
    .then(user => res.status(200).send({ user }))
    .catch((err) => {
      if(err.name === "ValidationError") {
        res.status(400).send({ message: err.message.split(": ")[2] })
      } else if (err.name === "CastError") {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка'})
      }
    })
}

function updateAvatar(req, res) {
  console.log(`Запущен контроллер обновления аватара пользователя ${req.user._id} на ссылку ${req.body.avatar}`);
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true, runValidators: true })
    .orFail(() => res.status(404).send({ message: 'Пользователь с переданным id не найден' }))
    .then(user => res.status(200).send({ user }))
    .catch((err) => {
      if(err.name === "ValidationError") {
        res.status(400).send({ message: err.message.split(": ")[2] })
      } else if (err.name === "CastError") {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка'})
      }
    })
}


module.exports = { createUser, getUsers, getUser, updateUser, updateAvatar}