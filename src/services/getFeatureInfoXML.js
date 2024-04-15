import axios from 'axios';
var X2JS = require('../util/X2JS');

function parseGml(gml, layerName) {
  const data = new X2JS().xml_str2json(gml);
  let features = [];

  // LizMap
  if (data.FeatureCollection && data.FeatureCollection.featureMember) {
    if (Array.isArray(data.FeatureCollection.featureMember)) {
      data.FeatureCollection.featureMember.forEach((featureMember, index2) => {
        const feature = featureMember[Object.keys(featureMember)[0]];
        let properties = {};
        let toAdd = false;
        Object.keys(feature).forEach((key, index) => {
          if (key !== '__prefix' && key !== '__text' && key !== 'toString') {
            properties[key] = feature[key].__text;
            toAdd = true;
          }
        });
        if (toAdd) {
          features.push({
            type: 'Feature',
            id: `${layerName}.${index2}`,
            geometry: null,
            properties: properties,
          });
        }
      });
    } else {
      const featureMember = data.FeatureCollection.featureMember;
      const feature = featureMember[Object.keys(featureMember)[0]];
      let properties = {};
      let toAdd = false;
      const index2 = 0;
      Object.keys(feature).forEach((key, index) => {
        if (key !== '__prefix' && key !== '__text' && key !== 'toString') {
          // console.log(key)
          // console.log(feature[key].__text)
          properties[key] = feature[key].__text;
          toAdd = true;
        }
      });
      if (toAdd) {
        features.push({
          type: 'Feature',
          id: `${layerName}.${index2}`,
          geometry: null,
          properties: properties,
        });
      }
    }
  }

  // MapServer
  if (data.msGMLOutput) {
    Object.keys(data.msGMLOutput).forEach((key, index) => {
      if (key.indexOf('_layer') >= 0) {
        const layerName = key.replace('_layer', '');
        const layer = data.msGMLOutput[key];
        Object.keys(layer).forEach((key2, index2) => {
          const feature = layer[key2];
          if (Array.isArray(feature)) {
            feature.forEach(value => {
              const properties = value;
              features.push({
                type: 'Feature',
                id: `${layerName}.${index2}`,
                geometry: null,
                properties: properties,
              });
            });
          } else {
            let properties = {};
            let toAdd = false;
            Object.keys(feature).forEach((key, index) => {
              if (key !== '__prefix' && key !== '__text' && key !== 'toString') {
                properties[key] = feature[key];
                toAdd = true;
              }
            });
            if (toAdd) {
              features.push({
                type: 'Feature',
                id: `${layerName}.${index2}`,
                geometry: null,
                properties: properties,
              });
            }
          }
        });
      }
    });
  }

  return features;
}

// function rawXML(gml, layers) {
//   let features = [];
//   const data = new X2JS().xml_str2json(gml);
//   if (data.FeatureCollection && data.FeatureCollection.featureMember) {
//     if (Array.isArray(data.FeatureCollection.featureMember)) {
//       data.FeatureCollection.featureMember.forEach((featureMember, index2) => {
//         const feature = featureMember[Object.keys(featureMember)[0]];
//         features.push({
//           type: 'Feature',
//           id: `${layerName}.${index2}`,
//           layerName: layers,
//           properties: properties,
//         });
//       });
//     } else {
//       const index2 = 0;
//       features.push({
//         type: 'Feature',
//         id: `${layerName}.${index2}`,
//         layerName: layers,
//         gml: gml,
//         properties: data,
//       });
//     }
//   }
//   return features;
// }

function parseGmlComplex(gml, layers) {
  const data = new X2JS().xml_str2json(gml);
  // console.log(data);
  // let features = [];
  // if (Array.isArray(data.FeatureCollection.featureMember)) {
  //   data.FeatureCollection.featureMember.forEach((featureMember, index2) => {
  //     let feature = {
  //       layerName: layers,
  //       gml: gml,
  //       properties: {
  //         featureMember
  //       },
  //     };
  //   });
  // }

  let features = [
    {
      layerName: layers,
      gml: gml,
      properties: data,
    },
  ];
  return features;
}

export default function getFeatureInfo(url, layers, infoOptions) {
  let params = {};

  return axios
    .get(url, {
      params: params,
    })
    .then(response => {
      const gml = response.data;
      const features = infoOptions.complexFeature
        ? parseGmlComplex(response.data, layers)
        : parseGml(gml, layers);
      return features;
    });
}
