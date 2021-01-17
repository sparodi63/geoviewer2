import Vue from 'vue';

let tools = [];

tools.push({
  name: 'gv-geocoder',
});
import Geocoder from './components/Geocoder.vue';
Vue.component('gv-geocoder', Geocoder);

tools.push({
  name: 'gv-search',
});
import Search from './components/Search.vue';
Vue.component('gv-search', Search);

tools.push({
  name: 'gv-scalebar',
});
import Scalebar from './components/Scalebar.vue';
Vue.component('gv-scalebar', Scalebar);

tools.push({
  name: 'gv-inner-html',
});
import InnerHtml from './components/InnerHtml.vue';
Vue.component('gv-inner-html', InnerHtml);

tools.push({
  name: 'gv-add-map-button',
});
import AddMap from './components/buttons/AddMap.vue';
Vue.component('gv-add-map-button', AddMap);

tools.push({
  name: 'gv-info-button',
});
import Info from './components/buttons/Info.vue';
Vue.component('gv-info-button', Info);

tools.push({
  name: 'gv-coordinate-button',
});
import Coordinate from './components/buttons/Coordinate.vue';
Vue.component('gv-coordinate-button', Coordinate);

tools.push({
  name: 'gv-measure-button',
});
import Measure from './components/buttons/Measure.vue';
Vue.component('gv-measure-button', Measure);

tools.push({
  name: 'gv-draw-button',
});
import Draw from './components/buttons/Draw.vue';
Vue.component('gv-draw-button', Draw);

tools.push({
  name: 'gv-download-totale-button',
});
import DownloadTotale from './components/buttons/DownloadTotale.vue';
Vue.component('gv-download-totale-button', DownloadTotale);

tools.push({
  name: 'gv-layer-search-button',
});
import LayerSearch from './components/buttons/LayerSearch.vue';
Vue.component('gv-layer-search-button', LayerSearch);

tools.push({
  name: 'gv-layer-search-topo-button',
});
import LayerSearchTopo from './components/buttons/LayerSearchTopo.vue';
Vue.component('gv-layer-search-topo-button', LayerSearchTopo);

tools.push({
  name: 'atlante-geochimico-livelli',
});
import AtlanteGeochimicoLivelli from './components/AtlanteGeochimicoLivelli.vue';
Vue.component('atlante-geochimico-livelli', AtlanteGeochimicoLivelli);

tools.push({
  name: 'gv-map-selezione-fogli',
});
import SelezioneFogli from './components/SelezioneFogli.vue';
Vue.component('gv-map-selezione-fogli', SelezioneFogli);

tools.push({
  name: 'gv-gas',
});
import Gas from './components/Gas.vue';
Vue.component('gv-gas', Gas);

tools.push({
  name: 'gv-ricerca-particella-button',
});
import RicercaParticella from './components/buttons/RicercaParticellaCatastale.vue';
Vue.component('gv-ricerca-particella-button', RicercaParticella);

tools.push({
  name: 'gv-ricerca-catastale-button',
});
import RicercaCatastale from './components/buttons/S3RicercaCatastale.vue';
Vue.component('gv-ricerca-catastale-button', RicercaCatastale);

tools.push({
  name: 'gv-print-button',
});
import Print from './components/buttons/Print.vue';
Vue.component('gv-print-button', Print);

tools.push({
  name: 'gv-scuoladigitale-legend',
});
import ScuolaDigitaleLegend from './components/ScuolaDigitaleLegend.vue';
Vue.component('gv-scuoladigitale-legend', ScuolaDigitaleLegend);

tools.push({
  name: 'gv-genio-localizza-button',
});
import GenioLocalizza from './components/buttons/GenioLocalizza.vue';
Vue.component('gv-genio-localizza-button', GenioLocalizza);

tools.push({
  name: 'gv-genio-seleziona-particelle-button',
});
import GenioSelezionaParticelle from './components/buttons/GenioSelezionaParticelle.vue';
Vue.component('gv-genio-seleziona-particelle-button', GenioSelezionaParticelle);

tools.push({
  name: 'gv-cem-elaborazioni-button',
});
import CemElaborazioni from './components/buttons/CemElaborazioni.vue';
Vue.component('gv-cem-elaborazioni-button', CemElaborazioni);

tools.push({
  name: 'gv-back-button',
});
import Back from './components/buttons/Back.vue';
Vue.component('gv-back-button', Back);

tools.push({
  name: 'gv-fototeca-voli',
});
import FototecaVoli from './components/FototecaVoli.vue';
Vue.component('gv-fototeca-voli', FototecaVoli);

// Bottone FototecaCarrello
tools.push({ name: 'gv-fototeca-carrello-button' });
import FototecaCarrello from './components/buttons/FototecaCarrello.vue';
Vue.component('gv-fototeca-carrello-button', FototecaCarrello);

// Bottone FototecaSchedaVolo
tools.push({ name: 'gv-fototeca-scheda-volo-button' });
import FototecaSchedaVolo from './components/buttons/FototecaSchedaVolo.vue';
Vue.component('gv-fototeca-scheda-volo-button', FototecaSchedaVolo);

// Bottone FototecaSelezioneTerritoriale
tools.push({ name: 'gv-fototeca-selezione-territoriale-button' });
import FototecaSelezioneTerritoriale from './components/buttons/FototecaSelezioneTerritoriale.vue';
Vue.component('gv-fototeca-selezione-territoriale-button', FototecaSelezioneTerritoriale);

// Bottone GenioPraticheCollegate
tools.push({ name: 'gv-genio-pratiche-collegate-button' });
import GenioPraticheCollegate from './components/buttons/GenioPraticheCollegate.vue';
Vue.component('gv-genio-pratiche-collegate-button', GenioPraticheCollegate);

tools.push({
  name: 'gv-geocoder-pelias',
});
import GeocoderPelias from './components/GeocoderPelias.vue';
Vue.component('gv-geocoder-pelias', GeocoderPelias);

// -------------------------------------------------------------------------------- //

export default tools;
