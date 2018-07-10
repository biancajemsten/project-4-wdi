import React from 'react';
import axios from 'axios';
import Auth from '../../lib/Auth';

import EventsForm from './Form';

class EventsNew extends React.Component {

  state = {}

  handleChange =({ target: { name, value }}) => {
    this.setState({ [name]: value });
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
        handleSubmit={this.handleSubmit}
        handleUpload={this.handleUpload}
        data={this.state}
      />
    );
  }
}

export default EventsNew;
