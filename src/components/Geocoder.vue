<template>
    <div class="dropdown">
        <multiselect
                :selected.sync="selected"
                :show-labels="false"
                :options="options"
                :placeholder="placeholder"
                :searchable="true"
                :allow-empty="false"
                :multiple="true"
                :limit="limit"
                key="id"
                label="name"
        ></multiselect>
        <label v-show="showLabel" for="multiselect"><span></span>Language</label>
    </div>
</template>

<script>
    import { Multiselect } from 'vue-multiselect';

    export default {
        components: { Multiselect },

        props: {
            options: { type: Array, default: function () { return [] } },
            showLabel: {type: Boolean, default: true},
            multiple: {type: Boolean, default: true},
            searchable: {type: Boolean, default: true},
            placeholder: {default: 'Select one or more'},
            limit: 2,
            selected: ''
        },
        methods: {
        }
    };
</script>