import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';


const EventList = ({user, events}) => {
  return(
    <div className="eventTable">
      <div className="columns is-multiline is-mobile">
        <div className="column is-full eventTableHeader">
          <h6 className="title is-6 emptyTableItem"></h6>
          <h6 className="title is-6">The Event</h6>
          <h6 className="title is-6 is-hidden-mobile">Location</h6>
        </div>
        <div className="column is-full eventTableContent">
          {user && events.map(event =>
            <Link key={event.id} to={`/events/${event.id}`}>
              <div className="columns is-mobile">
                <div className="column is-half-mobile is-one-third-desktop is-one-third-tablet">
                  <figure className="image is-90x90">
                    <img src={event.image}/>
                  </figure>
                </div>
                <div className="column is-one-half-mobile is-one-third-tablet is-one-third-desktop">
                  <p><strong className="is-underlined">{event.name}</strong></p>
                  {event.description && <p>{event.description}</p>}
                </div>
                <div className="column is-hidden-mobile is-one-third-tablet is-one-third-desktop">
                  <p className="font-is-dark">{event.address}</p>
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
  );
};

export default EventList;
