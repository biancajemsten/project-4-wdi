import React from 'react';
import axios from 'axios';
import Auth from '../../lib/Auth';
import moment from 'moment';

import EventsForm from './Form';

class EventsNew extends React.Component {

  state = {
    startDate: moment(),
    timeSlots: [],
    errors: {
      name: ''
    }
  };

  componentDidMount() {
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

  handleBlur = ({target: { name, value }}) => {
    const errorMessage = value.length === 0 ? 'This field is required' : '';
    const errors = this.state.errors;
    for(let field in errors) {
      field = name;
      errors[field] = errorMessage;
      return this.setState({ errors });
    }
  }

  handleSelectChange = selectedOptions => {
    const invitees = selectedOptions.map(option => option.value);
    this.setState({ selectedOptions, invitees });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log('Event created');
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
      <div>
        <h2 className="title is-2">Create a new event</h2>
        <hr/>
        <EventsForm
          handleChange={this.handleChange}
          addTimeSlot={this.addTimeSlot}
          removeTimeSlot={this.removeTimeSlot}
          handleBlur={this.handleBlur}
          handleSubmit={this.handleSubmit}
          handleSelectChange={this.handleSelectChange}
          data={this.state}
        />
      </div>
    );
  }
}

export default EventsNew;
