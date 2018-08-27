import React, { Component } from 'react';
import fetchJsonp from 'fetch-jsonp';

import * as dataLocations from './locations.json';
import FilterLocations from './FilterLocations';
import InfoWindow from './InfoWindow';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: dataLocations,
      map: '',
      markers: [],
      infoWindowIsOpen: false,
      currentMarker: {},
      infoContent: ''
    };
  }

  componentDidMount() {
    window.initMap = this.initMap;
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBzyfjDfHwXK3fudwozn1eoCPSgSSv4KrA&callback=initMap"');
    this.fourSquareLoad();
  } 

  /*renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBzyfjDfHwXK3fudwozn1eoCPSgSSv4KrA&callback=initMap")
    window.initMap = this.initMap
  }*/

  initMap = () => {
    let controlledThis = this;
    const { locations, markers } = this.state;

    /* Define the map */
    let map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: new window.google.maps.LatLng(66.02219,12.63376)
    });

    /* Keep state in sync */
    this.setState({
      map
    });

    /* Create a marker for each location in the locations.json file */
    for (let i = 0; i < locations.length; i++) {
      /* Define the values of the properties */
      var obj = locations[i];
      
      /* Create the marker itself */
      var marker = new window.google.maps.Marker({
        map: map,
        position: new window.google.maps.LatLng(obj.latitude, obj.longtitude),
        title: obj.title,
        animation: obj.window.google.maps.Animation.DROP,
        id: obj.id
      });

      /* Get those markers into the state */
      markers.push(marker);

      /* Open infoWindow when click on the marker */
      marker.addListener('click', function () {
        controlledThis.openInfoWindow(marker);
      });
    }

    /* Add the listener to close the infoWindow
     * when click on the map
     */
     map.addListener('click', function () {
      controlledThis.closeInfoWindow();
     });
  }

  openInfoWindow = (marker) => {
    this.setState({
      infoWindowIsOpen: true,
      currentMarker: marker
    });

    this.fourSquareLoad();
  }

  closeInfoWindow = () => {
    this.setState({
      infoWindowIsOpen: false,
      currentMarker: {}
    });
  }
  // Fetch the data from FourSquare to populate the map.
  fourSquareLoad = () => {
    fetch ("https://api.foursquare.com/v2/venues/search?ll=41.008240,28.978359&intent=browse&radius=30000&query=food&client_id=B1JDVT55UR5DEOP3XTVYBBYIHOPZUA3L0VPHYMPSOW4LDTHM&client_secret=5PVPA25PYYLPLAHIM0I4YQJVPDRKBJYVMMG4SAYCFHJIYC21&v=20180323")
        .then( (response) => response.json())
        .then( (response) => {
          // Error checking to see if received data is in correct format
          //console.log(response.response.venues)
          return response
        })
        // Pass the received data in the correct format to be stored in the empty
        // venues array in state.
        .then( (data) => {
          this.setState({
            venues: data.response.venues,
            markers: data.response.venues
          })
        })
        // Error checking, log the contents of the venues array, to compare.
        .then( () => {
          //console.log(this.state.venues)
        })
        // If unable to obtain data from Foursquare, alert the user.
        .catch ( (error) => {
          alert("There has been a problem trying to get the locations data from Foursquare......please try again");
        })
  }

  render() {
    return (
      <div className="App">
        <FilterLocations
          locationsList={this.state.locations}
          markers={this.state.markers}
          openInfoWindow={this.openInfoWindow}
        />

        {
          this.state.infoWindowIsOpen &&
          <InfoWindow
            currentMarker={this.state.currentMarker}
            infoContent={this.state.infoContent}
          />
        }
        
        <div id="map" role="application"></div>
      </div>
    );
  }
}



function loadScript(url) {
  let index = window.document.getElementsByTagName('script')[0]
  let script = window.document.createElement('script')

  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)

  script.onerror = function () {
    document.write('Load error')
  };
}


export default App;
