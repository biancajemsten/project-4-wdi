import React from 'react';
import axios from 'axios';
// import { Link } from 'react-router-dom';
// import _ from 'lodash';

class EventsIndex extends React.Component {

  state = {}

  componentDidMount() {
    axios.get('/api/events')
      .then(res => {
        this.setState({ events: res.data });
        console.log(this.state);
      });
  }

  render() {
    if(!this.state.events) return <h2 className="title is-2">Loading...</h2>;
    return(
      <section>
        <table className="table is-striped is-bordered is-hoverable is-fullwidth">

          <thead>
            <tr>
              <th>
                Event
              </th>
              <th>
                Location
              </th>
              <th>
                Organizer
              </th>
            </tr>
          </thead>

          <tbody>
            {this.state.events.map(event =>
              <tr key={event._id}>
                <td>{event.name}</td>
                <td>{event.address}</td>
                <td>{event.organizer[0].username}</td>
              </tr>
            )}
          </tbody>

        </table>
      </section>
    );
  }
}

export default EventsIndex;
