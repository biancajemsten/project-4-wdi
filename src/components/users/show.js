import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';

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
        <div>
          {this.state.user && <h1 className="title is-1">{`${this.state.user.username}'s events`}</h1>}
          <div className="columns is-multiline is-mobile">
            <h2 className="title is-2">Your events</h2>
            {this.state.user && this.state.user.myEvents.map(event =>
              <div key={event.id}>
                <Link to={`/events/${event.id}`}>
                  <div className="column is-one-third-mobile">
                    <figure className="image is-128x128">
                      <img src={event.image}/>
                    </figure>
                  </div>
                  <div className="column is-two-thirds-mobile">
                    <p className="font-is-light"><strong>Address: </strong>{event.address}</p>
                    <p className="font-is-light"><strong>Description: </strong>{event.description}</p>
                    <p><strong>Event Time{event.finalTimes.length > 1 && <span>s</span>}: </strong>
                      {event.finalTimes && event.finalTimes.map(finalTime =>
                        <span key={finalTime}>{moment(finalTime).format('ddd, MMM Do, HH:mm')}<br/></span>
                      )}
                    </p>
                  </div>
                </Link>
                <Link to={`/events/${event.id}/edit`} className="button">Edit Event</Link>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="columns is-multiline is-mobile">
            <h2 className="title is-2">Invited to</h2>
            {this.state.user && this.state.user.invitedToEvents.map(event =>
              <div key={event.id}>
                <Link to={`/events/${event.id}`}>
                  <div className="column is-one-third-mobile">
                    <figure className="image is-128x128">
                      <img src={event.image}/>
                    </figure>
                  </div>
                  <div className="column is-two-thirds-mobile">
                    <p className="font-is-light"><strong>Address: </strong>{event.address}</p>
                    <p className="font-is-light"><strong>Description: </strong>{event.description}</p>
                    {event.finalTimes && <p><strong>Event Time: </strong>{event.finalTimes}</p>}
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default UsersShow;
