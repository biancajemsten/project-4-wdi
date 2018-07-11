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
      selectedTimes: []
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
    selectedTimes.push(this.state.startDate._d.toString());
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
