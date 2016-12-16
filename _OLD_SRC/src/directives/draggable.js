
Vue.directive('draggable', {
    inserted: function (el, binding, vnode) {
        // Add the 'draggable' class
        el.className += " draggable";
    }
});

