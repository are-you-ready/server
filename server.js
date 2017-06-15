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

app.get('/api/user/:name', (req, res) => {
  const {name} = req.params;

  db.getUser(name)
    .then(user =>
      db.getGroupsContainingUser(name)
        .then(groups => ({user, groups}))
    )

    .then(({user, groups}) => {
      res.json({
        name: user.name,
        groups: groups.map(group => ({
          name: group.name,
          events: group.events, // TODO
          users: group.users.map(user => ({name: user.name}))
        }))
      });
    })
    .catch(err => {
      res.json({error: err.message});
    });
});

app.get('/api/group/:name', (req, res) => {
  const {name} = req.params;

  db.getGroup(name)

    .then(group => {
      res.json({
        name: group.name,
        events: group.events, // TODO
        users: group.users.map(user => ({name: user.name}))
      });
    })
    .catch(err => {
      res.json({error: err.message});
    });
});

app.post('/api/createEvent', (req, res) => {
  console.log(req.body);
});

app.listen(AYR_PORT, () => {
  console.log(`Server started on port ${AYR_PORT}.`); // eslint-disable-line no-console
});
