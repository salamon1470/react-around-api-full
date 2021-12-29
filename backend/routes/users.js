const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validateURL } = require('../middlewares/urlValidator');
const {
  getUsers,
  getUser,
  updtProf,
  updtAvat,
} = require('../controllers/users');


usersRouter.get('/users',celebrate({
  avatar: Joi.string().required().custom(validateURL)
}), getUsers);
usersRouter.get('/users/:id',celebrate({
  avatar: Joi.string().required().custom(validateURL)
}), getUser);
usersRouter.patch('/users/me', updtProf);
usersRouter.patch('/users/me/avatar', celebrate({
  avatar: Joi.string().required().custom(validateURL)
}), updtAvat);
usersRouter.get('/users/me');

module.exports = {
  usersRouter,
};
