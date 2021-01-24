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
  //...-----

  //---------------------------------------https://github.com/geoman-io/leaflet-geoman------
  /*
  map.pm.addControls({
    position: "topleft",
    drawCircle: true,
  });
  map.pm.disableDraw();
*/
  //-----------bt guardar
  /*
   var save = {
    name: "save",
    title: "save",
    className: "#save",
    onClick: save,
  };

  map.pm.Toolbar.createCustomControl(save);

 const saveMarker = (data) => {
    axios
      .post(`http://localhost:3002/save`, {
        data: data,
      })
      .then((response) => {
        console.log(response);
      });
  };
  map.on("pm:create", (dataGeo) => {
    console.log(dataGeo);

    if (dataGeo.shape == "Marker") {
      //const dataGeoS = JSON.stringify(dataGeo);
      saveMarker(dataGeo);
    }
  });
*/
  ///------------------------------------------------------------------------------------------

  var featureGroup = L.featureGroup().addTo(map);
  var drawControl = new L.Control.Draw({
    edit: {
      featureGroup: featureGroup,
    },
  }).addTo(map);

  map.on("draw:created", function (e) {
    // Each time a feaute is created, it's added to the over arching feature group
    featureGroup.addLayer(e.layer);
  });

  // on click, clear all layers
  document.getElementById("delete").onclick = function (e) {
    featureGroup.clearLayers();
  };

  document.getElementById("export").onclick = function (e) {
    // Extract GeoJson from featureGroup
    var datajson = featureGroup.toGeoJSON();

    // Stringify the GeoJson
    var convertedData = JSON.stringify(datajson.features);
    //"text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(datajson));

    console.log(datajson.features);

    //----
    var ajax = new XMLHttpRequest();
    ajax.open("POST", "http://localhost:3000/save", true);
    ajax.setRequestHeader("Content-type", "application/json");
    ajax.send(convertedData);
    ajax.onreadystatechange = function () {
      // Caso o state seja 4 e o http.status for 200, é porque a requisiçõe deu certo.
      if (ajax.readyState == 4 && ajax.status == 200) {
        var data = ajax.responseText;

        // Retorno do Ajax
        console.log(data);
      }
    };

    //---

    /*// Create export
    document
      .getElementById("export")
      .setAttribute("href", "data:" + convertedData);
    document.getElementById("export").setAttribute("download", "data.geojson");*/
    /*
    var xhr = new XMLHttpRequest();
    var url = "http://localhost:3001/save";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.data);
        console.log(json);
      }
    };
    xhr.send(convertedData);
*/
  };
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
