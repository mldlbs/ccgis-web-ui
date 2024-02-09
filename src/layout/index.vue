<template>
  <div>
    <!-- <gaf-map-basic-element v-if="loaded" /> -->
    <router-view :key="key" />
    <!-- <gaf-map-viewer v-if="visible" :service-list="layerList" @initialize="onViewerLoaded" /> -->
    <map3d />

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
import webgisConfig from '../config/webgisConfig.json'

import map3d from './map3d.vue'

import { YFGis } from '@gis/common'
/*global SuperMap3D*/
let viewer

export default {
  components: { map3d },
  data() {
    return {
      loaded: false,
      location: webgisConfig.location,
      token: webgisConfig.token,
      horizontalToolbars: webgisConfig.horizontalToolbars,
      verticalToolbars: webgisConfig.verticalToolbars,
      allDataList: webgisConfig.resourceTree.allDataList,
      replaceFields: webgisConfig.resourceTree.replaceFields,
      layerList: [],
      bottomList: webgisConfig.bottomLayers,
      globe: webgisConfig.resourceTree.globe,
      visible: true
    }
  },
  computed: {
    key() {
      return this.$route.path
    },
    isBottomShow() {
      return this.bottomList && this.bottomList.length > 0
    }
  },
  watch: {
    location(val) {
      this.$mapActions.setView(val)
    }
  },
  beforeMount() {},
  beforeCreate() {
    const that = this
    this.$bus.$on('initialize', () => {
      that.loaded = true
      if (that.location) {
        that.$mapActions.setView(that.location)
      }
    })
  },

  mounted() {
    this.layerList = this.allDataList
    this.$nextTick(() => {
      this.init()
    })
    this.$bus.$on('change-view-visible', (show) => {
      this.visible = show
      this.$nextTick(() => {
        if (show) this.init()
      })
    })
  },
  methods: {
    init() {
      viewer = window.viewer
      viewer.camera.flyTo({
        destination: SuperMap3D.Cartesian3.fromDegrees(106.7669983, 31.8659992, 15000.0)
      })

      //   YFGis = window.YFGis
      YFGis.Scene.initEvent(viewer)
      setTimeout(() => {
        this.globe.layer.forEach(item => {
          YFGis.Layer.setColorParam(viewer, item.id, item)
        })
      }, 3000)
    },
    go(path) {
      this.$router.push(path + '?time=' + new Date().getUTCMilliseconds())
    },
    onTreeNodeChecked(checkedKeys, info) {
      const layerList = []
      checkedKeys.forEach((key) => {
        const data = this.allDataList.find((item) => {
          return item.resourceId.toString() === key.toString()
        })
        if (data) {
          layerList.push(data)
        }
      })
      this.layerList = layerList
    },
    onSelect() {},
    onViewerLoaded() {
      this.loaded = true
    }
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
