const util = require('util');
const mongoose = require('mongoose');
const {AYRUser, AYREvent, AYRGroup} = require('./models');
const errors = require('./errors');
const {assert} = errors;

mongoose.Promise = Promise;
mongoose.connect('localhost', 'are-you-ready');

module.exports = {
  createUser(name) {
    const user = new AYRUser({name});
    return user.save()
      .catch(err => {
        switch (err.name) {
          case 'ValidationError':
            return Promise.reject(errors.INVALID_USER_TYPE);
          case 'MongoError': if (err.code === 11000) {
            return Promise.reject(errors.USER_ALREADY_EXISTS);
          }
        }

        return Promise.reject(errors.UNKNOWN_ERROR);
      });
  },

  getUser(name) {
    return AYRUser.findOne({name})
      .catch(assert(errors.UNKNOWN_ERROR))
      .then(assert(errors.USER_NOT_FOUND, user => user != null));
  },

  createGroup(name) {
    const group = new AYRGroup({name});
    return group.save()
      .catch(err => {
        switch (err.name) {
          case 'ValidationError':
            throw errors.INVALID_GROUP_TYPE;
          case 'MongoError':
            if (err.code === 11000) {
              throw errors.GROUP_ALREADY_EXISTS;
            }
        }

        throw errors.UNKNOWN_ERROR;
      });
  },

  getGroup(name) {
    return AYRGroup.findOne({name}).populate('users')
      .catch(assert(errors.UNKNOWN_ERROR))
      .then(assert(errors.GROUP_NOT_FOUND, user => user != null));
  },

  getGroupsContainingUser(name) {
    return AYRUser.findOne({name})
      .catch(assert(errors.UNKNOWN_ERROR))
      .then(assert(errors.USER_NOT_FOUND, user => user != null))

      .then(user =>
        AYRGroup.find({users: user._id}).populate('users')
          .catch(assert(errors.UNKNOWN_ERROR))
      );
  },

  addUserToGroup(groupName, userName) {
    return AYRUser.findOne({name: userName})
      .then(assertExistence(`No AYRUser found with ${util.inspect({name: userName})}`))
      .then(user => AYRGroup.findOneAndUpdate(
        {name: groupName},
        {$addToSet: {users: user._id}},
        {returnNewDocument: true}
      ))
      .then(assertExistence(`No AYRGroup found with ${util.inspect({name: groupName})}`));
  },

  removeUserFromGroup(groupName, userName) {
    return AYRUser.findOne({name: userName})
      .then(assertExistence(`No AYRUser found with ${util.inspect({name: userName})}`))
      .then(user => AYRGroup.findOneAndUpdate(
        {name: groupName},
        {$pullAll: {users: [user._id]}},
        {returnNewDocument: true}
      ))
      .then(assertExistence(`No AYRGroup found with ${util.inspect({name: groupName})}`));
  }
};

// convenience func for testing
// function asdf(p){p.then(d=>{console.log('SUCCESS:\n',d)}).catch(e=>{console.log(`ERROR: ${e}\n`,e)})}
