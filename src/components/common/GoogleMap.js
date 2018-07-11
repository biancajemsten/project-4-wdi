/* global google */
import React from 'react';

class GoogleMap extends React.Component {

  componentDidMount() {
    this.map = new google.maps.Map(this.mapCanvas, {
      center: this.props.location,
      zoom: 14
    });

    this.marker = new google.maps.Marker({
      map: this.map,
      position: this.props.location,
      animation: google.maps.Animation.DROP
    });
  }

  render() {
    return(
      <div className="google-map" ref={element => this.mapCanvas = element} />
    );
  }
}

export default GoogleMap;
