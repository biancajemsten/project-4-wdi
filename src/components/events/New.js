import React from 'react';
import axios from 'axios';
import Auth from '../../lib/Auth';

import EventsForm from './Form';

class EventsNew extends React.Component {

  state = {}

  handleChange =({ target: { name, value }}) => {
    this.setState({ [name]: value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    axios({
      method: 'POST',
      url: '/api/events',
      data: this.state,
      headers: { Authorization: `Bearer: ${Auth.getToken()}`}
    })
      .then(() => this.props.history.push('/events'))
      .catch(err => this.setState({ errors: err.response.data.errors}));
  }

  // uploadImage = () => {
  //   const { client } = this.props.client
  // }

  render() {
    console.log(this.props);
    return(
      <EventsForm
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        data={this.state}
      />
    );
  }
}

export default EventsNew;
