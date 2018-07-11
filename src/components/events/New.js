import React from 'react';
import axios from 'axios';
import Auth from '../../lib/Auth';
import moment from 'moment';

import EventsForm from './Form';

class EventsNew extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      startDate: moment(),
      selectedTimes: [],
      timeSlots: []
    };
    this.onChange = this.onChange.bind(this);
    this.addTimeSlot = this.addTimeSlot.bind(this);
    this.removeTimeSlot = this.removeTimeSlot.bind(this);
  }

  handleChange = ({ target: { name, value }}) => {
    this.setState({ [name]: value });
  }

  onChange(date) {
    this.setState({ startDate: date });
  }

  addTimeSlot(e) {
    e.preventDefault();
    const selectedTimes = this.state.selectedTimes;
    const formattedTime = moment(this.state.startDate._d).format('ddd, MMM Do, HH:mm');
    selectedTimes.push(formattedTime);
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

  handleSubmit = (e) => {
    e.preventDefault();
    const timeSlot = this.state.selectedTimes.map(time => {
      const date = moment(time, 'ddd, MMM Do, HH:mm').format('ddd, MMM Do');
      const startTime = moment(time, 'ddd, MMM Do, HH:mm').format('HH:mm');
      console.log(typeof date); 
      return { date: date, startTime: startTime};
    });
    this.setState({ timeSlots: timeSlot });
    axios({
      method: 'POST',
      url: '/api/events',
      data: this.state,
      headers: { Authorization: `Bearer ${Auth.getToken()}`}
    })
      .then(() => this.props.history.push('/events'))
      .catch(err => this.setState({ errors: err.response.data.errors}));
  }


  render() {
    return(
      <EventsForm
        handleChange={this.handleChange}
        addTimeSlot={this.addTimeSlot}
        removeTimeSlot={this.removeTimeSlot}
        handleSubmit={this.handleSubmit}
        handleUpload={this.handleUpload}
        selected={this.state.startDate}
        onChange={this.onChange}
        data={this.state}
      />
    );
  }
}

export default EventsNew;
