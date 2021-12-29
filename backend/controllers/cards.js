const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .orFail()
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Cards not found' });
      } else {
        res.status(500).send({ message: 'An error has occurred on the server' });
      }
    });
};

module.exports.getCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid card data' });
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Invalid card data' });
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Card not found' });
      } else {
        res.status(500).send({ message: 'An error has occurred on the server' });
      }
    });
};

module.exports.createCard = (req, res) => {
  const {
    name, link, owner = req.user._id, likes,
  } = req.body;
  Card.create({
    name, link, owner, likes,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid card data' });
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ err, message: 'Invalid card data' });
      } else {
        res.status(500).send({ message: 'An error has occurred on the server' });
      }
    });
};

module.exports.delCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid card data' });
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Invalid card data' });
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Card not found' });
      } else {
        res.status(500).send({ message: 'An error has occurred on the server' });
      }
    });
};

module.exports.likeCard = (req, res) => {
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
        res.status(400).send({ message: 'Invalid card data' });
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Invalid card data' });
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Card not found' });
      } else {
        res.status(500).send({ message: 'An error has occurred on the server' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
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
        res.status(400).send({ message: 'Invalid card data' });
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Invalid card data' });
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Card not found' });
      } else {
        res.status(500).send({ message: 'An error has occurred on the server' });
      }
    });
};
