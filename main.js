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
  //localhost:8080/geoserver/SIG21/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIG21%3ABDG_rnap2&maxFeatures=50&outputFormat=application%2Fjson
  function mapwfs() {
    var rootUrl = "http://localhost:8080/geoserver/SIG21/ows?";

    var defaultParameters = {
      service: "WFS",
      version: "1.0.0",
      request: "GetFeature",
      typeName: "SIG21%3ABDG_rnap2",
      maxFeatures: 50,
      outputFormat: "application%2Fjson",
      format_options: "callback: getJson",
    };

    var parameters = L.Util.extend(defaultParameters);

    $.ajax({
      url: rootUrl + L.Util.getParamString(parameters),
      dataType: "jsonp",
      jsonpCallback: "getJson",
      success: handleJson,
    });

    function handleJson(data) {
      L.geoJson(data, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, geojsonMarkerOptions);
          //return L.marker(latlng);
        },
      }).addTo(map);
    }
  }

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
    }),
    wmsredeviaria = L.tileLayer.wms(
      "http://localhost:8080/geoserver/SIG21/wms?SIG21%3Arede_viaria&service=WMS&?",
      {
        layers: "SIG21:rede_viaria",
        format: "image/png",
        transparent: true,
      }
    );

  var map = L.map("mapid", {
    center: [details.latitude, details.longitude],
    zoom: 10,
    layers: [Light],
  });
  map.pm.addControls({
    position: "topleft",
    drawCircle: false,
  });

  var baseLayers = {
    Light: Light,
    Streets: streets,
    Dark: dark,
    Satelite: sat,
  };

  var overlayMaps = {
    WMSRedeViaria: wmsredeviaria,
  };

  L.control.layers(baseLayers, overlayMaps).addTo(map);
}
