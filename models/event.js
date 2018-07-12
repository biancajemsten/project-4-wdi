const mongoose = require('mongoose');


const timeSlotSchema = new mongoose.Schema({
  date: {type: String, required: true},
  startTime: {type: String, required: true},
  votes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
});

const eventSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: String,
  timeSlots: [timeSlotSchema],
  length: {type: Number, required: true},
  address: String,
  location: { lat: Number, lng: Number },
  private: { type: String, default: 'Private' },
  attendees: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  invitees: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  pendingAttendees: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  image: String,
  organizer: { type: mongoose.Schema.ObjectId, ref: 'User' },
  finalTimes: [String]
});


eventSchema.virtual('eventDates')
  .get(function() {
    return Array.from(new Set(this.timeSlots.map(slot => slot.date)));
  });


// timeSlotSchema.path('date')
//   .get(function formatDate(date){
//     return moment(date).format('ddd, MMM Do');
//   });



eventSchema.set('toJSON', { virtuals: true });


module.exports = mongoose.model('Event', eventSchema);
