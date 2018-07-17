import React from 'react';

const PendingRequests = ({ event, acceptRequest, declineRequest }) => {
  return (
    <div>
      {event.joinRequests.length > 0 && <h3 className="title is-3">Pending Requests</h3>}
      <div className="requestTable columns is-multiline is-mobile">
        {event.joinRequests.map(request =>
          <div className="column is-full" key={request._id}>
            <p>{request.username}</p>
            <div className="requestButtonContainer">
              <button onClick={() => acceptRequest(request._id)} className="button">Accept</button>
              <button onClick={() => declineRequest(request._id)} className="button">Decline</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingRequests;
