
Vue.component('gv-map', {
    template: '<div id= "gv-map"></div>',
    mounted: function () {
        GV.util.log('gv-map: mounted');
        GV.map = new GV.Map();
    }
});

