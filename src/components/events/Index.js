import React from 'react';
import axios from 'axios';
// import { Link } from 'react-router-dom';
import _ from 'lodash';

class EventsIndex extends React.Component {

  state = {
    sort: 'name|asc'
  }

  componentDidMount() {
    axios.get('/api/events')
      .then(res => this.setState({ events: res.data }));
  }

  handleSearch = (e) => {
    this.setState({ search: e.target.value });
  }

  filteredEvents = (events) => {
    const re = new RegExp(this.state.search, 'i');
    return events.filter(event => {
      return re.test(event.name) || re.test(event.organizer.username);
    });
  }

  handleSort = (e) => {
    this.setState({ sort: e.target.value });
  }

  sortedEvents = (events) => {
    const [ prop, dir ] = this.state.sort.split('|');
    return _.orderBy(events, prop, dir);
  }

  sortedAndFilteredEvents = () => {
    const filtered = this.filteredEvents(this.state.events);
    return this.sortedEvents(filtered);
  }

  render() {
    if(!this.state.events) return <h2 className="title is-2 font-is-light">Loading...</h2>;
    return(
      <section>
        <div className="filters">
          <input className="input" placeholder="Search events" onChange={this.handleSearch} />
        </div>

        <div className="control">
          <div className="select is-fullwidth">
            <select onChange={this.handleSort}>
              <option value="name|asc">Events A-Z</option>
              <option value="name|desc">Events Z-A</option>
            </select>
          </div>
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
            {this.sortedAndFilteredEvents(this.state.events).map(event =>
              <tr key={event._id}>
                <td>{event.name}</td>
                <td>{event.address}</td>
                <td>{event.organizer.username}</td>
              </tr>
            )}
          </tbody>
        </table>
        <p><strong>Lorem ipsum dolor sit amet</strong>, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
      </section>
    );
  }
}

export default EventsIndex;
