<template>
  <div>
    <gaf-map-draggable title="" :visible="true" right>
      <gis-feature />
    </gaf-map-draggable>
  </div>
</template>
<script>
import webgisConfig from '../config/webgisConfig.json'
/*global SuperMap3D*/
let viewer

export default {
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
      bottomList: webgisConfig.bottomLayers
    }
  },
  computed: {
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
    this.$nextTick(() => {
      viewer = window.viewer
      viewer.camera.flyTo({
        destination: SuperMap3D.Cartesian3.fromDegrees(106.7669983, 31.8659992, 15000.0)
      })

      this.layerList = this.allDataList
    })
  },
  methods: {
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
