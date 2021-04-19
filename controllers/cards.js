const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({}, { __v: 0 })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err) {
        res.status(500).send({ message: "Ошибка по умолчанию" });
      }
    });
};

module.exports.createCard = (req, res) => {
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
        res
          .status(400)
          .send({
            message: "Переданы некорректные данные при создании карточки",
          });
      } else {
        res.status(500).send({ message: "Ошибка по умолчанию" });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).then((item) => {
    if (item) {
      res.send("Карточка удалена");
    } else {
      res.status(404).send({ message: "Карточка с указанным _id не найдена" });
    }
  });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "TypeError") {
        res
          .status(400)
          .send({
            message: "Переданы некорректные данные для постановки лайка",
          });
      } else {
        res.status(500).send({ message: "Ошибка по умолчанию" });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "TypeError") {
        res
          .status(400)
          .send({ message: "Переданы некорректные данные для снятия лайка" });
      } else {
        res.status(500).send({ message: "Ошибка по умолчанию" });
      }
    });
};
