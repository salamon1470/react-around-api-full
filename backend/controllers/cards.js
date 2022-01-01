const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const NotValidError = require('../errors/not-valid-err');
const NotAuthenticatedError = require ('../errors/not-authenticated-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .orFail()
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Cards not found');
      }
    })
    .catch(next);
};

module.exports.getCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotValidError('Invalid card data');
      }
      if (err.name === 'ValidationError') {
        throw new NotValidError('Invalid card data');
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Card not found');
      }
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const {
    name, link, owner = req.user._id, likes,
  } = req.body;
  Card.create({
    name, link, owner, likes,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotValidError('Invalid card data');
      }
      if (err.name === 'ValidationError') {
        throw new NotValidError('Invalid card data');
      }
    })
    .catch(next);
};

module.exports.delCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
         if( req.user._id === req.data.owner._id.toString()) {
         res.send({ data: card })
         }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotValidError('Invalid card data');
      }
      if (err.name === 'ValidationError') {
        throw new NotValidError('Invalid card data');
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Card not found');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotValidError('Invalid card data');
      }
      if (err.name === 'ValidationError') {
        throw new NotValidError('Invalid card data');
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Card not found');
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotValidError('Invalid card data');
      }
      if (err.name === 'ValidationError') {
        throw new NotValidError('Invalid card data');
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Card not found');
      }
    })
    .catch(next);
};
