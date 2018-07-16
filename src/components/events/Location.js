import React from 'react';
import GoogleMap from '../common/GoogleMap';

const Location = ({ event }) => {
  return (
    <div>
      <h3 className="title is-3">Location</h3>
      <GoogleMap location={event.location} />
    </div>
  );
};

export default Location;
