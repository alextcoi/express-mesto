const Card = require("../models/card");
const NotFoundError = require('../errors/not-found-error');
const WrongDataError = require('../errors/wrong-request-data');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getCards = (req, res, next) => {
  Card.find({}, { __v: 0 })
    .then((item) => res.send(item))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  Card({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  })
    .save()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "TypeError") {
        throw new WrongDataError("Переданы некорректные данные при создании карточки");
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById({ _id: req.params.cardId })
    .then((item) => {
      if (!item) {
        throw new NotFoundError('Карточка по указанному id не найдена');
      }
      if (!item.owner.equals(req.user._id)) {
        throw new ForbiddenError('Можно удалять только свои карточки');
      }
      return item;
    })
    .then((item) => {
      Card.findByIdAndDelete({ _id: item._id })
        .then((card) => res.send(card))
        .catch(next);
    })
    .catch((err) => {
      if (err.statusCode === 404 || err.statusCode === 403) { next(err); }
      if (err.name === "CastError" || err.name === "TypeError") {
        throw new WrongDataError("Переданы некорректные данные при удалении карточки");
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) { throw new NotFoundError('Карточка по указанному id не найдена'); }
      res.send(item);
    })
    .catch((err) => {
      if (err.statusCode === 404) { next(err); }
      if (err.name === "CastError" || err.name === "TypeError") {
        throw new WrongDataError("Переданы некорректные данные при удалении карточки");
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) { throw new NotFoundError('Карточка по указанному id не найдена'); }
      res.send(item);
    })
    .catch((err) => {
      if (err.statusCode === 404) { next(err); }
      if (err.name === "CastError" || err.name === "TypeError") {
        throw new WrongDataError("Переданы некорректные данные при удалении карточки");
      }
    })
    .catch(next);
};
