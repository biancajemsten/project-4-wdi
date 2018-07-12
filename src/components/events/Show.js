import React from 'react';
import axios from 'axios';
import moment from 'moment';
// import {Link} from 'react-router-dom';
import Auth from '../../lib/Auth';
import GoogleMap from '../common/GoogleMap';

class EventsShow extends React.Component{

  constructor(){
    super();
    this.state = {
      selectedTimeSlots: [],
      finalSelectedDates: []
    };

    this.setEndTime = this.setEndTime.bind(this);
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

  setEndTime = (startTime) => {
    const inMilliseconds = parseInt(moment.duration(startTime, 'HH:mm').asMilliseconds()) + this.state.event.length*60000;
    const tempTime = moment.duration(inMilliseconds);
    return tempTime.hours() +':'+ tempTime.minutes();
  }

  selectButton = (e, buttonType, stateProp) => {
    let btn;
    const targetId = buttonType === 'Vote' ? e.target.id : e.target.dataset.id;
    stateProp = this.state[stateProp];
    stateProp.push(targetId);
    this.setState({ [stateProp]: stateProp });
    e.target.textContent = 'Selected';
    if(buttonType === 'Vote') {
      btn = document.querySelectorAll(`[id='${targetId}']`);
    } else {
      btn = document.querySelectorAll(`[data-id='${targetId}']`);
    }
    btn[0].classList.add('unVote');
  }

  unselectButton = (e, buttonType, stateProp) => {
    let btn;
    const targetId = buttonType === 'Vote' ? e.target.id : e.target.dataset.id;
    stateProp = this.state[stateProp];
    stateProp.splice(stateProp.indexOf(targetId), 1);
    this.setState({ [stateProp]: stateProp });
    e.target.textContent = buttonType;
    if(buttonType === 'Vote') {
      btn = document.querySelectorAll(`[id='${targetId}']`);
    } else {
      btn = document.querySelectorAll(`[data-id='${targetId}']`);
    }
    btn[0].classList.remove('unVote');
  }

  toggleButton = (e, buttonType, stateProp) => {
    const targetId = buttonType === 'Vote' ? e.target.id : e.target.dataset.id;
    e.preventDefault();
    this.state[stateProp].includes(targetId) ? this.unselectButton(e, buttonType, stateProp) : this.selectButton(e, buttonType, stateProp);
  }

  handleSubmit = () =>{
    new Promise((resolve)=>{
      const timeSlots = this.state.event.timeSlots.map(timeSlot =>{
        this.state.selectedTimeSlots.forEach(id => {
          if(timeSlot._id === id) timeSlot.votes.push(Auth.getPayload().sub);
        });
      });
      const attendees = this.state.event.attendees;
      attendees.push(Auth.getPayload().sub);
      this.setState({attendees});
      resolve(this.setState({timeSlots}));
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
        </div>

        <div className="columns is-full is-mobile">

          {this.state.event.eventDates.map((date, i) =>
            <div key={i} className="column is-one-third-mobile dateColumn">
              <h6 className="title is-6">{date}</h6>
              {this.state.event.timeSlots.map((timeSlot, i)=>
                this.filterStartTime(date, i) &&
                <div className="timeSlotDiv" key={i}>
                  <strong>Time: </strong>
                  <p>{timeSlot.startTime} - {this.setEndTime(timeSlot.startTime)}</p>
                  <p><strong>Votes:</strong> {timeSlot.votes.length}</p>
                  {!this.checkUserAttending() && <button className="button" id={timeSlot._id} onClick={(e) => this.toggleButton(e, 'Vote', 'selectedTimeSlots')}>Vote</button>}
                  {this.checkUserIsOrganizer() && <button className="button" data-id={timeSlot._id} onClick={(e) => this.toggleButton(e, 'Pick Date', 'finalSelectedDates')}>Pick Date</button>}
                </div>
              )}
            </div>
          )}
          {!this.checkUserAttending() && <button className="button" onClick={this.handleSubmit}>Submit Votes</button>}
        </div>

        <h3 className="title is-3">Location</h3>
        <GoogleMap location={this.state.event.location} />
      </div>
    );
  }
}

export default EventsShow;
