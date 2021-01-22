//Confirmar se o Browser suporta a localização
function geoFindMe() {
  if (!navigator.geolocation) {
    console.log("Geolocation is not supported by your browser");
    return;
  }
}

navigator.geolocation.getCurrentPosition(myLocation);
function myLocation(position) {
  var details = position.coords;
  console.log(details);
  var mbAttr =
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    mbUrl =
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=sk.eyJ1IjoiYmpjYTE5OTgiLCJhIjoiY2trOG04dWdpMG0xNDJvbXM0OGNybGE4ZCJ9.dFq-gZy8Lsa7NhClVR8vCg";

  var Light = L.tileLayer(mbUrl, {
      id: "mapbox/light-v9",
      tileSize: 512,
      zoomOffset: -1,
      attribution: mbAttr,
    }),
    streets = L.tileLayer(mbUrl, {
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      attribution: mbAttr,
    }),
    sat = L.tileLayer(mbUrl, {
      id: "mapbox/satellite-v9",
      tileSize: 512,
      zoomOffset: -1,
      attribution: mbAttr,
    }),
    dark = L.tileLayer(mbUrl, {
      id: "mapbox/dark-v10",
      tileSize: 512,
      zoomOffset: -1,
      attribution: mbAttr,
    });

  var map = L.map("mapid", {
    center: [details.latitude, details.longitude],
    zoom: 10,
    layers: [Light],
  });

  var baseLayers = {
    Light: Light,
    Streets: streets,
    Dark: dark,
    Satelite: sat,
  };

  L.control.layers(baseLayers).addTo(map);
}
