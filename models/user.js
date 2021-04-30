const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const isEmail = require("validator/lib/isEmail");
const WrongDataError = require('../errors/wrong-request-data');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => {
        const urlRegex = /http(s)?:\/\/(www\.)?[a-zA-Z0-9-._~:\/?#[\]@!$&'()*\+,;=]{2,256}\.[a-z]{2,6}([a-zA-Z0-9-._~:\/?#[\]@!$&'()*\+,;=]{1,})?/;
        return urlRegex.test(v);
      },
      message: 'Некорректно указана ссылка на картинку',
    }
  },
  email: {
    type: String,
    required: [true, "Обязательно укажите почту"],
    validate: {
      validator: (v) => isEmail(v),
      message: "Неправильный формат почты",
    },
    unique: true
  },
  password: {
    type: String,
    required: [true, "Обязательно установите пароль"],
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new WrongDataError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new WrongDataError('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model("user", userSchema);
