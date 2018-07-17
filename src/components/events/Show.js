import React from 'react';
import axios from 'axios';
import Auth from '../../lib/Auth';
import PendingRequests from './PendingRequests';
import SelectedTimes from './SelectedTimes';
import Votes from './Votes';
import Location from './Location';
import Hero from './Hero';

class EventsShow extends React.Component{

  constructor(){
    super();
    this.state = {
      votes: []
    };
  }

  componentDidMount(){
    axios.get(`/api/events/${this.props.match.params.id}`)
      .then(res => this.setState({event: res.data}))
      .catch(err => this.setState({error: err.message}));
  }

  // allows selecting the final times (ADMIN)
  handlePickDate = (date) => {

    let finalTimes = [];
    const index = this.state.event.finalTimes.indexOf(date);

    if(index === -1) {
      finalTimes = this.state.event.finalTimes.concat(date);
    } else {
      finalTimes = this.state.event.finalTimes.slice();
      finalTimes.splice(index, 1);
    }
    const event = { ...this.state.event, finalTimes };
    this.setState({ event });

  }

  // persist the final times (ADMIN)
  handleConfirmFinalTimes = () => {
    axios({
      method: 'PUT',
      url: `/api/events/${this.props.match.params.id}`,
      data: this.state.event,
      headers: { Authorization: `Bearer ${Auth.getToken()}`}
    })
      .then(res => this.setState({ event: res.data }))
      .catch(err => console.log(err));
  }

  // allows a user to vote on a timeslot
  handleVote = (slotId) => {
    let votes;
    const index = this.state.votes.indexOf(slotId);

    if(index === -1) {
      votes = this.state.votes.concat(slotId);
    } else {
      votes = this.state.votes.slice();
      votes.splice(index, 1);
    }
    this.setState({ votes });
  }

  // allows a user to submit their vote
  handleVoteSubmit = () => {
    axios({
      method: 'POST',
      url: `/api/events/${this.props.match.params.id}/vote`,
      data: this.state,
      headers: { Authorization: `Bearer ${Auth.getToken()}`}
    })
      .then(res => this.setState({ event: res.data }))
      .catch(err => console.log(err));
  }

  // allows a user to decline an event that they are already attending
  handleDeclineInvitation = () => {
    const invitees = this.state.event.invitees.filter(invitee => invitee._id !== Auth.getPayload().sub);
    const event = { ...this.state.event, invitees };
    axios({
      method: 'PUT',
      url: `/api/events/${this.props.match.params.id}`,
      data: event,
      headers: { Authorization: `Bearer ${Auth.getToken()}`}
    })
      .then(() => this.props.history.push(`/users/${Auth.getPayload().sub}`))
      .catch(err => console.log(err));
  }

  // allows a user to request joining this event
  handleJoinRequest = () => {
    axios({
      method: 'POST',
      url: `/api/events/${this.props.match.params.id}/requests`,
      data: event,
      headers: { Authorization: `Bearer ${Auth.getToken()}`}
    })
      .then(res => this.setState({ event: res.data }))
      .catch(err => console.log(err));
  }

  // accepts a user's request to this event (ADMIN)
  acceptRequest = (userId) => {
    axios({
      method: 'PUT',
      url: `/api/events/${this.props.match.params.id}/requests/${userId}`,
      headers: { Authorization: `Bearer ${Auth.getToken()}`}
    })
      .then(res => this.setState({ event: res.data }))
      .catch(err => console.log(err));
  }

  // declines a user's request to this event (ADMIN)
  declineRequest = (userId) => {
    axios({
      method: 'DELETE',
      url: `/api/events/${this.props.match.params.id}/requests/${userId}`,
      headers: { Authorization: `Bearer ${Auth.getToken()}`}
    })
      .then(res => this.setState({ event: res.data }))
      .catch(err => console.log(err));
  }

  // deletes the event
  handleDelete = () => {
    axios({
      method: 'DELETE',
      url: `/api/events/${this.props.match.params.id}`,
      headers: { Authorization: `Bearer ${Auth.getToken()}`}
    })
      .then(() => this.props.history.push(`/users/${Auth.getPayload().sub}`));
  }

  render(){
    console.log(this.state);
    if(!this.state.event) return <div className="loadContainer"><img src="/assets/images/Pacman.svg"/><h2 className="title">Loading...</h2></div>;
    return(
      <div>
        <Hero
          event={this.state.event}
          handleDelete={this.handleDelete}
          handleDeclineInvitation={this.handleDeclineInvitation}
          handleJoinRequest={this.handleJoinRequest}
        />

        <Votes
          event={this.state.event}
          handleVote={this.handleVote}
          handlePickDate={this.handlePickDate}
          handleConfirmFinalTimes={this.handleConfirmFinalTimes}
          handleVoteSubmit={this.handleVoteSubmit}
          votes={this.state.votes}
        />

        {this.state.event.finalTimesChecker &&
          <SelectedTimes
            event={this.state.event}
          />
        }

        {this.state.event.location && <Location event={this.state.event} />}

        {Auth.getPayload() && Auth.getPayload().sub === this.state.event.organizer._id && <PendingRequests event={this.state.event} acceptRequest={this.acceptRequest} declineRequest={this.declineRequest} />}

      </div>
    );
  }
}

export default EventsShow;
