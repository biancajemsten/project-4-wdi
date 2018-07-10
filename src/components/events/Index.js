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

  handleSearch = (e) => {
    this.setState({ search: e.target.value });
  }

  filteredEvents = (events) => {
    const re = new RegExp(this.state.search, 'i');
    return events.filter(event => {
      return re.test(event.name);
    });
  }

  render() {
    if(!this.state.events) return <h2 className="title is-2">Loading...</h2>;
    return(
      <section>
        <div className="filters">
          <input className="input" placeholder="Search events" onChange={this.handleSearch} />
        </div>
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
            {this.filteredEvents(this.state.events).map(event =>
              <tr key={event._id}>
                <td>{event.name}</td>
                <td>{event.address}</td>
                <td>{event.organizer.username}</td>
              </tr>
            )}
          </tbody>

        </table>

      </section>
    );
  }
}

export default EventsIndex;
