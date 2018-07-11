import React from 'react';

const EventsForm = ({ handleSubmit, handleChange, data }) => {
  return(
    <form>
      <div className="field">
        <label className="label">Event Name</label>
        <input className="input" name="name" onChange={handleChange} value={data.name || ''} />
      </div>

      <div className="field">
        <label className="label">Description</label>
        <textarea className="input" name="description" onChange={handleChange} value={data.description || ''} />
      </div>

      <div className="field">
        <label className="label">Possible Dates</label>
        <input className="input" name="name" onChange={handleChange} value={data.timeSlots || ''} />
      </div>

      <div className="field">
        <label className="label">Location</label>
        <input className="input" name="location" onChange={handleChange} value={data.location || ''} />
      </div>

      <div className="field">
        <label className="label">Invitees</label>
        <input className="input" name="invitees" onChange={handleChange} value={data.invitees || ''} />
      </div>

      <div className="field">
        <label className="label">Set Privacy</label>
        <div className="control">
          <div className="select is-fullwidth">
            <select name="private" onChange={handleChange} value={data.privacy || ''}>
              
            </select>

          </div>
        </div>
      </div>



    </form>
  )
}



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
organizer: { type: mongoose.Schema.ObjectId, ref: 'User' }
