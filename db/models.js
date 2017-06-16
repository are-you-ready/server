const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AYRGroupSchema = new Schema({
  name:               {type: String, required: true, unique: true},
  users: [{
    name:             {type: String, required: true},
    active:           {type: Boolean, required: true, default: true}
  }],
  events: [{
    name:             {type: String, required: true},
    type:             {type: String, required: true},
    description:      {type: String, required: true},
    location:         {type: String, required: true},
    meetupLocation:   {type: String, required: true},
    createdBy:        {type: String, required: true},
    createdAt:        {type: Date, required: true, default: Date.now},
    notificationTime: {type: Date, required: true},
    readyTime:        {type: Date, required: true},
    attendees: [{
      userName:       {type: String, required: true},
      status:         {type: String, required: true, enum: ['pending', 'coming', 'not-coming', 'ready', 'not-ready']}
    }]
  }]
});

module.exports = {
  AYRGroup: mongoose.model('AYRGroup', AYRGroupSchema)
};
