<template>
  <div class="content-need-pading">
    <div class="operating tip-info">操作提示：单击开始绘制，双击结束。</div>
    <a-form :model="form" label-width="130px">
      <a-form-item size="small" label="最大可见高程(米)">
        <a-input-number v-model="form.max" size="small" :min="minInterval" />
      </a-form-item>
      <a-form-item size="small" label="最小可见高程(米)">
        <a-input-number v-model="form.min" size="small" :min="minZero" />
      </a-form-item>
      <a-form-item size="small" label="等值距(米)">
        <a-input-number v-model="form.interval" size="small" :min="minInterval" />
      </a-form-item>
      <a-form-item size="small" label="线颜色">
        <gaf-map-color-picker v-model="form.color" />
      </a-form-item>
    </a-form>
    <a-row>
      <a-button size="small" type="primary" @click="lineAnalysis">分析</a-button>
      <a-button size="small" type="danger" @click="clear">清除</a-button>
    </a-row>

  </div>
</template>

<script>
let viewer
let conterLine
import { YFGis } from '../../common'
// import YFGis from '../../../dist/YFGis'
export default {
  name: 'GisContourLine',
  data() {
    return {
      minInterval: 1,
      minZero: 0,
      form: {
        max: 9000,
        min: 0,
        interval: 100,
        color: '#FF0000'
      }
    }
  },
  destroyed() {
    this.clear()
  },
  mounted() {
    this.$nextTick(() => {
      viewer = window.viewer
      conterLine = new YFGis.ContourLine(viewer)
    })
  },
  methods: {
    lineAnalysis() {
      if (this.form.max < this.form.min) {
        // return $error('最大可见高程需大于最小可见高程')
        return
      }
      conterLine.startAnalysis(this.form)
    },
    clear() {
      conterLine.dispose()
    }
  }
}
</script>

<style>
.operating {
  padding: 6px 6px;
  text-align: left;
  text-indent: 15px;
  border: 1px dashed #09c3e1;
  color: #09c3e1;
  display: block;
  margin-bottom: 8px;
}
</style>
