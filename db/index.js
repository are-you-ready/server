const util = require('util');
const winston = require('winston');
const mongoose = require('mongoose');
const errors = require('./errors');
const {AYRGroup} = require('./models');

mongoose.Promise = Promise;
mongoose.connect('localhost', 'are-you-ready');

function reject(rawError, errorType) {
  rawError && winston.error('DB ERROR:', rawError);
  winston.error(`${errorType.code}: ${errorType.description}`);

  let error = new Error(errorType.description);
  error.code = errorType.code;
  return Promise.reject(error);
}

module.exports = {
  createGroup(groupName) {
    winston.info(`DB#createGroup groupName=${groupName}`);

    return AYRGroup.create({ name: groupName })
      .catch(err => {
        switch (err.name) {
          case 'ValidationError':
            return reject(err, errors.GROUP_INVALID_TYPE);
          case 'MongoError': if (err.code === 11000) {
            return reject(err, errors.GROUP_ALREADY_EXISTS); }
          default: // eslint-disable-line no-fallthrough
            return reject(err, errors.UNKNOWN_ERROR);
        }
      });
  },

  readGroup(groupName) {
    winston.info(`DB#readGroup groupName=${groupName}`);

    return AYRGroup.findOne({ name: groupName })
      .catch(err => reject(err, errors.UNKNOWN_ERROR))
      .then(group => {
        if (!group)
          return reject(null, errors.GROUP_NOT_FOUND);
        else
          return group;
      });
  },

  updateGroup(groupName, update) {
    winston.info(`DB#updateGroup groupName=${groupName} update=${util.inspect(update)}`);

    return AYRGroup.findOneAndUpdate({ name: groupName }, update, { returnNewDocument: true })
      .catch(err => reject(err, errors.UNKNOWN_ERROR))
      .then(group => {
        if (!group)
          return reject(null, errors.GROUP_NOT_FOUND);
        else
          return group;
      });
  }

  // deleteGroup(name) {
  //   winston.info(`DB#deleteGroup name=${name}`);
  //
  //   return AYRGroup.deleteOne({ name })
  //     .catch(err => reject(err, errors.UNKNOWN_ERROR))
  //     .then(group => {
  //       // if (!group)
  //       //   return reject(null, errors.GROUP_NOT_FOUND);
  //       // else
  //         return group;
  //     });
  // }
};

module.exports.asdf=p=>p.then(d=>console.log('SUCCESS:\n',d)).catch(e=>console.log(`ERROR: ${e}\n`,e))//eslint-disable-line
