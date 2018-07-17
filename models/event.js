const mongoose = require('mongoose');
const moment = require('moment');

const timeSlotSchema = new mongoose.Schema({
  date: { type: Date },
  votes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
});

timeSlotSchema.virtual('startDate')
  .get(function() {
    return moment(this.date).format('YYYY-MM-DD');
  });

timeSlotSchema.virtual('startTime')
  .get(function() {
    return moment(this.date).format('HH:mm');
  });

timeSlotSchema.virtual('endDate')
  .get(function(){
    const event = this.parent();
    return moment(this.date).add(event.length, 'minutes').format('YYYY-MM-DD');
  });

timeSlotSchema.virtual('endTime')
  .get(function(){
    const event = this.parent();
    return moment(this.date).add(event.length, 'minutes').format('HH:mm');
  });

timeSlotSchema.set('toJSON', { getters: true, virtuals: true });

const eventSchema = new mongoose.Schema({
  name: {type: String, required: 'Event name is required'},
  description: String,
  timeSlots: [timeSlotSchema],
  length: {type: Number, required: 'Event length is required'},
  address: String,
  location: { lat: Number, lng: Number },
  privacy: { type: String, enum: ['Private', 'Public'], required: 'Privacy level is required' },
  invitees: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  pendingAttendees: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  image: String,
  organizer: { type: mongoose.Schema.ObjectId, ref: 'User' },
  finalTimes: [Date],
  joinRequests: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
});

eventSchema.virtual('eventDates')
  .get(function() {
    return Array.from(new Set(this.timeSlots.map(slot => moment(slot.date).format('ddd, MMM Do'))));
  });

eventSchema.virtual('finalEventDates')
  .get(function(){
    return Array.from(new Set(this.finalTimes.map(time => moment(time).format('ddd, MMM Do'))));
  });

eventSchema.virtual('finalTimesChecker')
  .get(function() {
    return this.finalTimes.length > 0 ? true : false;
  });

eventSchema.virtual('hours')
  .get(function() {
    return Math.floor(moment.duration(this.length, 'minutes').asHours());
  });

eventSchema.virtual('minutes')
  .get(function() {
    return Math.round(this.length % 60);
  });

eventSchema.virtual('attendees')
  .get(function() {
    const attendees = this.timeSlots.reduce((attendees, slot) => attendees.concat(slot.votes), []).map(id => id.toString());
    return Array.from(new Set(attendees));
  });

eventSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
