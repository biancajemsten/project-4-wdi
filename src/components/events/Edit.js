import React from 'react';
import axios from 'axios';
import Auth from '../../lib/Auth';
import moment from 'moment';
import Promise from 'bluebird';

import EventsForm from './Form';

class EventsEdit extends React.Component {

  state = {
    startDate: moment(),
    timeSlots: [],
    address: '',
    errors: {
      name: ''
    }
  };

  componentDidMount() {
    Promise.props({
      event: axios.get(`/api/events/${this.props.match.params.id}`).then(res => res.data),
      users: axios.get('/api/users').then(res => res.data)
    })
      .then(res => {

        const options = res.users.map(user => ({ value: user._id, label: user.username }));
        const selectedOptions = res.event.invitees.map(invitee => ({ value: invitee._id, label: invitee.username }));
        const timeSlots = res.event.timeSlots.map(timeSlot => ({ date: timeSlot.date }));
        this.setState({ timeSlots, options, selectedOptions, ...res.event  });
      });
  }

  handleChange = ({ target: { name, value }}) => {
    this.setState({ [name]: value });
  }

  addTimeSlot = (e) => {
    e.preventDefault();
    const timeSlots = this.state.timeSlots.concat({ date: this.state.startDate.toISOString() });
    this.setState({ timeSlots });
  }

  removeTimeSlot = (e) => {
    e.preventDefault();
    const timeSlots = this.state.timeSlots.filter(dateObj => dateObj.date !== e.target.value);
    this.setState({ timeSlots });
  }

  handleClearSelectedTimes = (e) => {
    e.preventDefault();
    this.setState({ finalTimes: [], timeSlots: [], attendees: [], finalTimesChecker: false });
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

    axios({
      method: 'PUT',
      url: `/api/events/${this.props.match.params.id}`,
      data: this.state,
      headers: { Authorization: `Bearer ${Auth.getToken()}`}
    })
      .then(() => this.props.history.push(`/events/${this.props.match.params.id}`))
      .catch(err => this.setState({ errors: err.response.data.errors}));
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
          handleChange={this.handleChange}
          addTimeSlot={this.addTimeSlot}
          removeTimeSlot={this.removeTimeSlot}
          handleClearSelectedTimes={this.handleClearSelectedTimes}
          handleBlur={this.handleBlur}
          handleSubmit={this.handleSubmit}
          handleSelectChange={this.handleSelectChange}
          data={this.state}
        />
      </div>
    );
  }
}

export default EventsEdit;
