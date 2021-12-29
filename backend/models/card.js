const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'This field is required'],
    minlength: 2,
    maxlength: 30,
    validate: {
      validator(v) {
        return /[a-z]+\s[a-z]+/i.test(v);
      },
      message: (props) => `${props.value} is not a valid name!`,
    },
  },
  link: {
    type: String,
    required: [true, 'This field is required'],
    validate: {
      validator: (v) => /^((ftp|http|https):\/\/)?(www\.)?([a-z\-0-9\._~:\/?%#\[\]@!$&'()*\+,;=]+)\.([A-z]{2,})([\/a-z]+)?(#)?/gi.test(  // eslint-disable-line
        v,
      ),
      message: 'invalid url',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  },
  createdAt: {
    createdAt: true,
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
