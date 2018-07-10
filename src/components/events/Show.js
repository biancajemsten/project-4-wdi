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


  render(){
    if(!this.state.event) return <h2 className="title">Loading...</h2>;
    return(
      <div>
        <h2 className="title is-2">{this.state.event.name}</h2>
        <div className="columns is-multiline is-mobile">
          <div className="column is-one-third-mobile">
            <figure className="image is-128x128">
              <img src={this.state.event.image}/>
            </figure>
          </div>
          <div className="column is-two-thirds-mobile">
            <p><strong>Address: </strong>{this.state.event.address}</p>
            <p><strong>Description: </strong>{this.state.event.description}</p>
            {this.state.event.finalTime && <p><strong>Event Time: </strong>{this.state.event.finalTime}</p>}
          </div>
        </div>
        <div className="columns is-full is-mobile">
          {this.state.event.eventDates.map(date =>
            <div key={date} className="column is-one-third-mobile">
              <div>{date}</div>
            </div>
          )}
        </div>


      </div>
    );
  }
}

export default EventsShow;
