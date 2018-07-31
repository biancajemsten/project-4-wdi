import React from 'react';
import ReactFilestack from 'filestack-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PlacesAutocomplete from '../common/PlacesAutocomplete';
import Select from 'react-select';
import moment from 'moment';

const EventsForm = ({ handleBlur, addTimeSlot, removeTimeSlot, handleClearSelectedTimes, handleSubmit, handleChange, handleSelectChange, data }) => {

  const getHours = () => {
    const hours = [];
    for (let i=0; i < 25; i++) hours.push(i);
    return hours;
  };

  const getQuarterHours = () => {
    const quarterHours = [];
    for (let i=0; i < 60; i+=15) quarterHours.push(i);
    return quarterHours;
  };
  return(
    <form onSubmit={handleSubmit}>
      <div className="columns is-mobile is-multiline">
        <div className="field column is-full-mobile is-half-desktop is-half-tablet">
          <label className="label">Event Name</label>
          <input className="input" name="name" onChange={handleChange} onBlur={handleBlur} value={data.name || ''} />
          {data.errors.name && <small>{data.errors.name}</small>}
        </div>

        <div className="field column is-full-mobile is-half-desktop is-half-tablet">
          <label className="label">Description</label>
          <textarea className="input" name="description" onChange={handleChange} value={data.description || ''} />
        </div>

        {!data.finalTimesChecker && <div className="field column is-full-mobile is-full-desktop is-full-tablet">
          <label className="label">Possible Dates</label>
          <div className="datePicker">
            <DatePicker
              selected={data.startDate}
              onChange={date => handleChange({ target: { name: 'startDate', value: date } })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="LLL"
              timeCaption="time"
              className = "input datePicker"
            />
          </div>
          <button className="button addTimeSlot" onClick={addTimeSlot}>Add timeslot</button>
          <div className="tagContainer">
            {data.timeSlots.map(time =>
              <span key={time.date} className="tag">{moment(time.date).format('ddd, MMM Do, HH:mm')}
                <button value={time.date || ''} onClick={removeTimeSlot} className="delete"></button>
              </span>
            )}
          </div>
        </div>}

        {data.finalTimesChecker && <div className="field column is-full-mobile is-full-desktop is-full-tablet">
          <label className="label">Selected Times</label>
          {data.finalTimes.map(date =>
            <p key={date}>{moment(date).format('ddd, MMM Do, HH:mm')}</p>
          )}
          <button className="button" onClick={handleClearSelectedTimes}>Clear Selected Times</button>
        </div>}

        <div className="field column is-full-mobile is-half-desktop is-half-tablet">
          <label className="label">Event Length</label>
          <div className="control">
            <div className="select is-full-width">
              <select name="hours" onChange={handleChange} value={data.hours || ''}>
                <option value="" disabled>Hours</option>
                {getHours().map(hour =>
                  <option key={hour}>{hour}</option>
                )}
              </select>
            </div>
          </div>
          <div className="control">
            <div className="select is-full-width">
              <select name="minutes" onChange={handleChange} value={data.minutes || ''}>
                <option value="" disabled>Minutes</option>
                {getQuarterHours().map(quarters =>
                  <option key={quarters}>{quarters}</option>
                )}
              </select>
            </div>
          </div>
          {data.errors.length && <small>{data.errors.length}</small>}
        </div>

        <div className="field column is-full-mobile is-half-desktop is-half-tablet">
          <label className="label">Location</label>
          <PlacesAutocomplete
            className="input"
            name="address"
            value={data.address || ''}
            handleChange={handleChange}
          />
        </div>

        <div className="field column is-half-mobile is-half-desktop is-half-tablet">
          <label className="label">Invitees</label>
          <Select
            multi
            name="invitees"
            value={data.selectedOptions}
            onChange={handleSelectChange}
            options={data.options}
          />
        </div>

        <div className="field column is-half-mobile is-half-desktop is-half-tablet">
          <label className="label">Set Privacy</label>
          <div className="control">
            <div className="select is-fullwidth">
              <select name="privacy" onChange={handleChange} value={data.privacy || ''}>
                <option value="" disabled>Set event privacy</option>
                <option>Private</option>
                <option>Public</option>
              </select>
            </div>
          </div>
          {data.errors.privacy && <small>{data.errors.privacy}</small>}
        </div>

        <div className="field column filePicker is-half-mobile is-one-third-desktop is-one-third-tablet">
          <label className="label">Upload an image</label>
          {data.image && <figure className="image is-90x90">
            <img src={data.image} alt="user upload"/>
          </figure>}
          <ReactFilestack
            apikey='A1P1k3n9REqxOW2Z9xz22z'
            name="image"
            onSuccess={e => handleChange({ target: { name: 'image', value: e.filesUploaded[0].url } })}
            value={data.image || ''}
          />
        </div>
      </div>
      <button className="button">Submit</button>
    </form>
  );
};

export default EventsForm;
