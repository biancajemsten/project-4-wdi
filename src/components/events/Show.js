import React from 'react';
import axios from 'axios';
import moment from 'moment';
import {Link} from 'react-router-dom';
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
    if(Auth.getPayload().sub === this.state.event.organizer) return true;
  }
  //checks the date of the column with the date of the timeSlot
  filterStartTime = (date, i) =>{
    if(date === this.state.event.timeSlots[i].date) return true;
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

  handlePickDate = (slotId) => {
    let finalTimes;
    const index = this.state.finalTimes.indexOf(slotId);

    if(index === -1) {
      finalTimes = this.state.finalTimes.concat(slotId);
    } else {
      finalTimes = this.state.finalTimes.slice();
      finalTimes.splice(index, 1);
    }

    this.setState({ finalTimes });
  }

  isPicked = (slotId) => {
    return this.state.finalTimes.includes(slotId);
  }

  handleVoteSubmit = () =>{
    new Promise( resolve =>{
      const timeSlots = this.state.event.timeSlots.map(timeSlot =>{
        this.state.selectedTimeSlots.forEach(id => {
          if(timeSlot._id === id) timeSlot.votes.push(Auth.getPayload().sub);
        });
      });
      const attendees = this.state.event.attendees;
      attendees.push(Auth.getPayload().sub);
      this.setState({attendees});
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
      console.log('finalTimes ===>', finalTimes);
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
          .then(() => console.log('put axios returned state===>', this.state) )
          .catch(err => console.log(err));
      });
  }

  checkUserAttending = () =>{
    const currentUser = Auth.getPayload().sub;
    if(this.state.event.attendees.includes(currentUser)) return true;
  }


  render(){
    if(!this.state.event) return <h2 className="title">Loading...</h2>;
    return(
      <div>
        <h2 className="title is-2 font-is-light">{this.state.event.name}</h2>
        <div className="columns is-multiline is-mobile">
          <div className="column is-one-third-mobile">
            <figure className="image is-128x128">
              <img src={this.state.event.image}/>
            </figure>
          </div>
          <div className="column is-two-thirds-mobile">
            <p className="font-is-light"><strong>Address: </strong>{this.state.event.address}</p>
            <p className="font-is-light"><strong>Description: </strong>{this.state.event.description}</p>
            {this.state.event.finalTime && <p><strong>Event Time: </strong>{this.state.event.finalTime}</p>}
          </div>
          <Link to={`/events/${this.state.event._id}/edit`} className="button">Edit Event</Link>
        </div>

        {!this.state.event.finalTimesChecker && <div className="columns is-full is-mobile">

          {this.state.event.eventDates.map((date, i) =>
            <div key={i} className="column is-one-third-mobile dateColumn">
              <h6 className="title is-6">{moment(date).format('ddd, MMM Do')}</h6>
              {this.state.event.timeSlots.map((timeSlot, i)=>
                this.filterStartTime(date, i) &&
                <div className="timeSlotDiv" key={i}>
                  <strong>Time: </strong>
                  <p>{timeSlot.startTime} - {timeSlot.endTime}</p>
                  <p><strong>Votes:</strong> {timeSlot.votes.length}</p>
                  {!this.checkUserAttending() && <button className="button" onClick={() => this.handleVote(timeSlot._id)}>{this.isVoted(timeSlot._id) ? 'Selected' : 'Vote'}</button>}
                  {this.checkUserIsOrganizer() && <button className="button" onClick={() => this.handlePickDate(timeSlot._id)}>{this.isPicked(timeSlot._id) ? 'Selected' : 'Pick Date'}</button>}
                </div>
              )}
            </div>
          )}
          {!this.checkUserAttending() && <button className="button" onClick={this.handleVoteSubmit}>Submit Votes</button>}
          {this.state.finalTimes.length > 0 && <button className="button" onClick={this.handleSubmit}>Confirm Times</button>}
        </div>}

        <h3 className="title is-3">Location</h3>
        <GoogleMap location={this.state.event.location} />
      </div>
    );
  }
}

export default EventsShow;
