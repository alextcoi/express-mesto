const jwt = require('jsonwebtoken');
const AuthLoginError = require('../errors/auth-login-error');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const authorization = req.headers.cookie;
  if (!authorization) {
    return new AuthLoginError('Необходима авторизация');
  }

  const token = authorization.replace('jwt=', '');
  let payload;

  try {
    payload = jwt.verify(token, 'asdfasdf');
  } catch (err) {
    return new AuthLoginError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
