const Card = require('../models/card');

const ForbiddenError = require('../errors/forbidden-err');

function getCards(req, res, next) {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ card }))
    .catch(next);
}

function deleteCard(req, res, next) {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        throw new ForbiddenError('Вы не можете удалять чужие карточки');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((removeCard) => res.status(200).send({ removeCard }))
        .catch(next);
    })
    .catch(next);
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.status(200).send({ card }))
    .catch(next);
}

function dislikeCard(req, res, next) {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch(next);
}

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
