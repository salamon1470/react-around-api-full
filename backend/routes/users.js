const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validateURL } = require('../middlewares/urlValidator');
const {
  getUsers,
  getUser,
  updtProf,
  updtAvat,
} = require('../controllers/users');


usersRouter.get('/users', getUsers);
usersRouter.get('/users/:id', getUser);
usersRouter.patch('/users/me', updtProf);
usersRouter.patch('/users/me/avatar', updtAvat);
usersRouter.get('/users/me');

module.exports = {
  usersRouter,
};
