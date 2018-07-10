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
  location: { lat: Number, lng: Number },
  private: { type: Boolean, default: true },
  attendees: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  invitees: [String],
  pendingAttendees: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  image: String,
  organizer: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Event', eventSchema);
