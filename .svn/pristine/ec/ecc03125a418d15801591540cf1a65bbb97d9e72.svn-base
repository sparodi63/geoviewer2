<template>
    <div v-show="visible" :class="cls">
        <div class="gv-panel-title gv-color-scheme">
            {{title}}
            <button class="gv-close" type="button" @click="closePanel">×</button>
        </div>
        <div>
            <div class="gv-html-panel-body">
                <iframe id="iframe" :src="src" :height="height" :width="width" style="border: none;"></iframe>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default {
        name: 'gv-iframe-panel',
        props: ['html', 'src', 'visible', 'cls', 'title', 'width', 'height'],
        methods: {
            closePanel: function () {
                this.$el.parentNode.removeChild(this.$el);
            }
        },
        mounted: function () {
            var vm = this;

            if (vm.html) {
                // firefox non aggiorna innerHTML - devo aspettare 3ms
                setTimeout(function () {
                    vm.$el.querySelector('#iframe').contentDocument.body.innerHTML = vm.html;
                }, 1);
            }
        }
    }
</script>

