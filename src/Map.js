import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Marker from './Marker';

class Map extends React.Component {
  // static propTypes = {
  //   google: PropTypes.object.isRequired,
  //   zoom: PropTypes.number.isRequired,
  //   initialCenter: PropTypes.object.isRequired,
  // }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
  }

  componentDidMount(){
    this.loadMap();
  }

  loadMap() {
    if (this.props && this.props.google) {
      // google is available
      const {google} = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      let zoom = 14;
      let lat = 51.109961;
      let lng = 17.032725;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
      })
      this.map = new maps.Map(node, mapConfig);
    }
  }

  renderChildren(){
    const {children}=this.props;

    if (!children) return;

    return React.Children.map(children, c => {
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.currentLocation
      });
    })
  }

  render() {
    const style ={
      width:'100vw',
      height: '100%',
      position:'absolute'
    }

    return (
      <div ref='map' style={style}>
        Loading map...
        {this.renderChildren()}
      </div>
    )
  }
}

export default Map
