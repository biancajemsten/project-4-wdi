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
      selectedTimeSlots: []
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
    let selectedTimeSlots;
    const index = this.state.selectedTimeSlots.indexOf(slotId);

    if(index === -1) {
      selectedTimeSlots = this.state.selectedTimeSlots.concat(slotId);
    } else {
      selectedTimeSlots = this.state.selectedTimeSlots.slice();
      selectedTimeSlots.splice(index, 1);
    }
    this.setState({ selectedTimeSlots });
  }

  // allows a user to submit their vote
  handleVoteSubmit = () => {
    const timeSlots = this.state.event.timeSlots.map(timeSlot => {
      const slot = { ...timeSlot };
      if(this.state.selectedTimeSlots.includes(slot._id)) slot.votes.push(Auth.getPayload().sub);
      return slot;
    });
    const attendees = this.state.event.attendees.concat(Auth.getPayload().sub);
    const event = { ...this.state.event, attendees, timeSlots };

    axios({
      method: 'PUT',
      url: `/api/events/${this.props.match.params.id}`,
      data: event,
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
    const joinRequests = this.state.event.joinRequests.concat(Auth.getPayload().sub);
    const event = { ...this.state.event, joinRequests };

    axios({
      method: 'PUT',
      url: `/api/events/${this.props.match.params.id}`,
      data: event,
      headers: { Authorization: `Bearer ${Auth.getToken()}`}
    })
      .then(res => this.setState({ event: res.data }))
      .catch(err => console.log(err));
  }

  // accepts a user's request to this event (ADMIN)
  acceptRequest = (id) => {
    const joinRequests = this.state.event.joinRequests.slice();
    joinRequests.splice(joinRequests.indexOf(id), 1);
    const invitees = this.state.event.invitees.concat(id);
    const event = { ...this.state.event, joinRequests, invitees };

    axios({
      method: 'PUT',
      url: `/api/events/${this.props.match.params.id}`,
      data: event,
      headers: { Authorization: `Bearer ${Auth.getToken()}`}
    })
      .then(res => this.setState({ event: res.data }))
      .catch(err => console.log(err));
  }

  // declines a user's request to this event (ADMIN)
  declineRequest = (id) => {
    const joinRequests = this.state.event.joinRequests.slice();
    joinRequests.splice(joinRequests.indexOf(id), 1);
    const event = { ...this.state.event, joinRequests };
    axios({
      method: 'PUT',
      url: `/api/events/${this.props.match.params.id}`,
      data: event,
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
          selectedTimeSlots={this.state.selectedTimeSlots}
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
