<template>
  <div>
    <!-- <gaf-map-basic-element v-if="loaded" /> -->
    <router-view :key="key" />
    <!-- <gaf-map-viewer v-if="visible" :service-list="layerList" @initialize="onViewerLoaded" /> -->
    <!-- <map3d /> -->

    <!--<gaf-map-draggable v-if="allDataList && allDataList.length > 0" title="资源目录树" :visible="false">
        <gaf-map-layer-tree :replace-fields="replaceFields" :data-list="allDataList" :search-input-show="true" :check="onTreeNodeChecked" :select="onSelect" :all-checkable="false" :leafnode-checkable="true" :somen-node-checkable="false" />
      </gaf-map-draggable>

      <gaf-map-draggable title="" :visible="false">
        <gis-draw />
      </gaf-map-draggable>

      <gaf-map-draggable title="" :visible="false">
        <gis-contour-line />
      </gaf-map-draggable>

      <gaf-map-draggable title="" :visible="false">
        <gis-gradient />
      </gaf-map-draggable>

      <gaf-map-draggable title="" :visible="false" :width="330">
        <gis-projection-image />
      </gaf-map-draggable>

      <gaf-map-draggable title="" :visible="true">
        <gis-feature />
        <gis-feature />
      </gaf-map-draggable> -->

    <!-- <gaf-map-tool-bar v-for="horizontalToolbar in horizontalToolbars" :key="horizontalToolbar.id" :content="horizontalToolbar.buttons" :position="horizontalToolbar.position" type="horizontal" /> -->

    <!-- <gaf-map-bottom class="bottomChangeDiv" :bottom-list="bottomList" :token="token" /> -->

    <!-- <div class="btn" style="position: absolute; right: 0;">
      <span @click="go('/home')">home</span>
      <span @click="go('/home2')">home2</span>
    </div> -->
  </div>
</template>
<script>
// import webgisConfig from '../config/webgisConfig.json'

// import map3d from './map3d.vue'

// import { YFGis } from '@gis/common'
/*global */ // SuperMap3D
// let viewer

export default {
  components: {},
  data() {
    return {
      loaded: false,
      //   location: webgisConfig.location,
      //   token: webgisConfig.token,
      //   horizontalToolbars: webgisConfig.horizontalToolbars,
      //   verticalToolbars: webgisConfig.verticalToolbars,
      //   allDataList: webgisConfig.resourceTree.allDataList,
      //   replaceFields: webgisConfig.resourceTree.replaceFields,
      //   layerList: [],
      //   bottomList: webgisConfig.bottomLayers,
      //   globe: webgisConfig.resourceTree.globe,
      visible: true
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  },
  watch: {
  },
  beforeMount() {},
  beforeCreate() {
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped>
.btn {
  position: absolute;
}
.btn span{
    background: #fff;
    padding: 10px;
    margin: 10px;
    cursor: pointer;
}
</style>
