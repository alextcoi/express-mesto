const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({}, { __v: 0 })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err) {
        res.status(500).send({ message: "Ошибка по умолчанию" });
      }
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId, { __v: 0 })
    .orFail(new Error("NotFound"))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.message === "NotFound") {
        res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден" });
      } else if (err.name === "CastError") {
        res.status(400).send({
          message: "Переданы некорректные данные при поиске пользователя",
        });
      } else {
        res.status(500).send({ message: "Ошибка по умолчанию" });
      }
    });
};

module.exports.createUser = (req, res) => {
  User({
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  })
    .save()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "TypeError") {
        res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      } else {
        res.status(500).send({ message: "Ошибка по умолчанию" });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    { new: true, runValidators: true }
  )
    .orFail(new Error("NotFound"))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.message === "NotFound") {
        res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден" });
      } else if (err.name === "TypeError" || err.name === "CastError") {
        res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля",
        });
      } else {
        res.status(500).send({ message: "Ошибка по умолчанию" });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    { new: true, runValidators: true }
  )
    .orFail(new Error("NotFound"))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.message === "NotFound") {
        res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден" });
      } else if (err.name === "TypeError" || err.name === "CastError") {
        res.status(400).send({
          message: "Переданы некорректные данные при обновлении аватара",
        });
      } else {
        res.status(500).send({ message: "Ошибка по умолчанию" });
      }
    });
};
