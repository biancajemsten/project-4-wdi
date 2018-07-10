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
      .catch(err => this.setState({error: err.message}));
  }

  render(){
    if(!this.state.event) return <h2 className="title">Loading...</h2>;
    return(
      <div className="columns is-multiline">
        <div className="column is-full">
          <figure className="image">
            <img src={this.state.event.image}/>
          </figure>
        </div>
      </div>
    );
  }
}

export default EventsShow; 
