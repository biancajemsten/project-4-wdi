const mongoose = require('mongoose');


const timeSlotSchema = new mongoose.Schema({
  date: {type: Date, required: true},
  startTime: {type: Date, required: true},
  votes: [{ type: mongoose.Schema.ObjectId, ref: 'User', required: true }]
});


const eventSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: String,
  timeSlots: [timeSlotSchema],
  length: {type: Number, required: true},
  address: String,
  private: {type: Boolean, default: true},
  invitees: [String],
  pendingAttendees: [{ type: mongoose.Schema.ObjectId, ref: 'User', required: true }],
  image: String,
  organizer: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Event', eventSchema);
