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
usersRouter.get('/users/:id',celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum()
  }),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().custom(validateURL)
  })
 }), getUser);
usersRouter.patch('/users/me',celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30)
  })
 }), updtProf);
usersRouter.patch('/users/me/avatar',celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL)
  })
 }), updtAvat);
usersRouter.get('/users/me');

module.exports = {
  usersRouter,
};
