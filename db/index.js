const util = require('util');
const mongoose = require('mongoose');
const {AYRUser, AYREvent, AYRGroup} = require('./models');

mongoose.Promise = Promise;
mongoose.connect('localhost', 'are-you-ready');

function assertExistence(msg) {
  return function _assertExistence(value) {
    return new Promise((resolve, reject) => {
      value == null ? reject(new Error(msg)) : resolve(value);
    });
  };
}

module.exports = {
  createGroup(name) {
    const group = new AYRGroup({name});
    return group.save();
  },

  getGroup(name) {
    return AYRGroup.findOne({name})
      .then(assertExistence(`No AYRGroup found with ${util.inspect({name})}`));
  },

  createUser(name) {
    const user = new AYRUser({name});
    return user.save();
  },

  getUser(name) {
    return AYRUser.findOne({name})
      .then(assertExistence(`No AYRUser found with ${util.inspect({name})}`));
  },

  addUserToGroup(groupName, userName) {
    return AYRUser.findOne({name: userName})
      .then(assertExistence(`No AYRUser found with ${util.inspect({name: userName})}`))
      .then(user => AYRGroup.findOneAndUpdate(
        {name: groupName},
        {$addToSet: {users: [user._id]}},
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
