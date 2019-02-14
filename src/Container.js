import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {InfoWindow,Map, Marker, GoogleApiWrapper} from 'google-maps-react';
// import Map from './Map';

export class MapContainer extends React.Component {

  static propTypes = {
    universities: PropTypes.array.isRequired,
    showinguniversities: PropTypes.array.isRequired,
    clickedUniName: PropTypes.string.isRequired,
    clickedUniFull: PropTypes.array.isRequired,
    query: PropTypes.string.isRequired,
    showDetails: PropTypes.func.isRequired,
    clearClicked: PropTypes.func.isRequired,
    wiki: PropTypes.array.isRequired,
    windowVisible: PropTypes.bool.isRequired,
    infoWinPosition: PropTypes.object.isRequired,
  }

  state ={
    clickedunifull: '',//the clicked marker that will bounce
    activeMarker: {},
    // showingInfoWindow:true,
  }


  updateClickedMarker = (props,marker)=>{//upadtes the clicked marker
    this.setState({//updates the state so that InfoWindow will be attached to this marker
    activeMarker: marker,
    })
    console.log('InfoWindow Position is:'+this.props.infoWinPosition);
    console.log('Is windowvisibel?'+this.props.windowVisible);
    console.log(this.props.clickedUniName);
    // this.showInfoWindow();//shows the InfoWindow
  }

  //when map is clicked InfoWindow will be hidden and clearClicked() from App.js will be executed - there will be no clicked marker
  onMapClicked = ()=>{
    // this.hideInfoWindow();
    this.props.clearClicked();
  }

  //hides InfoWindow
  hideInfoWindow=()=>{
    this.setState({
    showingInfoWindow: false
    });
  }

  //makes InfoWindow visible
  showInfoWindow=()=>{
    this.setState({
    showingInfoWindow: true
    });
  }

  render() {
    console.log('InfoWindow Position is:'+this.props.infoWinPosition);
    console.log('InfoWindow Position is:'+this.props.infoWinPosition.lng);
    console.log('Is windowvisibel?'+this.props.windowVisible);
    console.log(this.props.clickedUniName);
    console.log(this.props.clickedUniFull[0]);
    // console.log(this.props.clickedUniFull[0].address);

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

    const style={
      width:'100vw',
      height:'100vh'
    }

    if (!this.props.loaded) {
      return <div>Loading...</div>
    }
    return (
      <div style={style}>
        <Map
        google={this.props.google}
        zoom={13}
        initialCenter={{
            lat: 51.109961,
            lng: 17.032725
        }}
        onClick={()=>{this.onMapClicked();}}
        >
        {shownuniversities.map((university) => (
          <Marker
          key={university.id}
          position={university.location}
          animation={null}
          title={university.name}
          onClick={(props,marker,e)=>{this.props.showDetails(marker.title);this.updateClickedMarker(props,marker);}}
          >
          <InfoWindow visible={true}>
          <div>hellow</div>
          </InfoWindow>
          </Marker>
          ))
        }
        {this.props.clickedUniName!==''&&
          <Marker
          key={this.props.clickedUniFull[0].id}
          position={this.props.infoWinPosition}
          animation={window.google.maps.Animation.BOUNCE}
          title={this.props.clickedUniFull[0].name}
          onClick={(props,marker)=>{this.props.showDetails(marker.title);this.updateClickedMarker(props,marker);}}
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
        </InfoWindow
        >
        </Map>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyC-BPDy9KeSAkg3Qr8fSI1InA8iIR_0zZs'
})(MapContainer)
