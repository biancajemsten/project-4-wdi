import React from 'react';
import axios from 'axios';
import moment from 'moment';
// import {Link} from 'react-router-dom';
import Auth from '../../lib/Auth';

class EventsShow extends React.Component{

  constructor(){
    super();
    this.state = {
      selectedTimeSlots: []
    };

    this.setEndTime = this.setEndTime.bind(this);
    this.selectTimeSlot = this.selectTimeSlot.bind(this);
  }

  componentDidMount(){
    console.log('did mount');
    axios.get(`/api/events/${this.props.match.params.id}`)
      .then(res => this.setState({event: res.data}))
      .then(() => console.log(this.state))
      .then(() => console.log(this.state.timeSlots))
      .catch(err => this.setState({error: err.message}));
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

  selectTimeSlot = (e) => {
    const selectedTimeSlots = this.state.selectedTimeSlots;
    selectedTimeSlots.push(e.target.id);
    this.setState({selectedTimeSlots});
    e.target.textContent = 'Remove Vote';
    const a = document.getElementById(e.target.id);
    a.classList.add('unVote');
  }

  unselectTimeSlot = (e) => {
    const selected = this.state.selectedTimeSlots;
    console.log('index', selected.indexOf(e.target.id));
    selected.splice(selected.indexOf(e.target.id),1);
    this.setState({selectedTimeSlots: selected});
    e.target.textContent = 'Vote';
    const a = document.getElementById(e.target.id);
    a.classList.remove('unVote');
  }

  toggleButton = (e) => {
    e.preventDefault();
    console.log('before select', this.state.selectedTimeSlots);
    this.state.selectedTimeSlots.includes(e.target.id) ? this.unselectTimeSlot(e) : this.selectTimeSlot(e);
  };

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
                  <button className="button" id={timeSlot._id} onClick={this.toggleButton}>Vote</button>
                </div>
              )}
            </div>
          )}
          <button className="button" onClick={this.handleSubmit}>Submit Votes</button>
        </div>
      </div>
    );
  }
}

export default EventsShow;
