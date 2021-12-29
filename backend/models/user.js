const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Jacques Cousteau',
    minlength: 2,
    maxlength: 30,
    validate: {
      validator(v) {
        return /[a-z]+\s?[a-z]+/i.test(v);
      },
      message: (props) => `${props.value} is not a valid name!`,

    },
  },
  about: {
    type: String,
    default: 'Explorer',
    minlength: 2,
    maxlength: 30,
    validate: {
      validator(v) {
        return /[a-z]+\s?[a-z]+/i.test(v);
      },
      message: (props) => `${props.value} is not valid!`,
    },
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
    validate: {
      validator: (v) => /^((ftp|http|https):\/\/)?(www\.)?([a-z\-0-9\._~:\/?%#\[\]@!$&'()*\+,;=]+)\.([A-z]{2,})([\/a-z]+)?(#)?/gi.test(  // eslint-disable-line
        v,
      ),
      message: 'invalid url',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Wrong email format',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  }
});

userSchema.statics.findUserByCredentials = function findUserByCredentials (email, password) {

  return this.findOne({ email }).select('+password')
    .then((user) => {

      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }


      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Incorrect email or password'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
