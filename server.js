const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();

const AYR_PORT = process.argv[2] || process.env.AYR_PORT || 3000;

// For easier debugging!
app.set('json spaces', 2);

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

function cleanGroup(group) {
  const users = {};
  group.users.forEach(user => {
    users[user.name] = {
      name: user.name,
      active: user.active
    };
  });

  return {
    name: group.name,
    users: group.users.map(user => users[user.name]),
    events: group.events.map(event => ({
      name: event.name,
      type: event.type,
      description: event.description,
      location: event.location,
      meetupLocation: event.meetupLocation,
      createdBy: users[event.createdBy],
      createdAt: event.createdAt,
      notificationTime: event.notificationTime,
      readyTime: event.readyTime,
      attendees: event.attendees.map(attendee => ({
        user: users[attendee.userName],
        status: attendee.status
      }))
    }))
  };
}

app.get('/api/group/:groupName', (req, res) => {
  const {groupName} = req.params;

  db.readGroup(groupName)
    .then(group => res.json(cleanGroup(group)))
    .catch(err => res.json({
      errorCode: err.code,
      errorDescription: err.message
    }));
});

app.post('/api/group/:groupName/users', (req, res) => {
  const {groupName} = req.params;
  const {userName} = req.body;

  db.updateGroup(groupName, { $push: { users: { name: userName } } })
    .then(group => res.json(cleanGroup(group)))
    .catch(err => res.json({
      errorCode: err.code,
      errorDescription: err.message
    }));
});

app.post('/api/group/:groupName/events', (req, res) => {
  const {groupName} = req.params;
  const newEvent = {
    name: req.body.name,
    type: req.body.type,
    description: req.body.description,
    location: req.body.location,
    meetupLocation: req.body.meetupLocation,
    createdBy: req.body.createdBy,
    notificationTime: req.body.notificationTime,
    readyTime: req.body.readyTime
  };

  db.readGroup(groupName)
    .then(group => {
      newEvent.attendees = group.users.map(user => ({
        userName: user.name,
        status: 'pending'
      }));
      return db.updateGroup(groupName, { $push: { events: newEvent } });
    })
    .then(group => res.json(cleanGroup(group)))
    .catch(err => res.json({
      errorCode: err.code,
      errorDescription: err.message
    }));
});

app.post('/api/group/:groupName/event/:eventName/status', (req, res) => {
  const {groupName, eventName} = req.params;
  const {userName, eventStatus} = req.body;

  db.readGroup(groupName)
    .then(group => {
      const eventIndex = group.events.findIndex(event => event.name === eventName);
      const attendeeIndex = group.events[eventIndex].attendees.findIndex(attendee => attendee.userName === userName);
      const path = `events.${eventIndex}.attendees.${attendeeIndex}.status`;
      return db.updateGroup(groupName, { $set: { [path]: eventStatus } });
    })
    .then(group => {console.log('FOOSADFOASDFOASDF', group); return res.json(cleanGroup(group))})
    .catch(err => res.json({
      errorCode: err.code,
      errorDescription: err.message
    }));
});

app.listen(AYR_PORT, () => {
  console.log(`Server started on port ${AYR_PORT}.`); // eslint-disable-line no-console
});
