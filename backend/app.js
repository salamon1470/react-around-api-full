const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const allowedCors = [
  'localhost:3000',
  'http://api.aroundussg.students.nomoreparties.sbs'
];

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // in 15 minutes
  max: 100 // you can make a maximum of 100 requests from one IP
});

const {
  createUser,
  login
} = require('./controllers/users');

const { usersRouter } = require('./routes/users');

const { cardsRouter } = require('./routes/cards');
const auth = require('./middleware/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
app.use(helmet());
app.use(limiter);
app.use(requestLogger);
app.use(cors());
app.options('*', cors());
app.use(function(req, res, next) {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
}
next()
})

mongoose.connect('mongodb://localhost:27017/aroundb');
app.use(express.json());
app.post('/signin', login);
app.post('/signup', createUser);

app.use(errorLogger);

app.use('/',(req, res, next) => {
  if(!auth) {
    res.status(403).send('User is unauthorized')
  }
  auth
  next();
}, usersRouter);

app.use('/',(req, res, next) => {
  if(!auth) {
    res.status(403).send('User is unauthorized')
  }
  auth
  next();
}, cardsRouter);

app.use((req, res) => {
  // Invalid request
  res.status(404).json({
    message: 'Requested resource not found',
  });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message
    });
    next()
});

const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
