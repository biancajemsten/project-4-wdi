/* global google */
import React from 'react';

class PlacesAutocomplete extends React.Component {

  componentDidMount() {
    this.autocomplete = new google.maps.places.Autocomplete(this.input);
    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      this.props.handleChange({ target: { name: 'location', value: place.geometry.location.toJSON() } });
      this.props.handleChange({ target: { name: 'address', value: place.formatted_address } });
    });
  }

  render() {
    return(
      <input ref={element => this.input = element} name="address" className={this.props.className} value={this.props.value} onChange={this.props.handleChange} />
    );
  }
}

export default PlacesAutocomplete;
