/* eslint-disable no-console */
const mongoose = require('mongoose');
const db = require('../db');

const INIT_STRUCTURE = { groups: [] };
for (let i = 1; i <= 999; ++i) {
  INIT_STRUCTURE.groups.push({
    name: `cis${i}`,
    users: ['Markus', 'Shannon', 'Ryan', 'Scott']
  });
}
const {groups} = INIT_STRUCTURE;

// Clear database
mongoose.connection.dropDatabase()
  .then(() => console.log('- Dropped database'))

  // Create groups
  .then(() => Promise.all(groups.map(group =>
    db.createGroup(group.name)
      .then(() => Promise.all(group.users.map(userName =>
        db.updateGroup(group.name, { $push: { users: { name: userName } } })
      )))
  )))
  .then(() => console.log(`+ Created ${Object.keys(groups).length} groups`))

  // All done!
  .then(() => console.log('\nSUCCESS: Created database!'))
  .catch(err => console.log('\nERROR: Failed to create database\n', err))
  .then(() => console.log())
  .then(() => mongoose.connection.close());
