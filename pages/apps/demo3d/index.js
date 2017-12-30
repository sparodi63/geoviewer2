var id = "1630,1370"

function addLayerSwitcher() {
    var switcher = document.createElement("div");
    switcher.id = 'layer-switcher'
    document.getElementById('gv-container').appendChild(switcher)

    const layers = [
        { id: "CARTE_BASE", label: "C.T.R." },
        { id: "ORTOFOTO", label: "Ortofoto" },
        { id: "SENTIERI", label: "Sentieri" },
        { id: "ACCL", label: "Acclività" },
    ]

    layers.forEach(layer => {
        let link = document.createElement('a')
        link.href = '#'
        link.textContent = layer.label
        link.id = layer.id
        link.className = 'active'

        link.onclick = function(e) {
            const clicked = this.id
            e.preventDefault()
            e.stopPropagation()
            switch (clicked) {
                case 'ACCL':
                    setAcclivita()
                    break
                case 'SENTIERI':
                    setSentieri()
                    break
                case 'ORTOFOTO':
                    setOrtofoto()
                    break
                case 'CARTE_BASE':
                    setCarteBase()
                    break
            }
        }
        document.getElementById('layer-switcher').appendChild(link)
    })
}

function hideLayers() {
    var layers = GV.config.getAllLayersConfig()
    layers.forEach(layer => {
        GV.app.map.setLayerVisible(layer, false)
    })

}

function setAcclivita() {
    GV.app.map.changeBaseLayer('BLANK')
    hideLayers()
    var layer = GV.config.getLayerConfig("L3586")
    GV.app.map.setLayerVisible(layer, true)
}

function setSentieri() {
    GV.app.map.changeBaseLayer('BLANK')
    hideLayers()
    var layer = GV.config.getLayerConfig("L4295")
    if (layer) {
        GV.app.map.setLayerVisible(layer, true)
    }
}

function setCarteBase() {
    hideLayers()
    GV.app.map.changeBaseLayer('RL_CARTE_BASE')
}

function setOrtofoto() {
    hideLayers()
    GV.app.map.changeBaseLayer('RL_ORTOFOTO_2016')
}



var callback = function(config) {
    GV.app.map.setView(new L.LatLng(44.33072485510803, 9.179935455322267), 13)
    hideLayers()
    addLayerSwitcher()

    setCarteBase()

}


GV.init({
    debug: true,
    idMap: id,
    // geoserverUrl: 'http://geoservizi.regione.liguria.it:8081/',
    application: {
        name: 'demo3d',
        layout: {
            tools: [],
        },
        callback: callback
    },
    baseLayers: [
        { type: 'ESRI_IMAGERY' },
        { type: 'MAPBOX_STREETS' },
        { type: 'RL_ORTOFOTO_2016' },
        { type: 'RL_CARTE_BASE' },
        { type: 'BLANK', visible: true },
    ],
    maps: [],
})