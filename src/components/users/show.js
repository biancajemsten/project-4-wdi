import React from 'react';
import axios from 'axios';
import EventList from './EventList';

class UsersShow extends React.Component {

  state = {}

  componentDidMount() {
    axios({
      method: 'GET',
      url: `/api/users/${this.props.match.params.id}`
    })
      .then(res => {
        const user = res.data;
        this.setState({ user });
      });
  }

  render() {
    return(
      <div>
        {this.state.user && <h1 className="title is-1">{`${this.state.user.username}'s events`}</h1>}
        <hr/>
        <div className="columns">
          {this.state.user && this.state.user.myEvents.length > 0 && <EventList
            user = {this.state.user}
            events = {this.state.user.myEvents}
          />}
          {this.state.user && this.state.user.invitedToEvents.length > 0 && <EventList
            user= {this.state.user}
            events = {this.state.user.invitedToEvents}
          />}
        </div>
      </div>
    );
  }

}

export default UsersShow;
