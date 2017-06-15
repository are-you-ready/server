const util = require('util');
const mongoose = require('mongoose');
const {AYRGroup} = require('./models');

mongoose.Promise = Promise;
mongoose.connect('localhost', 'are-you-ready');

// function assertExistence(msg) {
//   return function _assertExistence(value) {
//     return new Promise((resolve, reject) => {
//       value == null ? reject(new Error(msg)) : resolve(value);
//     });
//   };
// }

module.exports = {
  createGroup(name) {
    const group = new AYRGroup({name});
    return group.save();
  },

  readGroup(name) {
    return AYRGroup.findOne({name})
      .then()
  }
};

module.exports = {
  createGroup(name) {
    const group = new AYRGroup({name});
    return group.save();
  },

  getGroup(name) {
    return AYRGroup.findOne({name}).populate('users')
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

  getGroupsContainingUser(name) {
    return AYRUser.findOne({name})
      .then(assertExistence(`No AYRUser found with ${util.inspect({name})}`))
      .then(user => AYRGroup.find({users: user._id}).populate('users'));
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
  },

  getEventInGroup(groupName, eventName) {
    return AYREvent.findOne({name: eventName}).populate('attendees.user')
      .then(assertExistence(`No AYRGroup found with ${util.inspect({name: eventName})}`));
  },

  createEventInGroup(groupName, creator, name, desc, notificationTime, readyTime) {
    return AYRUser.findOne({name: creator})
      .then(assertExistence(`No AYRUser found with ${util.inspect({name: creator})}`))
      .then(user =>
        AYRGroup.findOne({name: groupName})
          .then(assertExistence(`No AYRGroup found with ${util.inspect({name: groupName})}`))
          .then(group => ({user, group}))
      )
      .then(({user, group}) => {
        const event = new AYREvent({
          name: name,
          description: desc,
          createdBy: user._id,
          createdAt: Date.now(),
          notificationTime: notificationTime,
          readyTime: readyTime,
          attendees: group.users.map(user => {
            return {
              user: user,
              status: 'pending'
            };
          })
        });
        return event.save();
      })
      .then(event => AYRGroup.findOneAndUpdate(
        {name: groupName},
        {$addToSet: {events: event._id}},
        {returnNewDocument: true}
      ))
      .then(assertExistence(`No AYRGroup found with ${util.inspect({name: groupName})}`));
  }
};

// convenience func for testing
// function asdf(p){p.then(d=>{console.log('SUCCESS:\n',d)}).catch(e=>{console.log(`ERROR: ${e}\n`,e)})}
