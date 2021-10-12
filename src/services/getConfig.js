import axios from 'axios';
import globals from '../globals';

export default function getConfig(idMap) {
  if (!idMap || idMap === 'null') {
    throw new Error('Parametro idMap mancante');
  }

  let url = idMap.startsWith('D')
    ? `${globals.RL_DYN_MAP_CONFIG_SERVICE}${idMap}`
    : `${globals.RL_MAP_CONFIG_SERVICE}${idMap}`;

  let params = {};

  if (GV.config.application.name) {
    params.app = GV.config.application.name;
  } else {
    params.app = 'gv2';
  }

  if (GV.config.geoserverUrl) {
    params.geoserverUrl = GV.config.geoserverUrl;
  }

  if (GV.config.flagGeoserver) {
    params.geoserver = 'true';
  }

  // console.log('GET CONFIG', url)
  return axios.get(url, {
    params: params,
  });
}
