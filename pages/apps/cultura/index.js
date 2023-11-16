fetch(`/geoservices/data/cultura/config.json`)
  .then(response => response.json())
  .then(data => {
    setConfig(data);
  })
  .catch(error => {
    console.error('Error:', error);
    alert(error);
  });

function setConfig(data) {
  GV.globals.CULTURA_CONFIG = data;

  GV.globals.CULTURA_CONFIG.filter = getFilter();
  GV.globals.CULTURA_CONFIG.CURRENT_DOMAIN = getCurrentDomain();
  GV.globals.CULTURA_CONFIG.embed = GV.utils.getUrlParam('TYPE') === 'EMBED' ? true : false;
  GV.globals.CULTURA_CONFIG.flagItinerario = GV.utils.getUrlParam('ITINERARIO') ? true : false;

  // CARICAMENTO ARRAY LUOGHI
  GV.globals.CULTURA_CONFIG.luoghi = [];
  for (const rg of data.raggruppamenti) {
    if (GV.globals.CULTURA_CONFIG.flagItinerario || GV.globals.CULTURA_CONFIG.filter.luogo) {
      GV.globals.CULTURA_CONFIG.luoghi.push(rg.data.features);
    } else {
      const features = rg.data.features.filter(feature => {
        // return true;
        return feature.properties.FLGSOLOITINERARI === 'N';
      });
      // console.log(features);
      GV.globals.CULTURA_CONFIG.luoghi.push(features);
    }
  }
  GV.globals.CULTURA_CONFIG.luoghi = GV.globals.CULTURA_CONFIG.luoghi.flat();

  init(getMapConfig());
}

function getCurrentDomain() {
  let domain = GV.globals.CULTURA_CONFIG.domains[parseInt(GV.utils.getUrlParam('CURRENT_DOMAIN'))];
  if (!domain) domain = 'https://luoghidellacultura.regione.liguria.it/';
  return domain;
}

function getFilter() {
  return {
    raggruppamento: GV.utils.getUrlParam('RAGGRUPPAMENTO')
      ? parseInt(GV.utils.getUrlParam('RAGGRUPPAMENTO'))
      : 0,
    categoria: GV.utils.getUrlParam('CATEGORIA') ? parseInt(GV.utils.getUrlParam('CATEGORIA')) : 0,
    provincia: GV.utils.getUrlParam('PROVINCIA') ? parseInt(GV.utils.getUrlParam('PROVINCIA')) : 0,
    comune: GV.utils.getUrlParam('COMUNE') ? parseInt(GV.utils.getUrlParam('COMUNE')) : 0,
    itinerario: GV.utils.getUrlParam('ITINERARIO')
      ? parseInt(GV.utils.getUrlParam('ITINERARIO'))
      : 0,
    luogo: GV.utils.getUrlParam('LUOGO') ? GV.utils.getUrlParam('LUOGO') : 0,
  };
}

function onFeatureSelect(feature) {
  const div = document.getElementById('gv-cultura-info');
  if (div) div.remove();
  GV.mount({
    elId: 'gv-cultura-info',
    toggleEl: true,
    template: `<gv-cultura-info :properties="properties" ></gv-cultura-info>`,
    data: {
      properties: feature.properties,
    },
  });
  GV.app.map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 18);
}

function getMapConfig() {
  if (GV.globals.CULTURA_CONFIG.flagItinerario) {
    GV.globals.CULTURA_LAYERS = getLayersItinerario();
  } else {
    if (GV.globals.CULTURA_CONFIG.filter.luogo) {
      GV.globals.CULTURA_LAYERS = getLayersLuogo();
      GV.globals.CULTURA_CONFIG.embed = true;
    } else {
      GV.globals.CULTURA_LAYERS = getLayersRaggruppamenti();
    }
  }

  const maps = [
    {
      id: 0,
      name: 'Cultura',
      layers: GV.globals.CULTURA_LAYERS,
    },
  ];
  return maps;
}

function zoomExtentsMap() {
  // const zoomInside = !GV.globals.CULTURA_CONFIG.flagItinerario;
  var bounds = L.latLngBounds([]);
  GV.globals.CULTURA_LAYERS.forEach(fl => {
    const layer = GV.app.map.getLayerByName(fl.name);
    const layerBounds = layer.getBounds();
    bounds.extend(layerBounds);
  });
  bounds = bounds.pad(0.2);
  GV.app.map.fitBounds(bounds);
  GV.app.map.setRestrictedExtent(
    GV.app.map.getExtentAsString(bounds),
    GV.app.map.getBoundsZoom(bounds, false)
  );
}

function getLayersLuogo() {
  const oid = GV.globals.CULTURA_CONFIG.filter.luogo;
  const luoghi = GV.globals.CULTURA_CONFIG.luoghi.filter(luogo => {
    if (luogo.properties.OID === oid) return true;
  });
  if (!luoghi[0]) {
    return;
  }
  const idRaggruppamento = luoghi[0].properties.ID_RAGGRUPPAMENTO;
  return [
    {
      type: 'JSON',
      dataType: 'json',
      cluster: {
        options: {
          iconCreateFunction: function(cluster) {
            return new L.DivIcon({
              html: '<div><span>' + cluster.getChildCount() + '</span></div>',
              className: `marker-cluster marker-cluster-${idRaggruppamento}`,
              iconSize: new L.Point(40, 40),
            });
          },
          maxClusterRadius: 1,
          spiderfyOnMaxZoom: true,
          zoomToBoundsOnClick: true,
        },
      },
      name: `${idRaggruppamento}`,
      visible: true,
      geomSubType: 'POINT',
      data: luoghi,
      legend: {
        label: `${idRaggruppamento}`,
        icon: `/geoservices/apps/viewer/static/img/cultura/legend/${idRaggruppamento}.png`,
      },
      tooltip: '{NOME}',
      onFeatureSelect: onFeatureSelect,
      pointToLayer: function(feature, latlng) {
        const icon = L.icon({
          iconUrl: `/geoservices/apps/viewer/static/img/cultura/legend/${idRaggruppamento}.png`,
          iconSize: [32, 32],
        });
        const alt = feature.properties.NOME;
        return L.marker(latlng, {
          icon: icon,
          alt: alt,
        });
      },
    },
  ];
}

function getLuoghiItineario(idItinerario) {
  const luoghi = GV.globals.CULTURA_CONFIG.luoghi.filter(luogo => {
    const itinerari = luogo.properties.itinerari;
    let found = false;
    if (itinerari.length > 0) {
      for (const itinerario of itinerari) {
        if (itinerario == idItinerario) {
          found = true;
        }
      }
    }
    return found;
  });
  return luoghi;
}

function getLayersItinerario() {
  const idItinerario = GV.globals.CULTURA_CONFIG.filter.itinerario;
  const luoghi = getLuoghiItineario(idItinerario);
  GV.globals.CULTURA_CONFIG.luoghi = luoghi;
  const label = GV.globals.CULTURA_CONFIG.itinerari.filter(it => {
    return it.id == idItinerario;
  })[0].itinerario;
  // console.log(label);

  return [
    {
      type: 'JSON',
      dataType: 'json',
      cluster: {
        options: {
          iconCreateFunction: function(cluster) {
            return new L.DivIcon({
              html: '<div><span>' + cluster.getChildCount() + '</span></div>',
              className: `marker-cluster marker-cluster-${idItinerario}`,
              iconSize: new L.Point(40, 40),
            });
          },
          maxClusterRadius: 20,
          spiderfyOnMaxZoom: true,
          zoomToBoundsOnClick: true,
        },
      },
      name: `${idItinerario}`,
      visible: true,
      geomSubType: 'POINT',
      data: luoghi,
      legend: {
        label: label,
        icon: `/geoservices/apps/viewer/static/img/cultura/legend/${idItinerario}.png`,
      },
      tooltip: '{NOME}',
      onFeatureSelect: onFeatureSelect,
      pointToLayer: function(feature, latlng) {
        const icon = L.icon({
          iconUrl: `/geoservices/apps/viewer/static/img/cultura/legend/${idItinerario}.png`,
          iconSize: [32, 32],
        });
        const alt = feature.properties.NOME;
        return L.marker(latlng, {
          icon: icon,
          alt: alt,
        });
      },
    },
  ];
}

function getLayersRaggruppamenti() {
  return GV.globals.CULTURA_CONFIG.raggruppamenti.map(rg => {
    return {
      type: 'JSON',
      dataType: 'json',
      cluster: {
        options: {
          iconCreateFunction: function(cluster) {
            return new L.DivIcon({
              html: '<div><span>' + cluster.getChildCount() + '</span></div>',
              className: `marker-cluster marker-cluster-${rg.id}`,
              iconSize: new L.Point(40, 40),
            });
          },
          maxClusterRadius: 80,
          spiderfyOnMaxZoom: true,
          zoomToBoundsOnClick: true,
        },
      },
      name: `${rg.id}`,
      visible: true,
      geomSubType: 'POINT',
      data: rg.data,
      legend: {
        label: rg.raggruppamento,
        icon: `/geoservices/apps/viewer/static/img/cultura/legend/${rg.id}.png`,
      },
      tooltip: '{NOME}',
      onFeatureSelect: onFeatureSelect,
      pointToLayer: function(feature, latlng) {
        const icon = L.icon({
          iconUrl: `/geoservices/apps/viewer/static/img/cultura/legend/${rg.id}.png`,
          iconSize: [32, 32],
        });
        const alt = feature.properties.NOME;
        return L.marker(latlng, {
          icon: icon,
          alt: alt,
        });
      },
    };
  });
}

function init(maps) {
  let tools = [
    {
      name: 'gv-cultura-legend',
      position: 'topright',
      options: {
        maps: maps,
        hideLayerVisibilityCheck: true,
        version: 2,
      },
    },
  ];
  const screenWidth = document.documentElement.clientWidth;
  const maxScreenWidth = 420;
  const largeScreen = screenWidth > maxScreenWidth;
  console.log(largeScreen);
  if (!GV.globals.CULTURA_CONFIG.embed && largeScreen) {
    const banner = `<h1><div id="titolo"> <div id="loghi_sx"><a href="${GV.globals.CULTURA_CONFIG.CURRENT_DOMAIN}" title="Luoghi della Cultura"><img alt="Luoghi della Cultura" src="/geoservices/apps/viewer/static/img/cultura/logo2.png"></a></div> <div id="loghi_dx"></div> </div></h1>`;
    tools.push({
      name: 'gv-inner-html',
      position: 'bottomright',
      options: {
        props: [
          {
            html: banner,
          },
        ],
      },
    });
  }
  GV.init({
    debug: true,
    application: {
      mapOptions: {
        // zoomSnap: 0.5,
        // initialExtent: '830036,5402959,1123018,5597635',
        // restrictedExtent: '830036,5402959,1123018,5597635',
        type: 'leaflet',
        maxZoom: 19,
      },
      callback: function() {
        new L.Control.Zoom({ position: 'bottomleft' }).addTo(GV.app.map.map);
        if (GV.globals.CULTURA_CONFIG.filter.luogo) {
          const oid = GV.globals.CULTURA_CONFIG.filter.luogo;
          const features = GV.globals.CULTURA_CONFIG.luoghi.filter(luogo => {
            if (luogo.properties.OID === oid) return true;
          });
          if (features[0]) {
            onFeatureSelect(features[0]);
          }
        }
        zoomExtentsMap();
      },
      layout: {
        title: ' ',
        tools: tools,
      },
    },
    baseLayers: [
      {
        type: 'OSM',
        visible: true,
      },
    ],
    maps: [],
  });
}
