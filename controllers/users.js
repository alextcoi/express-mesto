const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const NotFoundError = require('../errors/not-found-error');
const WrongDataError = require('../errors/wrong-request-data');
const DatabaseError = require('../errors/db-error');

const SALT = 10;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'asdfasdf', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true
      }).end();
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({}, { __v: 0 })
    .then((item) => res.send(item))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId, { __v: 0 })
    .then((item) => {
      if (!item) { throw new NotFoundError('Пользователь по указанному _id не найден'); }
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new WrongDataError("Переданы некорректные данные при поиске пользователя");
      }
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id, { __v: 0 })
    .then((item) => res.send(item))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, SALT)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "TypeError") {
        throw new WrongDataError("Переданы некорректные данные при поиске пользователя");
      }
      if (err.name === "MongoError" && err.code === 11000) {
        throw new DatabaseError("Пользователь с указанным email уже существует");
      }
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    { new: true, runValidators: true }
  )
    .then((item) => {
      if (!item) { throw new NotFoundError('Пользователь по указанному _id не найден'); }
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError" || err.name === "TypeError") {
        throw new WrongDataError("Переданы некорректные данные при поиске пользователя");
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    { new: true, runValidators: true }
  )
    .then((item) => {
      if (!item) { throw new NotFoundError('Пользователь по указанному _id не найден'); }
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError" || err.name === "TypeError") {
        throw new WrongDataError("Переданы некорректные данные при поиске пользователя");
      }
    })
    .catch(next);
};
