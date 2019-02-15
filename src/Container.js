import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {InfoWindow,Map, Marker, GoogleApiWrapper} from 'google-maps-react';
// import Map from './Map';

export class MapContainer extends Component {

  static propTypes = {
    universities: PropTypes.array.isRequired,
    showinguniversities: PropTypes.array.isRequired,
    clickedUniName: PropTypes.string.isRequired,
    clickedUniFull: PropTypes.string.isRequired,
    query: PropTypes.string.isRequired,
    showDetails: PropTypes.func.isRequired,
    clearClicked: PropTypes.func.isRequired,
    wiki: PropTypes.array.isRequired,
    windowVisible: PropTypes.bool.isRequired,
    infoWinPosition: PropTypes.object.isRequired,
  }

  render() {

    const { universities } = this.props;
    const { showinguniversities} = this.props;
    let { query} =this.props;

    //determines which universities will get none bouncing markers, bouncing market is stored in this.state.clickedunifull
    let shownuniversities//list of universities that will have none bouncing markers
    if (showinguniversities.length<1&&query.length<1){//no query in the search field, all universities markers should be displayed
      if (this.props.clickedUniName===''){//if not marker clicked
        shownuniversities=universities//all universities
      }else{
        shownuniversities=universities.filter(university => university.name !== this.props.clickedUniName)//all universities except the clicked one
      }
    } else {//there is a query in the search field
      if (this.props.clickedUniName===''){
        shownuniversities=showinguniversities//all filtered universities
      }else{
        shownuniversities=showinguniversities.filter(university => university.name !== this.props.clickedUniName)//all filtered universities except the clicked one
      }
    }

    let bounds = new this.props.google.maps.LatLngBounds();
    for (var i=0; i<universities.length; i++){
      bounds.extend(universities[i].location);
    }

    const style={
      width:'100vw',
      height:'100vh',
      margin: '30px 0 0 0'
    }

    if (!this.props.loaded) {
      return <div>Loading...</div>
    }
    return (
      <div style={style}>
        <Map
        google={this.props.google}
        zoom={14}
        initialCenter={{
            lat:51.109950,
            lng: 17.032691
        }}
        onClick={()=>{this.props.clearClicked();}}
        >
        {shownuniversities.map((university) => (
          <Marker
          key={university.id}
          position={university.location}
          animation={null}
          title={university.name}
          onClick={(props,marker,e)=>{this.props.showDetails(marker.title)}}
          />))
        }
        {this.props.clickedUniName!==''&&
          <Marker
          key={this.props.clickedUniFull[0].id}
          position={this.props.infoWinPosition}
          animation={window.google.maps.Animation.BOUNCE}
          title={this.props.clickedUniFull[0].name}
          onClick={(props,marker)=>{this.props.showDetails(marker.title)}}
          />}
          <InfoWindow
          position={this.props.infoWinPosition}
          visible={this.props.windowVisible}
          onClose={this.props.clearClicked}>
            <div>
              <h3><strong>{this.props.clickedUniName}</strong></h3>
              <p>{this.props.clickedUniFull}</p>
              <p><strong>Summary from Wikipedia: </strong>{this.props.wiki}</p>
            </div>
        </InfoWindow>
        </Map>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyC-BPDy9KeSAkg3Qr8fSI1InA8iIR_0zZs'
})(MapContainer)
