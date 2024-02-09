<template>
  <div>
    <!-- <gaf-map-draggable title="" :visible="true" style="width: 405px">
      <gis-feature v-if="true" />
      <gis-heatmap v-if="false" />
      <gis-pipe-burst v-if="false" />
      <gis-best-path v-if="false" />
      <gis-query v-if="false" />
      <gis-fly-to v-if="false" />
      <gis-projection-image v-if="false" />
      <gis-gradient v-if="false" />
    </gaf-map-draggable> -->
    <!-- <GafMapBestPathAnalysis /> -->
    <!-- <gaf-map-buffer-analysis /> -->
    <gis-dialog-list ref="GisDialogList" class="ccgis-component" />
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
    initPanel()
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
