import React from 'react';
import axios from 'axios';
// import {Link} from 'react-router-dom';
// import Auth from '../../lib/Auth';

class EventsShow extends React.Component{

  constructor(){
    super();
    this.state = {};
  }

  componentDidMount(){
    axios.get(`/api/events/${this.props.match.params.id}`)
      .then(res => this.setState({event: res.data}))
      .then(() => console.log(this.state))
      .catch(err => this.setState({error: err.message}));
  }

  //checks the date of the column with the date of the timeSlot
  filterStartTime = (date, i) =>{
    if(date === this.state.event.timeSlots[i].date) return true;
  };



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
          {this.state.event.eventDates.map(date =>
            <div key={date} className="column is-one-third-mobile dateColumn">
              <h6 className="title is-6">{date}</h6>
              {this.state.event.timeSlots.map((timeSlot, i)=>
                this.filterStartTime(date, i) && <div key={timeSlot.date}>{timeSlot.startTime}</div>
              )}
            </div>
          )}
        </div>


      </div>
    );
  }
}

export default EventsShow;
