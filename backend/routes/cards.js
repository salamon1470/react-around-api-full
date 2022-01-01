const cardsRouter = require('express').Router();
const {
  getCards,
  createCard,
  delCard,
  likeCard,
  dislikeCard,
  getCard,
} = require('../controllers/cards');
const { celebrate, Joi } = require('celebrate');
const { validateURL } = require('../middlewares/urlValidator');

cardsRouter.get('/cards', getCards);
cardsRouter.get('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex()
  }),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateURL)
  })
 }), getCard);
cardsRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateURL)
  })
 }), createCard);
cardsRouter.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex()
  })
 }), delCard);
cardsRouter.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex()
  })
 }), likeCard);
cardsRouter.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex()
  })
 }), dislikeCard);

module.exports = {
  cardsRouter,
};
