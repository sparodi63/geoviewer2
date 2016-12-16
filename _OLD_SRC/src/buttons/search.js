/**
 * Created by parodi on 19/09/2016.
 */
GV.Buttons.search = function(btnOptions, map) {
    "use strict";

    // ATTENZIONE!!!!
    // BOTTONE SEARCH DEVE ESSERE CARICATO DOPO IL CARICAMENTO DEI LAYER
    // NON PUO' ESSERE DEFINITO IN CONFIGURAZIONE TOOLBAR MA AGGIUNTO NELLA BOTTONIERA NEL CALLBACK
    // VEDI SCUOLADIGITALE
    var layers = [];
    _.each(btnOptions.layers, function (layerName) {
        var layer = map.getLayerByName(layerName);
        if (layer) {
            layers.push(layer);
        }
    });
    if (layers.length === 0) {
        GV.util.log('bottone search: layer non trovato.',2);
        return;
    }
    btnOptions.layer = L.layerGroup(layers);

    return new L.Control.Search(btnOptions);
};