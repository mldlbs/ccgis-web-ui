<template>
  <div>
    <gis-editor ref="GisEditor" class="" />
  </div>
</template>
<script>
/*global */
import { initPanel } from './home-core.js'
export default {
  data() {
    return {
      loaded: false
    }
  },
  computed: {},
  watch: {},
  beforeMount() {},
  beforeCreate() {},
  mounted() {
    initPanel.apply(this)
  },
  methods: {}
}
</script>
<style>
.panelButton .queryButton {
  margin: 0 5px;
  height: 23px;
}

button {
  background: transparent;
  color: var(--base-light-color, #45c3ff);
  border-radius: 6px;
  border: solid 1px var(--base-light-color, #45c3ff);
  padding: 0 5px;
  cursor: pointer;
}
</style>
