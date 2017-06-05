const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AYRUserSchema = new Schema({
  name: {type: String, required: true, unique: true}
});

const AYREventSchema = new Schema({
  name: {type: String, required: true, unique: true},
  createdBy: {type: Schema.Types.ObjectId, ref: 'AYRUser'},
  createdAt: {type: Date, default: Date.now},
  attendees: [{
    user: {type: Schema.Types.ObjectId, ref: 'AYRUser'},
    status: {type: String, enum: ['pending', 'coming', 'not-coming', 'ready']}
  }]
});

const AYRGroupSchema = new Schema({
  name: {type: String, required: true, unique: true},
  users: [{type: Schema.Types.ObjectId, ref: 'AYRUser'}],
  events: [{type: Schema.Types.ObjectId, ref: 'AYREvent'}]
});

module.exports = {
  AYRUser: mongoose.model('AYRUser', AYRUserSchema),
  AYREvent: mongoose.model('AYREvent', AYREventSchema),
  AYRGroup: mongoose.model('AYRGroup', AYRGroupSchema)
};