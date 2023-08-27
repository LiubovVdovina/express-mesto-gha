const Card = require('../models/card');

function getCards(req, res) {
  Card.find({})
    .orFail(() => res.status(500).send({message: 'Нет карточек'}))
    .then(cards => res.status(200).send({ cards }))
    .catch(err => res.status(500).send({ message: 'На сервере произошла ошибка' }))
}

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then(card => res.status(201).send({ card }))
    .catch((err) => {
      if(err.name === "ValidationError") {
        res.status(400).send({ message: err.message.split(": ")[2] })
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' })
      }
    });
}

function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId, { new: true })
    .orFail(() => res.status(404).send({ message: 'Карточка с переданным id не найдена' }))
    .then(card => res.status(200).send({ card }))
    .catch((err) => {
      if(err.name === "CastError") {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка'})
      }
    });
}

function likeCard(req, res) {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => res.status(404).send({ message: 'Карточка с переданным id не найдена' }))
    .then(card => res.status(200).send({ card }))
    .catch((err) => {
      if(err.name === "CastError") {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка'})
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка'})
      }
    });
}

function dislikeCard(req, res) {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => res.status(404).send({ message: 'Карточка с переданным id не найдена' }))
    .then(card => res.send({data: card}))
    .catch((err) => {
      if(err.name === "CastError") {
        res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка'})
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка'})
      }
    });
}

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard }