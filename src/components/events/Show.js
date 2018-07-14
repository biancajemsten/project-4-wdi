import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Auth from '../../lib/Auth';
import GoogleMap from '../common/GoogleMap';

class EventsShow extends React.Component{

  constructor(){
    super();
    this.state = {
      selectedTimeSlots: [],
      finalTimes: []
    };
  }

  componentDidMount(){
    axios.get(`/api/events/${this.props.match.params.id}`)
      .then(res => this.setState({event: res.data}))
      .catch(err => this.setState({error: err.message}));
  }

  checkUserIsOrganizer = () => {
    if(!Auth.getPayload()) return false;
    if(Auth.getPayload().sub === this.state.event.organizer) return true;
  }

  //checks the date of the column with the date of the timeSlot
  filterStartTime = (date, i) => {
    if(this.state.event.finalTimes.length > 0){
      if(date === moment(this.state.event.finalTimes[i]).format('ddd, MMM Do')) return true;
    } else{
      if(date === moment(this.state.event.timeSlots[i].date).format('ddd, MMM Do')) return true;
    }
  };

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

  isVoted = (slotId) => {
    return this.state.selectedTimeSlots.includes(slotId);
  }

  handlePickDate = (date) => {
    let finalTimes;
    const index = this.state.finalTimes.indexOf(date);

    if(index === -1) {
      finalTimes = this.state.finalTimes.concat(date);
    } else {
      finalTimes = this.state.finalTimes.slice();
      finalTimes.splice(index, 1);
    }
    this.setState({ finalTimes });
  }

  isPicked = (date) => {
    return this.state.finalTimes.includes(date);
  }

  handleVoteSubmit = () => {
    new Promise( resolve => {
      const timeSlots = this.state.event.timeSlots.map(timeSlot => {
        this.state.selectedTimeSlots.forEach(id => {
          if(timeSlot._id === id) timeSlot.votes.push(Auth.getPayload().sub);
        });
      });
      const attendees = this.state.event.attendees;
      attendees.push(Auth.getPayload().sub);
      this.setState({ attendees });
      resolve(this.setState({ timeSlots }));
    })
      .then(() => {
        axios({
          method: 'PUT',
          url: `/api/events/${this.props.match.params.id}`,
          data: this.state.event,
          headers: { Authorization: `Bearer ${Auth.getToken()}`}
        })
          .catch(err => console.log(err));
      });
  }

  handleSubmit = () => {
    new Promise(resolve => {
      const finalTimes = this.state.finalTimes;
      resolve(this.setState({ ...this.state.event, finalTimes } ));
    })
      .then(() => {
        axios({
          method: 'PUT',
          url: `/api/events/${this.props.match.params.id}`,
          data: this.state,
          headers: { Authorization: `Bearer ${Auth.getToken()}`}
        })
          .then(res => this.setState({ event: res.data }))
          .catch(err => console.log(err));
      });
  }

  checkUserAttending = () => {
    if(!Auth.getPayload()) return false;
    const currentUser = Auth.getPayload().sub;
    if(this.state.event.attendees.includes(currentUser)) return true;
  }

  checkUserIsInvitee = () => {
    if(!Auth.getPayload()) return false;
    const currentUser = Auth.getPayload().sub;
    const invitees = this.state.event.invitees;
    let isInvitee;
    invitees.forEach(invitee => {
      if(invitee._id === currentUser) {
        isInvitee = true;
      }
    });
    return isInvitee;
  }

  handleDeclineInvitation = () => {
    new Promise(resolve => {
      const currentUser = Auth.getPayload().sub;
      let invitees = this.state.event.invitees.slice();
      invitees = invitees.filter(invitee => {
        return invitee._id !== currentUser;
      });
      resolve(this.setState({ ...this.state.event, invitees }));
    })
      .then(() => {
        axios({
          method: 'PUT',
          url: `/api/events/${this.props.match.params.id}`,
          data: this.state,
          headers: { Authorization: `Bearer ${Auth.getToken()}`}
        })
          .then(() => this.props.history.push(`/users/${Auth.getPayload().sub}`))
          .catch(err => console.log(err));
      });
  }

  columnCounter = () => {
    if(this.state.event.finalTimes.length > 0) {
      if(this.state.event.finalEventDates.length > 1) return true;
    } else{
      if(this.state.event.eventDates.length > 1) return true;
    }
  }

  handleDelete = () => {
    axios({
      method: 'DELETE',
      url: `/api/events/${this.props.match.params.id}`,
      headers: { Authorization: `Bearer ${Auth.getToken()}`}
    })
      .then(() => this.props.history.push('/events'));
  }

  render(){
    if(!this.state.event) return <h2 className="title">Loading...</h2>;
    return(
      <div>
        <h2 className="title is-2 font-is-light">{this.state.event.name}</h2>
        <hr/>
        <div className="columns is-multiline is-mobile">
          <div className="column is-two-fifths-mobile">
            <figure className="image is-138x138">
              <img src={this.state.event.image}/>
            </figure>
          </div>
          <div className="column is-three-fifths-mobile">
            <p className="font-is-light"><strong>Address: </strong>{this.state.event.address}</p>
            <p className="font-is-light"><strong>Description: </strong>{this.state.event.description}</p>
          </div>
          {this.checkUserIsOrganizer() && <Link to={`/events/${this.state.event._id}/edit`} className="button">Edit Event</Link>}
          {this.checkUserIsOrganizer() && <button className="button" onClick={this.handleDelete}>Delete Event</button>}
          {this.checkUserIsInvitee() && !this.checkUserIsOrganizer() && Auth.isAuthenticated() && <button className="button" onClick={this.handleDeclineInvitation}>Decline Invitation</button>}
        </div>

        {!this.state.event.finalTimesChecker && <div className="columns is-mobile is-multiline">

          {this.state.event.eventDates.map((date, i) =>
            <div key={i} className={`column dateColumn${this.columnCounter() ? ' is-half-mobile' : ' is-full-mobile'}`}>
              <div className="columns is-multiline">
                <div className="column is-full"><h6 className="title is-6">{date}</h6></div>
                {this.state.event.timeSlots.map((timeSlot, i)=>
                  this.filterStartTime(date, i) &&
                  <div className="timeSlotDiv column is-one-third-desktop is-full-mobile is-full-tablet" key={i}>
                    {this.isVoted(timeSlot._id) && <div><img className="checkIcon" src="../../assets/images/checklogo.png"/></div>}
                    <strong>Time: </strong>
                    <p>{timeSlot.startTime} - {timeSlot.endTime}</p>
                    <p><strong>Votes:</strong> {timeSlot.votes.length}</p>
                    {!this.checkUserAttending() && <button className={`button${this.isVoted(timeSlot._id) ? ' selected' : ''}`} onClick={() => this.handleVote(timeSlot._id)} >{this.isVoted(timeSlot._id) ? 'Selected' : 'Vote'}</button>}
                    {this.checkUserIsOrganizer() && <button className={`button${this.isPicked(timeSlot.date) ? ' selected' : ''}`} onClick={() => this.handlePickDate(timeSlot.date)}>{this.isPicked(timeSlot.date) ? 'Selected' : 'Pick Date'}</button>}
                  </div>
                )}

              </div>
            </div>
          )}
        </div>}
        <div className="buttonDiv">
          {!this.state.event.finalTimesChecker && this.state.finalTimes.length > 0 && <button className="button" onClick={this.handleSubmit}>Confirm Times</button>}
          {!this.checkUserAttending() && <button className="button" onClick={this.handleVoteSubmit}>Submit Votes</button>}
        </div>
        {this.state.event.finalTimesChecker && <h2 className="title is-2">Selected Times</h2>}
        {this.state.event.finalTimesChecker && <div className="columns is-full is-mobile is-multiline">
          {this.state.event.finalEventDates.map((date, i) =>
            <div key={i} className={`column dateColumn${this.columnCounter() ? ' is-half-mobile' : ' is-full-mobile'}`}>
              <div className="columns is-multiline">
                <div className="column is-full">
                  <h6 className="title is-6">{date}</h6>
                </div>
                {this.state.event.finalTimes.map((time, i)=>
                  this.filterStartTime(date, i) &&
                  <div className="timeSlotDiv column is-one-third-desktop is-full-mobile is-full-tablet" key={i}>
                    <p><strong>Time: </strong> {moment(time).format('HH:mm')} - {moment(time).add(this.state.event.length, 'minutes').format('HH:mm')}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>}

        <h3 className="title is-3">Location</h3>
        <GoogleMap location={this.state.event.location} />
      </div>
    );
  }
}

export default EventsShow;
