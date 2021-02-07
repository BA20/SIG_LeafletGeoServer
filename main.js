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

  var wind = L.OWM.wind({
    opacity: 0.5,
    appId: "aa22d0c3622ec8a3ae5c75d016d52ab9",
  });

  var temp = L.OWM.temperature({
    opacity: 0.5,
    appId: "aa22d0c3622ec8a3ae5c75d016d52ab9",
  });
  var raincls = L.OWM.rainClassic({
    opacity: 0.5,
    appId: "aa22d0c3622ec8a3ae5c75d016d52ab9",
  });

  var mbAttr =
      "Bernardo Alves 18476 & Rodrigo Sá 21704 " +
      '© <a href="http://www.ipvc.pt">IPVC</a>',
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
    wmsEcopistas = L.tileLayer.wms(
      "http://localhost:8080/geoserver/SIG21/wms?SIG21%3AEcopistas&service=WMS&?",
      {
        layers: "SIG21:Ecopistas",
        format: "image/png",
        transparent: true,
      }
    ),
    wmsAreaArdida = L.tileLayer.wms(
      "http://localhost:8080/geoserver/SIG21/wms?SIG21%3Aardida_2018&service=WMS&?",
      {
        layers: "SIG21:ardida_2018",
        format: "image/png",
        transparent: true,
      }
    ),
    wmscaop = L.tileLayer.wms(
      "http://localhost:8080/geoserver/SIG21/wms?SIG21%3Acont_aad_caop2015&service=WMS&?",
      {
        layers: "SIG21:cont_aad_caop2015",
        format: "image/png",
        transparent: true,
      }
    ),
    wmsEscolas = L.tileLayer.wms(
      "http://localhost:8080/geoserver/SIG21/wms?SIG21%3Aescolas_viana&service=WMS&?",
      {
        layers: "SIG21:escolas_viana",
        format: "image/png",
        transparent: true,
      }
    ),
    wmsFarmacias = L.tileLayer.wms(
      "http://localhost:8080/geoserver/SIG21/wms?SIG21%3Afarmacias_viana&service=WMS&?",
      {
        layers: "SIG21:farmacias_viana",
        format: "image/png",
        transparent: true,
      }
    ),
    wmsifn = L.tileLayer.wms(
      "http://localhost:8080/geoserver/SIG21/wms?SIG21%3Aifn_2015&service=WMS&?",
      {
        layers: "SIG21:ifn_2015",
        format: "image/png",
        transparent: true,
      }
    ),
    wmsPtosagua = L.tileLayer.wms(
      "http://localhost:8080/geoserver/SIG21/wms?SIG21%3Apontos_agua&service=WMS&?",
      {
        layers: "SIG21:pontos_agua",
        format: "image/png",
        transparent: true,
      }
    ),
    wmsCaca = L.tileLayer.wms(
      "http://localhost:8080/geoserver/SIG21/wms?SIG21%3Azonas_caca&service=WMS&?",
      {
        layers: "SIG21:zonas_caca",
        format: "image/png",
        transparent: true,
      }
    ),
    wmsAreaPro = L.tileLayer.wms(
      "http://localhost:8080/geoserver/SIG21/wms?SIG21%3AWMSrnap&service=WMS&?",
      {
        layers: "SIG21:WMSrnap",
        format: "image/png",
        transparent: true,
      }
    ),
    wmsEdificios = L.tileLayer.wms(
      "http://localhost:8080/geoserver/SIG21/wms?SIG21%3Acarta_itineraria_edificios_carta_itineraria_edificios&service=WMS&?",
      {
        layers: "SIG21:carta_itineraria_edificios_carta_itineraria_edificios",
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
    wmslines = L.tileLayer.wms("http://localhost:8080/geoserver/SIG21/wms?", {
      layers: "SIG21:linhas",
      format: "image/png",
      transparent: true,
      version: "1.1.0",
      attribution: "myattribution",
    }),
    wmspoints = L.tileLayer.wms("http://localhost:8080/geoserver/SIG21/wms?", {
      layers: "SIG21:point",
      format: "image/png",
      transparent: true,
      version: "1.1.0",
      attribution: "myattribution",
    }),
    wmspoly = L.tileLayer.wms("http://localhost:8080/geoserver/SIG21/wms?", {
      layers: "SIG21:poly",
      format: "image/png",
      transparent: true,
      version: "1.1.0",
      attribution: "myattribution",
    });

  var map = L.map("mapid", {
    center: [details.latitude, details.longitude],
    zoom: 10,
    layers: [Light],
  });

  var featureGroup = L.featureGroup().addTo(map);
  var drawControl = new L.Control.Draw({
    edit: {
      featureGroup: featureGroup,
    },
  }).addTo(map);

  map.on("draw:created", function (e) {
    featureGroup.addLayer(e.layer);
  });
  map.on("draw:deletestop", function (e) {
    var datajson = featureGroup.toGeoJSON();
    console.log(datajson);
    axios
      .post(`http://localhost:3000/saveGeojson`, {
        json: datajson,
      })
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  document.getElementById("addLayer").onclick = function (e) {
    axios
      .get("http://localhost:3000/getlayer")
      .then(function (response) {
        console.log("layer");
        var dataJson = JSON.parse(response.data.rows[0].concat);

        geojsonlayer = L.geoJson(dataJson, {
          onEachFeature: function (feature, layer) {
            featureGroup.addLayer(layer);
          },
        }).addTo(featureGroup);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  document.getElementById("delete").onclick = function (e) {
    featureGroup.clearLayers();
  };
  document.getElementById("save").onclick = function (e) {
    var datajson = featureGroup.toGeoJSON();
    console.log("asdasdas");
    console.log(datajson);
    let datageoPto = [];
    let datageoPl = [];
    let datageoLs = [];
    var datafe = datajson.features.length;

    axios
      .post(`http://localhost:3000/saveGeojson`, {
        json: datajson,
      })
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    for (i = 0; i < datafe; i++) {
      const point = "Point";
      const Polygon = "Polygon";
      const LineString = "LineString";

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
      var convertedData = JSON.stringify(datageoPto);

      var ajax = new XMLHttpRequest();
      ajax.open("POST", "http://localhost:3000/savePt", true);
      ajax.setRequestHeader("Content-type", "application/json");
      ajax.send(convertedData);
      ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
          var data = ajax.responseText;

          console.log(data);
        }
      };
    }
    if (!datageoPl.length == 0) {
      var convertedData = JSON.stringify(datageoPl);

      var ajax = new XMLHttpRequest();
      ajax.open("POST", "http://localhost:3000/savePl", true);
      ajax.setRequestHeader("Content-type", "application/json");
      ajax.send(convertedData);
      ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
          var data = ajax.responseText;

          console.log(data);
        }
      };
    }
    if (!datageoLs.length == 0) {
      var convertedData = JSON.stringify(datageoLs);

      var ajax = new XMLHttpRequest();
      ajax.open("POST", "http://localhost:3000/saveLs", true);
      ajax.setRequestHeader("Content-type", "application/json");
      ajax.send(convertedData);
      ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
          var data = ajax.responseText;

          console.log(data);
        }
      };
    }
    featureGroup.clearLayers();
  };

  function deletePid(id) {
    axios
      .post(`http://localhost:3000/deletePto`, {
        id: id,
      })
      .then((response) => {
        console.log(response);
        loadData();
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log(id);
  }
  function deleteLSid(id) {
    axios
      .post(`http://localhost:3000/deleteLs`, {
        id: id,
      })
      .then((response) => {
        console.log(response);
        loadData();
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  function deletePLid(id) {
    axios
      .post(`http://localhost:3000/deletePoly`, {
        id: id,
      })
      .then((response) => {
        console.log(response);
        loadData();
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  axios
    .get("http://localhost:3000/getpontos")
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  axios
    .get("http://localhost:3000/getls")
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  axios
    .get("http://localhost:3000/getpl")
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  var baseLayers = {
    Light: Light,
    Streets: streets,
    Dark: dark,
    Satelite: sat,
  };

  var overlayMaps = {
    RedeViaria: wmsredeviaria,
    Ecopistas: wmsEcopistas,
    Área_Ardida: wmsAreaArdida,
    Caop2015: wmscaop,
    EscolasViana: wmsEscolas,
    FarmaciasViana: wmsFarmacias,
    ifn: wmsifn,
    PontosAgua: wmsPtosagua,
    Caca: wmsCaca,
    Aves: wmsAves,
    WMS_AreasProtegidas: wmsAreaPro,
    WFS_CartaItinerária_Edifícios: wmsEdificios,
    Chuva: raincls,
    Vento: wind,
    Temperatura: temp,
    Linhas: wmslines,
    Pontos: wmspoints,
    Polígonos: wmspoly,
  };

  L.control.layers(baseLayers, overlayMaps).addTo(map);
}
