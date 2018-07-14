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
        {this.state.user && <h1 className="title is-1">{`${this.state.user.username}'s events`}</h1>}
        <div className="columns">
          <div className="column is-half">
            <h2 className="title is-2">Your events</h2>
            <div className="eventTable">
              <div className="columns is-multiline is-mobile">
                <div className="column is-full eventTableHeader">
                  <h6 className="title is-6 emptyTableItem"></h6>
                  <h6 className="title is-6">The Event</h6>
                  <h6 className="title is-6 is-hidden-mobile">Location</h6>
                </div>
                <div className="column is-full eventTableContent">
                  {this.state.user && this.state.user.myEvents.map(event =>
                    <div key={event.id}>
                      <Link to={`/events/${event.id}`}>
                        <div className="columns is-mobile">
                          <div className="column is-half-mobile is-one-third-desktop is-one-third-tablet">
                            <figure className="image is-90x90">
                              <img src={event.image}/>
                            </figure>
                          </div>
                          <div className="column is-one-half-mobile is-one-third-tablet is-one-third-desktop">
                            <p><strong>Name: </strong>{event.name}</p>
                            {event.description && <p><strong>Description: </strong>{event.description}</p>}
                          </div>
                          <div className="column is-hidden-mobile is-one-third-tablet is-one-third-desktop">
                            <p className="font-is-dark"><strong>Address: </strong>{event.address}</p>
                            {event.finalTimes && event.finalTimes.length > 0 && <p><strong>Event Time{event.finalTimes.length > 1 && <span>s</span>}: </strong><br/>{event.finalTimes && event.finalTimes.map(finalTime =>
                              <span key={finalTime}>{moment(finalTime).format('ddd, MMM Do, HH:mm')}<br/></span>
                            )}</p>}
                          </div>
                        </div>
                      </Link>
                      <Link to={`/events/${event.id}/edit`} className="button">Edit Event</Link>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
          <div className="column is-half">
            <h2 className="title is-2">Invited to</h2>
            <div className="eventTable">
              <div className="columns is-multiline is-mobile">
                <div className="column is-full eventTableHeader">
                  <h6 className="title is-6 emptyTableItem"></h6>
                  <h6 className="title is-6">The Event</h6>
                  <h6 className="title is-6 is-hidden-mobile">Location</h6>
                </div>
                <div className="column is-full eventTableContent">
                  {this.state.user && this.state.user.invitedToEvents.map(event =>
                    <Link key={event.id} to={`/events/${event.id}`}>
                      <div className="columns is-mobile">
                        <div className="column is-half-mobile is-one-third-desktop is-one-third-tablet">
                          <figure className="image is-90x90">
                            <img src={event.image}/>
                          </figure>
                        </div>
                        <div className="column is-half-mobile is-one-third-tablet is-one-third-desktop">
                          <p><strong>Name: </strong>{event.name}</p>
                          {event.description && <p><strong>Description: </strong>{event.description}</p>}
                        </div>
                        <div className="column is-hidden-mobile is-one-third-tablet is-one-third-desktop">
                          <p className="font-is-dark"><strong>Address: </strong>{event.address}</p>
                          {event.finalTimes && event.finalTimes.length > 0 && <p><strong>Event Time{event.finalTimes.length > 1 && <span>s</span>}: </strong><br/>{event.finalTimes && event.finalTimes.map(finalTime =>
                            <span key={finalTime}>{moment(finalTime).format('ddd, MMM Do, HH:mm')}<br/></span>
                          )}</p>}
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UsersShow;
