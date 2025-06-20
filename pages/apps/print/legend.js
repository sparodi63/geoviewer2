const printConfigUrl = GV.utils.getUrlParam('print_config_url');

fetch(printConfigUrl)
  .then(response => response.json())
  .then(data => {
    printLegend(data);
  });

function printLegend(data) {
  console.log('PRINT CONFIG', data);
  const legendDiv = document.getElementById('gv-print-legend');
  const html = `<span style="font-size:22px; font-weight: 800;">LEGENDA</span><br/><br />`;
  legendDiv.innerHTML += html;
  for (const map of data.maps) {
    const label = map.name;
    const html = `<span id="layer_span" style="font-size:22px">${label}</span><br><br>`;
    legendDiv.innerHTML += html;

    for (const layer of map.layers) {
      if (layer.multiClasse) {
        const label = layer.legend.label;
        const url = `${layer.wmsParams.url}LAYER=${layer.name}&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&`;
        const html = `<span id="layer_span">${label}</span><br><br>
                      <span id="rule_span"><img src="${url}"></span><br><br>
        `;
        legendDiv.innerHTML += html;
      } else {
        const label = layer.legend.label;
        const url = layer.legend.icon;
        const html = `<span id="layer_span"><img src="${url}" width="20" height="20"></span><span id="layer_span">${label}</span><br><br>`;
        legendDiv.innerHTML += html;
      }
    }
  }
  console.log('LEGENDA CARICATA: inserisco elemento gv-map-loaded');
  const mapLoaded = document.createElement('div');
  mapLoaded.id = 'gv-map-loaded';
  document.getElementById('gv-container').appendChild(mapLoaded);
}
