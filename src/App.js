import React, { Component } from 'react';
import MapContainer from './Container';
import ListUniversities from './ListUniversities';
import escapeRegExp from 'escape-string-regexp';
import fetchJsonp from 'fetch-jsonp';

class App extends Component {
  state = {
    universities: [
      {
         "id": "unienv",
         "name": "Wrocław University of Environmental and Life Sciences",
         "address": "ul. C.K. Norwida 25,50-375 Wroclaw, Poland",
         "location":{
           lat:51.111618,
           lng:17.064321
         }
       },
       {
         "id": "uniscien",
         "name": "Wrocław University of Science and Technology",
         "address": "Wybrzeże Wyspiańskiego 27, 50-370 Wrocław, Poland",
         "location":{
           lat:51.108015,
           lng:17.061667
         }
       },
       {
         "id": "uniecon",
         "name": "Wrocław University of Economics",
         "address": "ul. Komandorska 118-120, 53-345 Wrocław, Poland",
         "location":{
           lat:51.091261,
           lng:17.024777
         }
       },
       {
         "id": "musacad",
         "name": "Karol Lipiński Academy of Music",
         "address": "pl. Jana Pawła II nr 2, 50-043 Wrocław, Poland",
         "location":{
           lat:51.111354,
           lng:17.021337
         }
       },
       {
         "id": "artacad",
         "name": "Eugeniusz Geppert Academy of Fine Arts",
         "address": "ul. Plac Polski 3/4, 50-156 Wrocław, Poland",
         "location":{
           lat:51.111532,
           lng:17.043541
         }
       },
       {
         "id": "unimed",
         "name": "Wrocław Medical University",
         "address": "Wybrzeże L. Pasteura 1, 50-367 Wrocław",
         "location":{
           lat:51.108981,
           lng:17.068926
         },
       },
       {
          "id": "uniwro",
          "name": "University of Wrocław",
          "address": "Plac Uniwersytecki 1, 50-137 Wrocław",
          "location":{
             lat:51.114241,
             lng:17.034463
          }
       }
    ],
    data: [//data fetched from wiki
    ],
    clickeduniname: '',//stores name of the clicked item on the list or the marker
    clickedunifull: '',//stores info about the university
    clickedWiki: [//stores wiki info about the clicked item on the list
    ],
    showingUniversities: [//stores info about the filtered items
    ],
    query: '',
    isListHidden: true,//for universities list
    isInfoWinVisible:false,
    infoWinPosition:{"lat":0,"lng":0},
  }

  //---function handling wiki getData

  componentDidMount(){//wiki data are fetched and passed to updateData method
    this.state.universities.map((location,index)=>{
      return fetchJsonp(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${location.name}&format=json&callback=wikiCallback`)
      .then(response => response.json()).then((responseJson) => {
        let newData = [...this.state.data,[responseJson,responseJson[2][0],responseJson[3][0]]]
        this.updateData(newData)
      }).catch(error =>
      console.error(error)
      )
    })
  }

  updateData = (newData) => {//updates 'data' state with the data fetched from wiki
    this.setState({
      data:newData,
    });
  }
  //---function for handling the filter
  updateUniversitiesList = (query)=>{

    //this will close open infowindow and stops marker bouncing
    this.clearClicked();

    this.setState({
      query: query.trim()
    })
    const match = new RegExp(escapeRegExp(query), 'i')
    this.setState((state)=>({
      showingUniversities: state.universities.filter((university) => match.test(university.name))

    }))
  }

  //--->functions for handling the click of the university name on the liste or of the marker

  handleClick = (e)=> {

    const clickedUniName = e;//clicked university name

    if (clickedUniName!==''){
      let getData = this.state.data.filter((single)=>clickedUniName === single[0][0]).map(item2=>//matches the clicke item with the data from wiki
        {if (item2.length===0)
        return 'No Contents Have Been Found Try to Search Manually'
        else if (item2[1] !=='')
          return item2[1]
        else
          return 'No Contents Have Been Found Try to Search Manually'
        })

      let clickedUniFull = this.state.universities.filter((university)=> university.name === clickedUniName)

      let infoWinLat = clickedUniFull[0].location.lat
      let infoWinLng = clickedUniFull[0].location.lng

      let infoWinPosition = {"lat":infoWinLat,"lng":infoWinLng}

      let clickedAddress = clickedUniFull[0].address


      this.setState({
        infoWinPosition: infoWinPosition,
        clickeduniname: clickedUniName,
        clickedunifull: clickedAddress,
        isInfoWinVisible: true,
        clickedWiki:getData,
      })
    }
  }

  toggleList = () => {//shows ListUniversities when hamburger button clicked

    //this will close open infowindow and stops marker bouncing
    this.clearClicked();

    //this will reset the list of the univerities displayed
    this.setState({
      showingUniversities: this.state.universities,
      query: '',
      isListHidden: !this.state.isListHidden
    });
  }

  clearClicked = ()=>{//this will hide InfoWindow and stop marker bouncing
    this.setState({
      clickeduniname: '',
      isInfoWinVisible: false,
    });
  }

  render() {
    return (
          <div>
          <p className="navigation"><button onClick={()=>{this.toggleList()}}>&#9776;</button>Universities in Wrocław</p>
          {!this.state.isListHidden && <ListUniversities
            universities={this.state.universities}
            showinguniversities={this.state.showingUniversities}
            updateUniversities={this.updateUniversitiesList}
            query={this.state.query}
            showDetails={this.handleClick}
          />}
            <MapContainer
            universities={this.state.universities}
            showinguniversities={this.state.showingUniversities}
            query={this.state.query}
            showDetails={this.handleClick}
            clickedUniName ={this.state.clickeduniname}
            clickedUniFull={this.state.clickedunifull}
            clearClicked={this.clearClicked}
            wiki ={this.state.clickedWiki}
            windowVisible={this.state.isInfoWinVisible}
            infoWinPosition = {this.state.infoWinPosition}
            />
          </div>
    )
  }
}

export default App;
