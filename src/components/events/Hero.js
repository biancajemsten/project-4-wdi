import React from 'react';
import Auth from '../../lib/Auth';
import { Link } from 'react-router-dom';

const Hero = ({ event, handleDelete, handleDeclineInvitation, handleJoinRequest }) => {

  const checkUserIsOrganizer = () => {
    return Auth.isAuthenticated() && Auth.getPayload().sub === event.organizer._id;
  };

  const checkUserAttending = () => {
    return Auth.isAuthenticated() && event.attendees.includes(Auth.getPayload().sub);
  };

  const checkUserIsInvitee = () => {
    return Auth.isAuthenticated() && event.invitees.some(invitee => invitee._id === Auth.getPayload().sub);
  };

  const pendingRequestToJoin = () => {
    return event.joinRequests.includes(Auth.getPayload().sub);
  };

  return (
    <section>
      <h2 className="title is-2 font-is-light">{event.name}</h2>
      {!checkUserAttending() && !checkUserIsInvitee() && !pendingRequestToJoin() && !checkUserIsOrganizer() &&
        <button className="button" onClick={handleJoinRequest}>Request to join</button>
      }
      {!checkUserAttending() && !checkUserIsInvitee() && pendingRequestToJoin() &&
        <div className="button">Pending...</div>
      }
      <hr/>
      <div className="columns is-multiline is-mobile">
        <div className="column is-two-fifths">
          <figure className="image is-138x138">
            <img src={event.image}/>
          </figure>
        </div>
        <div className="column is-three-fifths">
          {event.location && <p className="font-is-light"><strong>Address: </strong>{event.address}</p>}
          {event.description && <p className="font-is-light"><strong>Description: </strong>{event.description}</p>}
        </div>
      </div>
      <div className="columns buttonContainer">
        {checkUserIsOrganizer() && <Link to={`/events/${event._id}/edit`} className="button">Edit Event</Link>}
        {checkUserIsOrganizer() && <button className="button deleteEvent" onClick={handleDelete}>Delete Event</button>}
        {checkUserIsInvitee() && !checkUserIsOrganizer() && Auth.isAuthenticated() && !checkUserAttending() &&
          <button className="button" onClick={handleDeclineInvitation}>Decline Invitation</button>
        }
      </div>
    </section>
  );
};

export default Hero;
