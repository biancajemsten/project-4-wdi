import React from 'react';

const PendingRequests = ({ event }) => {
  return (
    <div>
      <h3 className="title is-3">Pending Requests</h3>
      {event.joinRequests.map(request =>
        <div key={request._id}>
          <p>{request.username}</p>
          <button onClick={() => this.acceptRequest(request._id)} className="button">Accept</button>
          <button onClick={() => this.declineRequest(request._id)} className="button">Decline</button>
        </div>
      )}
    </div>
  );
};

export default PendingRequests;
