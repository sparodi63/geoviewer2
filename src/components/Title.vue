<template>
    <div class="gv-panel-title gv-color-scheme">
        {{title}}
        <button class="gv-close" type="button" @click="closePanel">×</button>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default {
        name: 'gv-title',
        props: ['title','hide'],
        methods: {
            closePanel: function () {
                (this.hide)?
                        this.$el.parentNode.style.display = 'none':
                        this.$el.parentNode.parentNode.removeChild(this.$el.parentNode)
            }
        },
        mounted: function () {
        }
    }
</script>

<style scoped>
    .gv-panel-title {
        position: relative;
        display: block;
        padding: 0.3rem 0.5rem;
        margin-bottom: -1px;
        color: #ccc;
        cursor: default;
        font-weight: bold;
    }

    .gv-panel-title span {
        font-size: 14px;
        font-weight: bold;
    }

    .gv-close {
        padding: 0;
        cursor: pointer;
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        float: right;
        font-size: 1rem;
        line-height: 1;
        font-weight: bold;
        color: #ffffff;
        margin-left: 5px;
        margin-right: 3px;
        margin-top: 3px;
        opacity: .5;
    }

</style>