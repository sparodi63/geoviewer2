const printConfigUrl = GV.utils.getUrlParam('print_config_url');

fetch(printConfigUrl)
  .then(response => response.json())
  .then(data => {
    loadConfig(data);
  });

function loadConfig(data) {
  let config = {
    application: {
      name: 'print-gv2',
      mapOptions: data.mapOptions,
    },
    baseLayers: [
      {
        type: data.baseLayers[0].type,
        visible: true,
      },
    ],
    maps: [
      {
        id: 0,
        name: 'print',
        layers: data.layers,
      },
    ],
  };
  console.log(config);
  GV.init(config);
}
