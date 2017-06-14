/* eslint-disable no-console */
const mongoose = require('mongoose');
const db = require('../db');

const INIT_STRUCTURE = {
  users: ['Markus', 'Shannon', 'Ryan', 'Scott', 'TestUser'],
  groups: {
    cis55: ['Markus', 'Shannon', 'Ryan', 'Scott']
    // For now, assume everyone has exactly 1 group
    // testGroup: ['Markus', 'TestUser']
  }
};
const {users, groups} = INIT_STRUCTURE;

// Clear database
mongoose.connection.dropDatabase()
  .then(() => console.log('- Dropped database'))

  // Create users
  .then(() => Promise.all(users.map(db.createUser)))
  .then(() => console.log(`+ Created ${users.length} users`))

  // Create groups
  .then(() => Promise.all(Object.keys(groups).map(groupName =>
    db.createGroup(groupName).then(() =>
      Promise.all(groups[groupName].map(userName =>
        db.addUserToGroup(groupName, userName)
      ))
    )
  )))
  .then(() => console.log(`+ Created ${Object.keys(groups).length} groups`))

  // All done!
  .then(() => console.log('\nSUCCESS: Created database!'))
  .catch(err => console.log('\nERROR: Failed to create database\n', err))
  .then(() => console.log())
  .then(() => mongoose.connection.close());
