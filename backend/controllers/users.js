const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { NODE_ENV, JWT_SECRET } = process.env;
const NotFoundError = require('../errors/not-found-err');
const NotValidError = require('../errors/not-valid-err');
const NotAuthenticatedError = require ('../errors/not-authenticated-err');
const ConflictError = require('../errors/conflict-err');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail()
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Users not found');
      }
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotValidError('Invalid user data');
      }
      if (err.name === 'ValidationError') {
        throw new NotValidError('Invalid user data');
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('User not found');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((res) => User.create({ name, about, avatar, email })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotValidError(err.message);
      }
      if (err.name === 'MongoError' ||  err.code === 11000 ) {
        throw new ConflictError('User already exists');
      }
    })
    .catch(next)
    )
};

module.exports.updtProf = (req, res, next) => {
  const { name, about } = req.body;
  console.log(req.user._id);
  User.findByIdAndUpdate(
    '61af547a15d69971d21d5e8c',
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotValidError('Invalid user data');
      }
      if (err.name === 'ValidationError') {
        throw new NotValidError('Invalid user data');
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('User not found');
      }
    })
    .catch(next)
};

module.exports.updtAvat = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    '61af547a15d69971d21d5e8c',
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotValidError('Invalid user data');
      }
      if (err.name === 'ValidationError') {
        throw new NotValidError('Invalid user data');
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('User not found');
      }
    })
    .catch(next)
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
    res.send({
      token: jwt.sign({ _id: user._id },  NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {expiresIn: '7d'})
      })
    })
    .catch((err) => {
      throw new NotAuthenticatedError(err.message);
    })
};