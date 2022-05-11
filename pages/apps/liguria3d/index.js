GV.init({
  debug: true,
  idMap: GV.utils.getUrlParam('id'),
  application: {
    name: 'liguria3d-gv2',
    mapOptions: {
      type: 'openlayers',
      ol3d: true,
      enable3d: true,
      click: 'info',
      restrictedExtent: '830036,5402959,1123018,5597635',
    },
    // callback: function() {
    //   console.log('CALLBACK!!!');
    //   fetch(`/geoservices/REST/difesa_suolo/domanda/${codice}`)
    //     .then(response => response.json())
    //     .then(data => {
    //       console.log(data)
    //     })
    //     .catch(error => {
    //       console.error('Error:', error);
    //       alert(error);
    //     });
    // },    
    layout: {
      legend: {
        options: { 
          show: true,
          showAddMap: true,
          showInfoMap: true,
          showLayersTransparency: true,
          showBaseLayerSwitcher: true,
          addMapConfig: {
            panels: {
              kml: {
                label: 'KML/GPX/JSON',
              },
            },
          },
        },
      },
      tools: [
        {
          name: 'gv-geocoder',
          position: 'topleft',
        },
        {
          name: 'gv-help3D-button',
          position: 'topleft',
          options: {
            showOnStart: true
          }
        },
      ],
    },
  },
  baseLayers: [
    {
      type: 'ESRI_IMAGERY',
      visible: true,
    },
    {
      type: 'RL_ORTOFOTO_2019',
    },
    {
      type: 'RL_ORTOFOTO_2013',
    },
    {
      type: 'RL_ORTOFOTO_2010',
    },
    {
      type: 'RL_ORTOFOTO_2007',
    },
    {
      type: 'RL_ORTOFOTO_2000',
    },
    {
      type: 'RL_CARTE_BASE',
    },
    {
      type: 'RL_CARTE_BASE_NC25',
    },
    {
      type: 'BLANK',
    },
  ],
  maps: [],
});
