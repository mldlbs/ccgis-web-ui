<template>
  <div class="custom-video">
    <div class="panelButton">
      <button type="button" class="queryButton" @click="addFeatures(-5)"><span>热力图</span></button>
      <button type="button" class="queryButton" @click="addFeatures(-55)"><span>清除热力图</span></button>
      <span>二三维切换</span>
      <button type="button" class="queryButton" @click="addFeatures('1-1')"><span>二维</span></button>
      <button type="button" class="queryButton" @click="addFeatures('1-2')"><span>三维</span></button>
      <div id="heatmap" ref="heatmap">
        <div class="heatmap" style="width: 800px;height: 600px;" />
      </div>
    </div>
    <!-- <gaf-map-measure /> -->
    <!-- <gaf-map-tool-bar
      :content="content"
      :position="'topLeft'"
      :is-box="false"
      :fold="false"
      type="vertical"
    /> -->
  </div>
</template>

<script>

/*global */
let viewer, heatmapFeature
import { YFGis } from '../../common'
import heatmapData from './data/heatmap.json'

export default {
  name: 'GisHeatmap',
  data() {
    this.instance = undefined
    return {
      content: [
        {
          'title': '卷帘',
          'name': 'RollerShutter',
          'icon': 'icon-juanlian1',
          'params': null
        }
      ],
      area: '',
      list: [],
      xlgcList: [],
      commonTools: [
        {
          id: '27d1b99a-7f98-48fc-a082-b7157f6d7841',
          title: '量算',
          icon: 'icon-celiang',
          sort: null,
          name: 'GafMapMeasure',
          visible: true,
          params: null,
          moreProperties: { placement: 'center' },
          description: null,
          createdTime: null,
          createdBy: null,
          updatedTime: null,
          updatedBy: null
        }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      viewer = window.viewer
      heatmapFeature = new YFGis.HeatmapFeature(viewer, this.$refs.heatmap)
      //   entityFeature = new YFGis.EntityFeature(viewer)

      YFGis.Event.selected.add((data) => {
        console.log(4, data)
        // const point = data.cartographicArr[0]
        // viewer.scene.camera.flyTo({
        //   destination: SuperMap3D.Cartesian3.fromDegrees(
        //     point.longitude,
        //     point.latitude, //  - 0.025
        //     point.height + 300
        //   )
        // })
      })
    //   viewer.scene.mode = 1// 2，5场景
    })
  },
  destroyed() {
  },
  methods: {
    addFeatures(type) {
      switch (type) {
        case -5: {
          heatmapFeature.create(heatmapData, ['71666'])
          break
        }
        case -55: {
          heatmapFeature.clear()
          break
        }
        case '1-1': {
          viewer.scene.mode = 1// 平面场景 不能切到2D:2, 2D 模式缩放鼠标位置不正确
          viewer.scene.screenSpaceCameraController.enableTilt = false
          YFGis.Scene.switch2D(viewer)

          break
        }
        case '1-2': {
          viewer.scene.mode = 3// 三维场景
          viewer.scene.screenSpaceCameraController.enableTilt = true
          break
        }
      }
    },
    clear() {
    }
  }
}
</script>

<style scoped>
.custom-video {
  display: flex;
  flex-flow: column nowrap;
}
.custom-video span {
  cursor: pointer;
}

#heatmap {
  position: fixed;
  top: 100px;
  right: 100px;
  background: #fff;
  display: none;
}
</style>
