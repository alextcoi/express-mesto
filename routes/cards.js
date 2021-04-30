const cardsRouter = require("express").Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

cardsRouter.get("/", getCards);

cardsRouter.post("/", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(/http(s)?:\/\/(www\.)?[a-zA-Z0-9-._~:\/?#[\]@!$&'()*\+,;=]{2,256}\.[a-z]{2,6}([a-zA-Z0-9-._~:\/?#[\]@!$&'()*\+,;=]{1,})?/),
  })
}), createCard);

cardsRouter.delete("/:cardId", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string()
  })
}), deleteCard);

cardsRouter.put("/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string()
  })
}), likeCard);

cardsRouter.delete("/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string()
  })
}), dislikeCard);

module.exports = cardsRouter;
