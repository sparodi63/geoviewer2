const ospedale = GV.utils.getUrlParam('ospedale');
const provincia = GV.utils.getUrlParam('provincia');
const affollamento = GV.utils.getUrlParam('affollamento');

const env = GV.globals.GENIO_WEB_ENV || 'TEST';

const url =
  env === 'TEST'
    ? `https://pslive-dev.alisa.liguria.it/api/prontosoccorso/all`
    : `https://pslive.alisa.liguria.it/api/prontosoccorso/all`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    setConfig(data);
  })
  .catch(error => {
    console.error('Error:', error);
    alert(error);
  });

function getAffollamentoClass(ind_gda) {
  let class_gda = 'N';
  if (ind_gda && ind_gda > 90) class_gda = 'S';
  if (ind_gda && ind_gda > 60 && ind_gda < 90) class_gda = 'A';
  if (ind_gda && ind_gda < 60) class_gda = 'P';
  return class_gda;
}

function getGeoJson(data) {
  let filter = function(el) {
    return true;
  };

  if (ospedale) {
    filter = function(el) {
      return el.codOsp === ospedale;
    };
  }

  if (provincia) {
    const listaProv = provincia.split(',');
    filter = function(el) {
      return listaProv.includes(el.provincia);
    };
  }

  if (affollamento) {
    const listaIndGda = affollamento.split(',');
    filter = function(el) {
      const ind_gda = el.prontoSoccorsoAffollamento ? el.prontoSoccorsoAffollamento.indGda : null;
      const class_gda = getAffollamentoClass(ind_gda);
      const trovato = class_gda === 'N' || listaIndGda.includes(class_gda);
      return trovato;
    };
  }

  const filtered = data.filter(filter);

  const geojson = filtered.map(el => {
    // console.log(el);
    const ind_gda = el.prontoSoccorsoAffollamento ? el.prontoSoccorsoAffollamento.indGda : null;
    const class_gda = getAffollamentoClass(ind_gda);

    const feature = {
      type: 'Feature',
      id: el.codOsp,
      geometry: {
        type: 'Point',
        coordinates: [el.longitudine, el.latitudine],
      },
      geometry_name: 'GEOMETRY',
      properties: {
        cod_osp: el.codOsp,
        breve_osp: el.breveOsp,
        ind_gda: ind_gda,
        class_gda: class_gda,
        indirizzo: el.indirizzo,
        civico: el.civico,
        cap: el.cap,
        comune: el.comune,
        provincia: el.provincia,
      },
    };

    return feature;
  });

  return geojson;
}

function zoomExtentsMap() {
  // const zoomInside = !GV.globals.CULTURA_CONFIG.flagItinerario;
  var bounds = L.latLngBounds([]);
  const layer = GV.app.map.getLayerByName('ps');
  const layerBounds = layer.getBounds();
  bounds.extend(layerBounds);

  bounds = bounds.pad(0.2);
  GV.app.map.fitBounds(bounds, { maxZoom: 19 });
  const new_bounds = GV.app.map.getBounds();
  // GV.app.map.setRestrictedExtent(
  //   GV.app.map.getExtentAsString(new_bounds),
  //   GV.app.map.getBoundsZoom(new_bounds, false)
  // );
}

function setConfig(data) {
  console.log(data);

  const geojson = getGeoJson(data);

  console.log(geojson);

  const S_ICON = `<svg id="uuid-909fbab5-fd0f-4350-8f1c-0d33df550ab9" xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 81.38 114.57">
    <defs>
        <style>
            .uuid-55dc4e74-01b7-43c0-b13d-3f32a962e1d6{fill:#ff6529;stroke:#3f7172;stroke-width:4.88px;}</style>
    </defs>
    <g id="uuid-3c8323f8-3642-4915-9fb6-a1ccc6de0f40">
        <g id="uuid-373d76cc-62f1-49ec-beb9-b0a5494a76dd">
            <path id="uuid-92a728f6-4120-4540-bae4-a02f97b54c0a"
                class="uuid-55dc4e74-01b7-43c0-b13d-3f32a962e1d6"
                d="m78.19,33.99C74.59,13.28,54.88-.59,34.17,3.01c-4.75.83-9.29,2.54-13.4,5.06C8.64,15.65,2.78,26.91,2.44,41.98c.15,1.54.3,3.89.63,6.2,1.08,5.83,3.26,11.4,6.43,16.42,8.89,15.67,18.69,30.78,28.48,45.9.74,1.46,2.52,2.05,3.99,1.32.58-.29,1.05-.77,1.34-1.36,2.97-4.56,6-9.08,8.82-13.73,7.39-12.15,14.84-24.27,21.95-36.59,4.46-7.95,5.92-17.23,4.11-26.17" />
        </g>
    </g>
  </svg>`;

  const A_ICON = `<svg id="uuid-919c22b0-be60-4db0-b34f-d149c7b51e1a" xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 81.38 114.57">
    <defs>
        <style>
            .uuid-13a3a73a-d037-4366-b9b4-e8433c55dd7d{fill:#fff;}.uuid-bb6c4c88-6868-44ab-aae5-3c8ff4874698{fill:none;stroke:#3f7172;stroke-width:4.88px;}.uuid-393f1710-e427-4f98-8c4d-935d713c6847{fill:#ff6529;}</style>
    </defs>
    <g id="uuid-54371d7b-f841-4a41-beb4-4de4c38b5860">
        <g id="uuid-e6c6e92b-1e57-4a5e-aaee-647422a560a8">
            <path id="uuid-c35b86f1-de7e-4582-b241-10e76df3057c"
                class="uuid-13a3a73a-d037-4366-b9b4-e8433c55dd7d"
                d="m78.19,33.99C74.59,13.28,54.88-.59,34.17,3.01c-4.75.83-9.3,2.54-13.4,5.07C8.64,15.65,2.78,26.91,2.44,41.98c.15,1.54.3,3.89.63,6.2,1.08,5.83,3.26,11.4,6.43,16.42,8.89,15.67,18.69,30.78,28.48,45.9.74,1.46,2.52,2.05,3.99,1.32.58-.29,1.05-.77,1.34-1.36,2.97-4.56,6-9.08,8.82-13.73,7.39-12.15,14.84-24.27,21.95-36.59,4.46-7.95,5.92-17.23,4.11-26.17" />
            <path id="uuid-a9acd93c-0659-4a10-a2c3-e40bb47e876d"
                class="uuid-393f1710-e427-4f98-8c4d-935d713c6847"
                d="m4.43,57.26h73.07l-36.79,54.55L4.43,57.26Z" />
            <path id="uuid-49dfabdd-b461-4074-aac2-d59c5ca8dd6e"
                class="uuid-bb6c4c88-6868-44ab-aae5-3c8ff4874698"
                d="m78.19,33.99C74.59,13.28,54.88-.59,34.17,3.01c-4.75.83-9.3,2.54-13.4,5.07C8.64,15.65,2.78,26.91,2.44,41.98c.15,1.54.3,3.89.63,6.2,1.08,5.83,3.26,11.4,6.43,16.42,8.89,15.67,18.69,30.78,28.48,45.9.74,1.46,2.52,2.05,3.99,1.32.58-.29,1.05-.77,1.34-1.36,2.97-4.56,6-9.08,8.82-13.73,7.39-12.15,14.84-24.27,21.95-36.59,4.46-7.95,5.92-17.23,4.11-26.17" />
        </g>
    </g>
  </svg>`;
  const P_ICON = `
  <svg id="uuid-76112aaa-0984-479c-97f6-56ee40022446" xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 81.38 114.57">
    <defs>
        <style>
            .uuid-d664618f-e102-4a4e-8475-753bd2148de8{fill:#fff;}.uuid-307df6cc-5a7c-4ae1-a4c3-70419025a011{fill:none;stroke:#3f7172;stroke-width:4.88px;}.uuid-fec3ca61-cdd7-4af2-9b46-741cf11dac7b{fill:#ff6529;}</style>
    </defs>
    <g id="uuid-8cd64ecd-32b6-4bf6-b1ed-47b5a89c82de">
        <g>
            <path id="uuid-5a354e5e-e497-4c1f-9c5a-288da9156939"
                class="uuid-d664618f-e102-4a4e-8475-753bd2148de8"
                d="m78.19,33.99C74.59,13.28,54.88-.59,34.17,3.01c-4.75.83-9.29,2.54-13.4,5.06C8.64,15.65,2.78,26.91,2.44,41.98c.15,1.54.3,3.89.63,6.2,1.08,5.83,3.26,11.4,6.43,16.42,8.89,15.67,18.69,30.78,28.48,45.9.74,1.46,2.52,2.05,3.99,1.32.58-.29,1.05-.77,1.34-1.36,2.97-4.56,6-9.08,8.82-13.73,7.39-12.15,14.84-24.27,21.95-36.59,4.46-7.95,5.92-17.23,4.11-26.17" />
            <g id="uuid-7eec8925-7dc8-48ad-a0fe-9cfb8578e2dd">
                <path class="uuid-fec3ca61-cdd7-4af2-9b46-741cf11dac7b"
                    d="m25.49,91.05c4.12,6.51,8.3,12.98,12.49,19.45.74,1.46,2.52,2.05,3.99,1.32.58-.29,1.05-.77,1.34-1.36,2.97-4.56,6-9.08,8.82-13.73,1.15-1.89,2.31-3.79,3.46-5.68h-30.09Z" />
            </g>
            <path id="uuid-ca818268-79f5-4dfb-b084-5522b32a9ae9"
                class="uuid-307df6cc-5a7c-4ae1-a4c3-70419025a011"
                d="m78.19,33.99C74.59,13.28,54.88-.59,34.17,3.01c-4.75.83-9.29,2.54-13.4,5.06C8.64,15.65,2.78,26.91,2.44,41.98c.15,1.54.3,3.89.63,6.2,1.08,5.83,3.26,11.4,6.43,16.42,8.89,15.67,18.69,30.78,28.48,45.9.74,1.46,2.52,2.05,3.99,1.32.58-.29,1.05-.77,1.34-1.36,2.97-4.56,6-9.08,8.82-13.73,7.39-12.15,14.84-24.27,21.95-36.59,4.46-7.95,5.92-17.23,4.11-26.17" />
        </g>
    </g>
  </svg>`;
  const N_ICON = `<svg id="uuid-909fbab5-fd0f-4350-8f1c-0d33df550ab9" xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 81.38 114.57">
    <defs>
        <style>.nd-stroke-icon{fill:#686868}</style>
    </defs>
    <g id="uuid-3c8323f8-3642-4915-9fb6-a1ccc6de0f40">
        <g id="uuid-373d76cc-62f1-49ec-beb9-b0a5494a76dd">
            <path id="uuid-92a728f6-4120-4540-bae4-a02f97b54c0a"
                class="nd-stroke-icon"
                d="m78.19,33.99C74.59,13.28,54.88-.59,34.17,3.01c-4.75.83-9.29,2.54-13.4,5.06C8.64,15.65,2.78,26.91,2.44,41.98c.15,1.54.3,3.89.63,6.2,1.08,5.83,3.26,11.4,6.43,16.42,8.89,15.67,18.69,30.78,28.48,45.9.74,1.46,2.52,2.05,3.99,1.32.58-.29,1.05-.77,1.34-1.36,2.97-4.56,6-9.08,8.82-13.73,7.39-12.15,14.84-24.27,21.95-36.59,4.46-7.95,5.92-17.23,4.11-26.17" />
        </g>
    </g>
  </svg>`;

  const B_ICON = `<svg id="uuid-909fbab5-fd0f-4350-8f1c-0d33df550ab9" xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 81.38 114.57">
    <defs>
        <style>.uuid-55dc4e74-01b7-43c0-b13d-3f32a962e1d6{fill:#FFFFFF}</style>
    </defs>
    <g id="uuid-3c8323f8-3642-4915-9fb6-a1ccc6de0f40">
        <g id="uuid-373d76cc-62f1-49ec-beb9-b0a5494a76dd">
            <path id="uuid-92a728f6-4120-4540-bae4-a02f97b54c0a"
                class="uuid-55dc4e74-01b7-43c0-b13d-3f32a962e1d6"
                d="m78.19,33.99C74.59,13.28,54.88-.59,34.17,3.01c-4.75.83-9.29,2.54-13.4,5.06C8.64,15.65,2.78,26.91,2.44,41.98c.15,1.54.3,3.89.63,6.2,1.08,5.83,3.26,11.4,6.43,16.42,8.89,15.67,18.69,30.78,28.48,45.9.74,1.46,2.52,2.05,3.99,1.32.58-.29,1.05-.77,1.34-1.36,2.97-4.56,6-9.08,8.82-13.73,7.39-12.15,14.84-24.27,21.95-36.59,4.46-7.95,5.92-17.23,4.11-26.17" />
        </g>
    </g>
  </svg>`;

  const iconSize = [20, 29];
  const iconAnchor = [14, 29];
  const popupAnchor = null; //[0, -29];

  const layers = [
    {
      type: 'JSON',
      dataType: 'json',
      // cluster: {
      //   options: {
      //     iconCreateFunction: function(cluster) {
      //       return L.divIcon({
      //         html: cluster.getChildCount(),
      //         className: `cluster cluster_cpi`,
      //         iconSize: L.point(31, 31),
      //       });
      //     },
      //     showCoverageOnHover: false,
      //     maxClusterRadius: 80,
      //   },
      // },
      name: 'ps',
      visible: true,
      geomSubType: 'POINT',
      data: geojson,
      tooltip: '{breve_osp}',
      onEachFeature: function(feature, layer) {
        let popup;
        switch (feature.properties.class_gda) {
          case 'S':
            popup = popup_s;
            break;
          case 'A':
            popup = popup_a;
            break;
          case 'P':
            popup = popup_p;
            break;
          default:
            popup = popup_n;
        }
        layer.bindPopup(interpolateString(popup, feature.properties));
      },
      // autoZoom: ospedale ? true : false,
      classes: [
        {
          filter: {
            key: 'class_gda',
            value: 'S',
          },
          style: {
            svgIconHtml: S_ICON,
            iconSize: iconSize,
            iconAnchor: iconAnchor,
            popupAnchor: popupAnchor,
          },
        },
        {
          filter: {
            key: 'class_gda',
            value: 'A',
          },
          style: {
            svgIconHtml: A_ICON,
            iconSize: iconSize,
            iconAnchor: iconAnchor,
            popupAnchor: popupAnchor,
          },
        },
        {
          filter: {
            key: 'class_gda',
            value: 'P',
          },
          style: {
            svgIconHtml: P_ICON,
            iconSize: iconSize,
            iconAnchor: iconAnchor,
            popupAnchor: popupAnchor,
          },
        },
        {
          filter: {
            key: 'class_gda',
            value: 'N',
          },
          style: {
            svgIconHtml: N_ICON,
            iconSize: iconSize,
            iconAnchor: iconAnchor,
            popupAnchor: popupAnchor,
          },
        },
      ],
    },
  ];

  GV.init({
    debug: true,
    maps: [
      {
        id: 0,
        name: 'pronto-soccorso',
        layers: layers,
      },
    ],
    application: {
      mapOptions: {
        zoomSnap: 0.1,
        initialExtent: '830036,5402959,1123018,5597635',
        restrictedExtent: '830036,5402959,1123018,5597635',
      },
      layout: {
        title: ' ',
        legend: null,
        tools: null,
      },
      callback: function() {
        new L.Control.Zoom({ position: 'topleft' }).addTo(GV.app.map.map);
        zoomExtentsMap();
      },
    },
    baseLayers: [
      {
        type: 'OSM',
        visible: true,
      },
    ],
  });
}

// --------------------------------------------------------------------------

const popup_icon_s = `
    <div class="popup-icon">
      <svg id="uuid-909fbab5-fd0f-4350-8f1c-0d33df550ab9" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 81.38 114.57">
        <defs>
            <style>
                .uuid-55dc4e74-01b7-43c0-b13d-3f32a962e1d6{fill:#ff6529;stroke:#3f7172;stroke-width:4.88px;}</style>
        </defs>
        <g id="uuid-3c8323f8-3642-4915-9fb6-a1ccc6de0f40">
            <g id="uuid-373d76cc-62f1-49ec-beb9-b0a5494a76dd">
                <path id="uuid-92a728f6-4120-4540-bae4-a02f97b54c0a"
                    class="uuid-55dc4e74-01b7-43c0-b13d-3f32a962e1d6"
                    d="m78.19,33.99C74.59,13.28,54.88-.59,34.17,3.01c-4.75.83-9.29,2.54-13.4,5.06C8.64,15.65,2.78,26.91,2.44,41.98c.15,1.54.3,3.89.63,6.2,1.08,5.83,3.26,11.4,6.43,16.42,8.89,15.67,18.69,30.78,28.48,45.9.74,1.46,2.52,2.05,3.99,1.32.58-.29,1.05-.77,1.34-1.36,2.97-4.56,6-9.08,8.82-13.73,7.39-12.15,14.84-24.27,21.95-36.59,4.46-7.95,5.92-17.23,4.11-26.17" />
            </g>
        </g>
      </svg>
      <span class="popup-icon-legend">Sovraffollato</span>
    </div>
`;

const popup_icon_a = `
    <div class="popup-icon">
      <svg id="uuid-919c22b0-be60-4db0-b34f-d149c7b51e1a" xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 81.38 114.57">
        <defs>
            <style>
                .uuid-13a3a73a-d037-4366-b9b4-e8433c55dd7d{fill:#fff;}.uuid-bb6c4c88-6868-44ab-aae5-3c8ff4874698{fill:none;stroke:#3f7172;stroke-width:4.88px;}.uuid-393f1710-e427-4f98-8c4d-935d713c6847{fill:#ff6529;}</style>
        </defs>
        <g id="uuid-54371d7b-f841-4a41-beb4-4de4c38b5860">
            <g id="uuid-e6c6e92b-1e57-4a5e-aaee-647422a560a8">
                <path id="uuid-c35b86f1-de7e-4582-b241-10e76df3057c"
                    class="uuid-13a3a73a-d037-4366-b9b4-e8433c55dd7d"
                    d="m78.19,33.99C74.59,13.28,54.88-.59,34.17,3.01c-4.75.83-9.3,2.54-13.4,5.07C8.64,15.65,2.78,26.91,2.44,41.98c.15,1.54.3,3.89.63,6.2,1.08,5.83,3.26,11.4,6.43,16.42,8.89,15.67,18.69,30.78,28.48,45.9.74,1.46,2.52,2.05,3.99,1.32.58-.29,1.05-.77,1.34-1.36,2.97-4.56,6-9.08,8.82-13.73,7.39-12.15,14.84-24.27,21.95-36.59,4.46-7.95,5.92-17.23,4.11-26.17" />
                <path id="uuid-a9acd93c-0659-4a10-a2c3-e40bb47e876d"
                    class="uuid-393f1710-e427-4f98-8c4d-935d713c6847"
                    d="m4.43,57.26h73.07l-36.79,54.55L4.43,57.26Z" />
                <path id="uuid-49dfabdd-b461-4074-aac2-d59c5ca8dd6e"
                    class="uuid-bb6c4c88-6868-44ab-aae5-3c8ff4874698"
                    d="m78.19,33.99C74.59,13.28,54.88-.59,34.17,3.01c-4.75.83-9.3,2.54-13.4,5.07C8.64,15.65,2.78,26.91,2.44,41.98c.15,1.54.3,3.89.63,6.2,1.08,5.83,3.26,11.4,6.43,16.42,8.89,15.67,18.69,30.78,28.48,45.9.74,1.46,2.52,2.05,3.99,1.32.58-.29,1.05-.77,1.34-1.36,2.97-4.56,6-9.08,8.82-13.73,7.39-12.15,14.84-24.27,21.95-36.59,4.46-7.95,5.92-17.23,4.11-26.17" />
            </g>
        </g>
      </svg>
      <span class="popup-icon-legend">Affollato</span>
    </div>
`;

const popup_icon_p = `
    <div class="popup-icon">
      <svg id="uuid-76112aaa-0984-479c-97f6-56ee40022446" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 81.38 114.57">
        <defs>
            <style>
                .uuid-d664618f-e102-4a4e-8475-753bd2148de8{fill:#fff;}.uuid-307df6cc-5a7c-4ae1-a4c3-70419025a011{fill:none;stroke:#3f7172;stroke-width:4.88px;}.uuid-fec3ca61-cdd7-4af2-9b46-741cf11dac7b{fill:#ff6529;}</style>
        </defs>
        <g id="uuid-8cd64ecd-32b6-4bf6-b1ed-47b5a89c82de">
            <g>
                <path id="uuid-5a354e5e-e497-4c1f-9c5a-288da9156939"
                    class="uuid-d664618f-e102-4a4e-8475-753bd2148de8"
                    d="m78.19,33.99C74.59,13.28,54.88-.59,34.17,3.01c-4.75.83-9.29,2.54-13.4,5.06C8.64,15.65,2.78,26.91,2.44,41.98c.15,1.54.3,3.89.63,6.2,1.08,5.83,3.26,11.4,6.43,16.42,8.89,15.67,18.69,30.78,28.48,45.9.74,1.46,2.52,2.05,3.99,1.32.58-.29,1.05-.77,1.34-1.36,2.97-4.56,6-9.08,8.82-13.73,7.39-12.15,14.84-24.27,21.95-36.59,4.46-7.95,5.92-17.23,4.11-26.17" />
                <g id="uuid-7eec8925-7dc8-48ad-a0fe-9cfb8578e2dd">
                    <path class="uuid-fec3ca61-cdd7-4af2-9b46-741cf11dac7b"
                        d="m25.49,91.05c4.12,6.51,8.3,12.98,12.49,19.45.74,1.46,2.52,2.05,3.99,1.32.58-.29,1.05-.77,1.34-1.36,2.97-4.56,6-9.08,8.82-13.73,1.15-1.89,2.31-3.79,3.46-5.68h-30.09Z" />
                </g>
                <path id="uuid-ca818268-79f5-4dfb-b084-5522b32a9ae9"
                    class="uuid-307df6cc-5a7c-4ae1-a4c3-70419025a011"
                    d="m78.19,33.99C74.59,13.28,54.88-.59,34.17,3.01c-4.75.83-9.29,2.54-13.4,5.06C8.64,15.65,2.78,26.91,2.44,41.98c.15,1.54.3,3.89.63,6.2,1.08,5.83,3.26,11.4,6.43,16.42,8.89,15.67,18.69,30.78,28.48,45.9.74,1.46,2.52,2.05,3.99,1.32.58-.29,1.05-.77,1.34-1.36,2.97-4.56,6-9.08,8.82-13.73,7.39-12.15,14.84-24.27,21.95-36.59,4.46-7.95,5.92-17.23,4.11-26.17" />
            </g>
        </g>
      </svg>
      <span class="popup-icon-legend">Poco Affollato</span>
    </div>
`;

const popup_icon_n = `
    <div class="popup-icon">
      <svg class="popup-icon-svg" id="uuid-909fbab5-fd0f-4350-8f1c-0d33df550ab9" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 81.38 114.57">
        <defs>
            <style>.nd-stroke-icon{fill:#686868}</style>
        </defs>
        <g id="uuid-3c8323f8-3642-4915-9fb6-a1ccc6de0f40">
            <g id="uuid-373d76cc-62f1-49ec-beb9-b0a5494a76dd">
                <path id="uuid-92a728f6-4120-4540-bae4-a02f97b54c0a"
                    class="nd-stroke-icon"
                    d="m78.19,33.99C74.59,13.28,54.88-.59,34.17,3.01c-4.75.83-9.29,2.54-13.4,5.06C8.64,15.65,2.78,26.91,2.44,41.98c.15,1.54.3,3.89.63,6.2,1.08,5.83,3.26,11.4,6.43,16.42,8.89,15.67,18.69,30.78,28.48,45.9.74,1.46,2.52,2.05,3.99,1.32.58-.29,1.05-.77,1.34-1.36,2.97-4.56,6-9.08,8.82-13.73,7.39-12.15,14.84-24.27,21.95-36.59,4.46-7.95,5.92-17.23,4.11-26.17" />
            </g>
        </g>
      </svg>
      <span class="popup-icon-legend">Non disponibile</span>
    </div>
`;

const popup_s = `
  <div class="popup-container">
    ${popup_icon_s}
    <div class="popup-ospedale" >
      <span class="popup-nome">{breve_osp}</span>
      <span class="popup-indirizzo">{indirizzo} {civico}, {cap}, {comune}, {provincia}</span>
    </div>
  </div>
`;

const popup_a = `
  <div class="popup-container">
    ${popup_icon_a}
    <div class="popup-ospedale" >
      <span class="popup-nome">{breve_osp}</span>
      <span class="popup-indirizzo">{indirizzo} {civico}, {cap}, {comune}, {provincia}</span>
    </div>
  </div>
`;

const popup_p = `
  <div class="popup-container">
    ${popup_icon_p}
    <div class="popup-ospedale" >
      <span class="popup-nome">{breve_osp}</span>
      <span class="popup-indirizzo">{indirizzo} {civico}, {cap}, {comune}, {provincia}</span>
    </div>
  </div>
`;

const popup_n = `
  <div class="popup-container">
    ${popup_icon_n}
    <div class="popup-ospedale" >
      <span class="popup-nome">{breve_osp}</span>
      <span class="popup-indirizzo">{indirizzo} {civico}, {cap}, {comune}, {provincia}</span>
    </div>
  </div>
`;

// <div class="popup-indirizzo" >{INDIRIZZO} {PROVINCIA} ({PROV_SIGLA}) - {CAP}<br>
// <span class="popup-bold">Tel.</span> {TELEFONO}<br>
// <span class="popup-bold">Email</span> <a href="mailto:{EMAIL}">{EMAIL}</a><br>
// <span class="popup-bold">Orario di apertura al pubblico</span> {ORARIO}</div>
// <div class="popup-prenota"><a href="javascript:GV.psDettaglio({ID})"><button type="button" class="prenota-btn"><span>Prenota appuntamento </span></button></a></div>

GV.psDettaglio = function(id) {
  console.log(id);
  window.parent.postMessage({ messaggio: 'prenota-cpi', id: id }, '*');
};

const interpolateString = (str, data) => {
  var templateRe = /\{ *([\w_\-]+) *\}/g;
  return str.replace(templateRe, function(str, key) {
    var value = data[key];

    if (value === undefined) {
      throw new Error('No value provided for variable ' + str);
    } else if (typeof value === 'function') {
      value = value(data);
    }
    return value;
  });
};
