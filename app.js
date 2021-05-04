const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const { errors, celebrate, Joi } = require('celebrate');
const cardsRouter = require("./routes/cards");
const usersRouter = require("./routes/users");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const NotFoundError = require("./errors/not-found-error");

const {
  PORT = 3000,
  MONGO_URL = "mongodb://localhost:27017/mestodb",
} = process.env;
const app = express();

app.use(express.json());
app.use(helmet());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  })
}), login);// логинимся на сервисе

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/http(s)?:\/\/(www\.)?[a-zA-Z0-9-._~:\/?#[\]@!$&'()*\+,;=]{2,256}\.[a-z]{2,6}([a-zA-Z0-9-._~:\/?#[\]@!$&'()*\+,;=]{1,})?/),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  })
}), createUser);// регистрация нового пользователя

app.use("/:wrongRoute", (req, res, next) => {
  const err = new NotFoundError('Указан неправильный путь или метод');
  next(err);
});// проверка корректности роута

app.use(auth);// вход по токену

app.use("/users", usersRouter);// методы для пользователей
app.use("/cards", cardsRouter);// методы для карточек

app.use(errors());// проверка данных для сервера

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
});// централизованная обработка ошибок

async function launch() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await app.listen(PORT);
}

launch();// слушаем сервер

// https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg
