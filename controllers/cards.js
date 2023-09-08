const Card = require('../models/card');

const ForbiddenError = require('../errors/forbidden-err');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errorMessage = Object.values(err.errors).map((error) => error.message).join('. ');
        next(new BadRequestError(`Переданы некорректные данные при создании карточки. ${errorMessage}`));
      } else {
        next(err);
      }
    });
}

function deleteCard(req, res, next) {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с переданным ID не найдена');
    })
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        throw new ForbiddenError('Вы не можете удалять чужие карточки');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((removeCard) => res.status(200).send({ removeCard }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный ID карточки'));
      } else {
        next(err);
      }
    });
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Карточка с переданным ID не найдена');
    })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный ID карточки'));
      } else {
        next(err);
      }
    });
}

function dislikeCard(req, res, next) {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Карточка с переданным ID не найдена');
    })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный ID карточки'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
