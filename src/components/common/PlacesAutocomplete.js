/* global google */
import React from 'react';

class PlacesAutocomplete extends React.Component {

  componentDidMount() {
    console.log(this.props);
    this.autocomplete = new google.maps.places.Autocomplete(this.input);
    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      this.props.handleChange({ target: { name: 'location', value: place.geometry.location.toJSON() } });
      this.props.handleChange({ target: { name: 'address', value: place.formatted_address } });
    });
  }

  render() {
    return(
      <input ref={element => this.input = element} className={this.props.className}/>
    );
  }
}

export default PlacesAutocomplete;
