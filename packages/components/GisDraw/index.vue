<template>
  <div>
    <button size="small" @click="drawAction()">绘制多边形</button>
    <button size="small" @click="drawLine()">绘制线</button>
    <button size="small" @click="clear()">清除</button>
  </div>
</template>

<script>
let viewer
let drawFeature
import { YFGis } from '../../common'
// import YFGis from '../../../dist/YFGis'
// import { drawAction, clearAction } from './GisListAction'
export default {
  name: 'GisDraw',
  mounted() {
    this.$nextTick(() => {
      viewer = window.viewer
      drawFeature = new YFGis.DrawFeature(viewer)
    })
  },
  beforeDestroy() {
    viewer = null
  },
  methods: {
    drawAction() {
      drawFeature.startDrawPolygon(res => {
        console.log(res)
      })
    },
    drawLine() {
      drawFeature.startDrawLine(res => {
        console.log(res)
      })
    },
    clear() {
      drawFeature.dispose()
    }
  }
}
</script>

<style></style>
