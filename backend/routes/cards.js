const cardsRouter = require('express').Router();
const {
  getCards,
  createCard,
  delCard,
  likeCard,
  dislikeCard,
  getCard,
} = require('../controllers/cards');

cardsRouter.get('/cards', getCards);
cardsRouter.get('/cards/:cardId', getCard);
cardsRouter.post('/cards', createCard);
cardsRouter.delete('/cards/:cardId', delCard);
cardsRouter.put('/cards/:cardId/likes', likeCard);
cardsRouter.delete('/cards/:cardId/likes', dislikeCard);

module.exports = {
  cardsRouter,
};
