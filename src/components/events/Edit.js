import React from 'react';
import axios from 'axios';
import Auth from '../../lib/Auth';
import moment from 'moment';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import EventsForm from './Form';

class EventsEdit extends React.Component {

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
    this.handleClearSelectedTimes = this.handleClearSelectedTimes.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
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

  onChange(date) {
    this.setState({ startDate: date });
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

  // clearArray = (array) => {
  //   const arrayToClear = array.slice();
  //   return arrayToClear.splice(0, arrayToClear.length);
  // }

  handleClearSelectedTimes(e) {
    e.preventDefault();
    const finalTimes = this.state.finalTimes.slice();
    finalTimes.splice(0, finalTimes.length);
    const selectedTimes = this.state.selectedTimes.slice();
    selectedTimes.splice(0, selectedTimes.length);
    const attendees = this.state.attendees.slice();
    attendees.splice(0, attendees.length);
    let finalTimesChecker = this.state.finalTimesChecker;
    finalTimesChecker = false;
    this.setState({ finalTimes, selectedTimes, attendees, finalTimesChecker });
  }

  handleUpload = (e) => {
    this.setState({ image: e.filesUploaded[0].url });
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

  handleSubmit = (e) => {
    e.preventDefault();
    this.convertEventLengthToMinutes();
    const timeSlots = this.state.selectedTimes.map(time => {
      const date = time;
      return { date: date };
    });
    this.setState({ timeSlots }, () => {
      axios({
        method: 'PUT',
        url: `/api/events/${this.props.match.params.id}`,
        data: this.state,
        headers: { Authorization: `Bearer ${Auth.getToken()}`}
      })
        .then(() => this.props.history.push(`/events/${this.props.match.params.id}`))
        .catch(err => this.setState({ errors: err.response.data.errors}));
    });
  }

  componentDidMount() {
    this.populateHours();
    this.populateMinutes();
    axios({
      url: `/api/events/${this.props.match.params.id}`,
      method: 'GET'
    })
      .then(res => {
        const event = res.data;
        const selectedOptions = event.invitees.map(invitee => {
          return { value: invitee._id, label: invitee.username };
        });
        const selectedTimes = event.timeSlots.map(timeSlot => {
          return timeSlot.date;
        });

        this.setState({ selectedTimes, selectedOptions, ...event });
      })
      .then(() => {
        axios({
          url: '/api/users',
          method: 'GET'
        })
          .then(res => {
            const users = res.data;
            const options = users.map(user => {
              return { value: user._id, label: user.username };
            });
            this.setState({ options });
          });
      });
  }

  handleSelectChange = selectedOptions => {
    const invitees = selectedOptions.map(option => option.value);
    this.setState({ selectedOptions, invitees });
  }

  render() {
    return(
      <div>
        <h2 className="title is-2">Edit your event</h2>
        <hr/>
        <EventsForm
          handleAddressChange={this.handleAddressChange}
          handleSelect={this.handleSelect}
          handleChange={this.handleChange}
          handleBlur={this.handleBlur}
          addTimeSlot={this.addTimeSlot}
          removeTimeSlot={this.removeTimeSlot}
          handleClearSelectedTimes={this.handleClearSelectedTimes}
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

export default EventsEdit;
