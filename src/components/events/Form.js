import React from 'react';
import ReactFilestack from 'filestack-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PlacesAutocomplete from 'react-places-autocomplete';


const EventsForm = ({ handleAddressChange, handleSelect, selected, onChange, addTimeSlot, removeTimeSlot, handleUpload, handleSubmit, handleChange, data }) => {
  return(
    <form onSubmit={handleSubmit}>
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
        <DatePicker
          selected={selected}
          onChange={onChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="LLL"
          timeCaption="time"
        />
        <button className="button" onClick={addTimeSlot}>Add timeslot</button>
        {data.selectedTimes.map(time =>
          <span key={time} className="tag is-success">{time.toString()}<button value={time} onClick={removeTimeSlot} className="delete"></button></span>
        )}
      </div>

      <div className="field">
        <label className="label">Event Length</label>
        <input className="input" name="length" onChange={handleChange} value={data.length || ''} />
      </div>


      <div className="field">
        <label className="label">Location</label>
        <PlacesAutocomplete
          value={data.address}
          onChange={handleAddressChange}
          onSelect={handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Search Places ...',
                  className: 'location-search-input'
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div key={suggestion}
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </div>

      <div className="field">
        <label className="label">Upload an image</label>
        <ReactFilestack apikey='A1P1k3n9REqxOW2Z9xz22z' name="image" onSuccess={handleUpload} value={data.image || ''} />
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
              <option value="" disabled>Set event privacy</option>
              <option>Private</option>
              <option>Public</option>
            </select>
          </div>
        </div>
      </div>

      <button className="button">Submit</button>
    </form>
  );
};

export default EventsForm;
