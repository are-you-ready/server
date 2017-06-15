const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AYRGroupSchema = new Schema({
  name:               {type: String, required: true, unique: true},
  users: [{
    name:             {type: String, required: true, unique: true},
    active:           {type: Boolean, required: true, default: true}
  }],
  events: [{
    name:             {type: String, required: true, unique: true},
    description:      {type: String},
    location:         {type: String},
    meetupLocation:   {type: String},
    createdBy:        {type: String, required: true},
    createdAt:        {type: Date, default: Date.now},
    notificationTime: {type: Date},
    readyTime:        {type: Date},
    attendees: [{
      user:           {type: String, required: true, unique: true},
      status:         {type: String, enum: ['pending', 'coming', 'not-coming', 'ready', 'not-ready']}
    }]
  }]
});

module.exports = {
  AYRGroup: mongoose.model('AYRGroup', AYRGroupSchema)
};
