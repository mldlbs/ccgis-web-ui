<template>
  <div class="gis-pipe-burst">
    <div style="margin-bottom: 15px">
      分析图层：
      <a-select v-model="analysisType" class="item2" style="width: 260px">
        <a-select-option v-for="(_type, index) in types" :key="index" :value="_type.type">{{ _type.title }}</a-select-option>
      </a-select>
    </div>
    <div style="margin-bottom: 15px">
      分析类型：
      <a-select v-model="analysisType" class="item2" style="width: 260px">
        <a-select-option v-for="(_type, index) in types" :key="index" :value="_type.type">{{ _type.title }}</a-select-option>
      </a-select>
    </div>
    <div style="margin-bottom: 15px">
      流向动画：
      <button type="button" role="switch" class="ant-switch"><span class="ant-switch-inner">关</span></button>
    </div>
    <div class="panelButton">
      <button type="button" class="queryButton ant-btn"><span>选择爆管点</span></button><button type="button" class="queryButton ant-btn"><span>分 析</span></button><button type="button" class="queryButton ant-btn"><span>清 除</span></button>
    </div>
    <div class="result-table"><!----></div>
  </div>
</template>

<script>
/*global */ // SuperMap3D
let viewer
import { YFGis } from '../../common'
export default {
  name: 'GisPipeBurst',
  data() {
    return {}
  },
  mounted() {
    this.$nextTick(() => {
      viewer = window.viewer
      viewer.resolutionScale = 0.8
      this.ref = YFGis.UUID.randomUUID()
    })

    let i = 0
    const hander = (data) => {
      console.log(i++, data)
    }
    const hander2 = (data) => {
      console.log(i++, data)
    }

    // YFGis.Event.selected.removeAll()
    YFGis.Event.selected.add(hander2)
    YFGis.Event.selected.remove(hander2)
    YFGis.Event.selected.add(hander)

    YFGis.Event.enter.add((data) => {})
    YFGis.Event.leave.add((data) => {})
    // YFGis.Event.picked.add((data) => {
    //   console.log(4, data)
    // })
  },
  destroyed() {},
  methods: {
    clear() {}
  }
}
</script>

<style scoped>
.gis-pipe-burst {
  display: flex;
  flex-flow: column nowrap;
  /* width: 260px; */
}

/* .gis-pipe-burst span {
  cursor: pointer;
} */

.item2 {
  width: 150px;
}
</style>
