import React from 'react';

const PendingRequests = ({ event, acceptRequest, declineRequest }) => {
  return (
    <div>
      <h3 className="title is-3">Pending Requests</h3>
      {event.joinRequests.map(request =>
        <div key={request._id}>
          <p>{request.username}</p>
          <button onClick={() => acceptRequest(request._id)} className="button">Accept</button>
          <button onClick={() => declineRequest(request._id)} className="button">Decline</button>
        </div>
      )}
    </div>
  );
};

export default PendingRequests;
