import React from 'react';
import axios from 'axios';
import Auth from '../../lib/Auth';
import moment from 'moment';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import EventsForm from './Form';

class EventsNew extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      startDate: moment(),
      selectedTimes: [],
      timeSlots: [],
      address: '',
      errors: {
        name: ''
      }
    };
    this.onChange = this.onChange.bind(this);
    this.addTimeSlot = this.addTimeSlot.bind(this);
    this.removeTimeSlot = this.removeTimeSlot.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.populateHours = this.populateHours.bind(this);
  }

  handleAddressChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.setState({ location: latLng, address: address }))
      .catch(error => console.error('Error', error));
  };

  handleChange = ({ target: { name, value }}) => {
    this.setState({ [name]: value });
  }

  handleBlur = ({target: { name, value }}) => {
    const errorMessage = value.length === 0 ? 'This field is required' : '';
    const errors = this.state.errors;
    for(let field in errors) {
      field = name;
      errors[field] = errorMessage;
      return this.setState({ errors });
    }
  }

  onChange(date) {
    this.setState({ startDate: date });
  }

  populateHours = () => {
    const hoursInDay = [];
    for (let i=0; i < 25; i++) {
      hoursInDay.push(i);
    }
    return this.setState({ hoursInDay });
  }

  populateMinutes = () => {
    const quarterHours = [];
    for (let i=0; i < 60; i+=15) {
      quarterHours.push(i);
    }
    return this.setState({ quarterHours });
  }

  convertEventLengthToMinutes = () => {
    const hours = this.state.hours;
    const minutes = this.state.minutes;
    const length = (hours * 60) + parseInt(minutes);
    this.setState({ length });
  }

  addTimeSlot(e) {
    e.preventDefault();
    const selectedTimes = this.state.selectedTimes.slice();
    selectedTimes.push(this.state.startDate._d);
    this.setState({ selectedTimes });
  }

  removeTimeSlot(e) {
    e.preventDefault();
    const selectedTimes = this.state.selectedTimes;
    selectedTimes.splice(selectedTimes.indexOf(e.target.value), 1);
    this.setState({ selectedTimes });
  }

  handleUpload = (e) => {
    this.setState({ image: e.filesUploaded[0].url });
  }

  saveEvent = () => {
    axios({
      method: 'POST',
      url: '/api/events',
      data: this.state,
      headers: { Authorization: `Bearer ${Auth.getToken()}`}
    })
      .then(() => this.props.history.push('/events'))
      .catch(err => this.setState({ errors: err.response.data.errors}));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.convertEventLengthToMinutes(); 
    const timeSlots = this.state.selectedTimes.map(time => {
      const date = time;
      return { date: date };
    });

    this.setState({ timeSlots }, this.saveEvent);
  }

  componentDidMount() {
    this.populateHours();
    this.populateMinutes();
    axios({
      url: '/api/users',
      method: 'GET'
    })
      .then(res => {
        const options = res.data.map(user => {
          return { value: user._id, label: user.username, tel: user.tel };
        });
        this.setState({ options });
      });
  }

  handleSelectChange = selectedOptions => {
    const invitees = selectedOptions.map(option => option.value);
    this.setState({ selectedOptions, invitees });
  }

  render() {
    return(
      <div>
        <h2 className="title is-2">Create a new event</h2>
        <hr/>
        <EventsForm
          handleAddressChange={this.handleAddressChange}
          handleSelect={this.handleSelect}
          handleChange={this.handleChange}
          handleBlur={this.handleBlur}
          addTimeSlot={this.addTimeSlot}
          removeTimeSlot={this.removeTimeSlot}
          handleSubmit={this.handleSubmit}
          handleUpload={this.handleUpload}
          handleSelectChange={this.handleSelectChange}
          selected={this.state.startDate}
          onChange={this.onChange}
          data={this.state}
        />
      </div>
    );
  }
}

export default EventsNew;
