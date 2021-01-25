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
    ),
    wmsAves = L.tileLayer.wms(
      "http://localhost:8080/geoserver/SIG21/wms?SIG21%3ABDG_dir_aves_2013_2018&service=WMS&?",
      {
        layers: "SIG21:BDG_dir_aves_2013_2018",
        format: "image/png",
        transparent: true,
      }
    ),
    wfsbiogeneticas = L.tileLayer.wms(
      "http://si.icnf.pt/wfs/reservas_biogeneticas",
      {
        format: "image/png",
        transparent: true,
      }
    ),
    wmslines = L.tileLayer.wms(
      "http://localhost:8080/geoserver/SIG21/wms?SIG21%3Aoccurrences_line&service=WMS&?",
      {
        layers: "SIG21:occurrences_line",
        format: "image/png",
        transparent: true,
      }
    );
  //http://localhost:8080/geoserver/SIG21/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SIG21%3AEcopistas&maxFeatures=50&outputFormat=application%2Fjson
  var map = L.map("mapid", {
    center: [details.latitude, details.longitude],
    zoom: 10,
    layers: [Light],
  });

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
  function save() {
    console.log("works");
  }

  document.getElementById("save").onclick = function (e) {
    // Extract GeoJson from featureGroup
    console.log(featureGroup);
    var datajson = featureGroup.toGeoJSON();
    console.log(datajson);
    let datageoPto = [];
    let datageoPl = [];
    let datageoLs = [];
    var datafe = datajson.features.length;
    for (i = 0; i < datafe; i++) {
      const point = "Point";
      const Polygon = "Polygon";
      const LineString = "LineString";
      console.log("entr");
      if (datajson.features[i].geometry.type.localeCompare(point) == 0) {
        datageoPto.push([datajson.features[i].geometry]);
        console.log(datajson.features[i].geometry);
      }
      if (datajson.features[i].geometry.type.localeCompare(Polygon) == 0) {
        datageoPl.push(datajson.features[i].geometry);
        console.log(datajson.features[i].geometry);
      }
      if (datajson.features[i].geometry.type.localeCompare(LineString) == 0) {
        datageoLs.push(datajson.features[i].geometry);
        console.log(datajson.features[i].geometry);
      }
    }

    console.log(datageoPto);
    console.log(datageoPl);
    console.log(datageoLs);
    if (!datageoPto.length == 0) {
      // Stringify the GeoJson
      var convertedData = JSON.stringify(datageoPto);
      //"text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(datajson));

      //----
      var ajax = new XMLHttpRequest();
      ajax.open("POST", "http://localhost:3000/savePt", true);
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
    }
    if (!datageoPl.length == 0) {
      // Stringify the GeoJson
      var convertedData = JSON.stringify(datageoPl);
      //"text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(datajson));

      //----
      var ajax = new XMLHttpRequest();
      ajax.open("POST", "http://localhost:3000/savePl", true);
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
    }
    if (!datageoLs.length == 0) {
      // Stringify the GeoJson
      var convertedData = JSON.stringify(datageoLs);
      //"text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(datajson));

      //----
      var ajax = new XMLHttpRequest();
      ajax.open("POST", "http://localhost:3000/saveLs", true);
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
    }

    //---
  };
  /*// Create export
    document
      .getElementById("export")
      .setAttribute("href", "data:" + convertedData);
    document.getElementById("export").setAttribute("download", "data.geojson");
  };*/
  var baseLayers = {
    Light: Light,
    Streets: streets,
    Dark: dark,
    Satelite: sat,
  };

  var overlayMaps = {
    RedeViaria: wmsredeviaria,
    Aves: wmsAves,
    Linhas: wmslines,
    wfsbiogeneticas: wfsbiogeneticas,
  };

  L.control.layers(baseLayers, overlayMaps).addTo(map);
}
