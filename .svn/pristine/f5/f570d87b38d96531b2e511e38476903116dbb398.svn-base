<template>
    <div id="gv-geocoder" >
        <input id="gv-geocoder-input" type="search" placeholder="Cerca indirizzo..." />
    </div>
</template>

<script>
    import places from 'places.js';
    import L from 'leaflet';
    import GV from '../GV';


    export default {
        props: {
            value: {
                type: String,
                default: '',
            },
            options: {
                type: Object,
                default: () => ({countries: 'it'}),
            },
        },

        data () {
            return {
                placesAutocomplete: null,
                marker: null
            }
        },

        methods: {
            handleOnChange(e) {
                const result = e.suggestion
                //console.log(result)
                var icon = L.icon({
                    iconUrl: 'http://geoportale.regione.liguria.it/geoviewer2/static/img/marker-icon.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [0, -41]
                })
                const opts = {
                    opacity: .8,
                    icon: icon,
                    title: result.name
                }
                this.marker = L.marker(result.latlng, opts);
                this.marker.addTo(GV.app.map);
                GV.app.map.setView(result.latlng, 14);
            },
            handleOnSuggestions(e) {
                //console.log('handleOnSuggestions',e)
            },
            handleOnClear() {
                //console.log('clear')
                GV.app.map.removeLayer(this.marker);
            },

        },

        mounted () {
            this.options.container = document.getElementById("gv-geocoder-input")
            this.placesAutocomplete = places(this.options)
            this.placesAutocomplete.on('change', this.handleOnChange)
            this.placesAutocomplete.on('suggestions', this.handleOnSuggestions)
            this.placesAutocomplete.on('clear', this.handleOnClear);
        },

        beforeDestroy () {
            this.placesAutocomplete.destroy();
        }
    }
</script>