const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Users not found' });
      } else {
        res.status(500).send({ message: 'An error has occurred on the server' });
      }
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid user data' });
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Invalid user data' });
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(500).send({ message: 'An error has occurred on the server' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({ name, about, avatar,  email, password: hash })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(err);
      }
      res.status(500).send({ message: 'An error has occurred on the server' });
    }) )


};

module.exports.updtProf = (req, res) => {
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
        res.status(400).send({ message: 'Invalid user data' });
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Invalid user data' });
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(500).send({ message: 'An error has occurred on the server' });
      }
    });
};

module.exports.updtAvat = (req, res) => {
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
        res.status(400).send({ message: 'Invalid user data' });
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Invalid user data' });
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(500).send({ message: 'An error has occurred on the server' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
    res.send({
      token: jwt.sign({ _id: user._id }, 'D25B2064FD8BC5F48643994194AF6C764029047CE8311C596F4520F8BCEBDAE5', {expiresIn: '7d'})
      })
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};