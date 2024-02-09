<template>
  <div>
    <div class="gradient-case">
      <div class="content-need-pading" style="height: 100%;">
        <div class="operating tip-info">提示：单击开始绘制，双击结束。</div>
        <a-form ref="gradientForm" class="gradient" size="small" :model="form">
          <!-- <el-form-item label="参与分析区域:">
          <el-radio-group v-model="gradientMode" @change="gradientModeChange">
            <el-radio-button value="specifyArea" label="specifyArea">指定区域</el-radio-button>
            <el-radio-button value="allArea" label="allArea">全部</el-radio-button>
            <el-radio-button value="noArea" label="noArea">无区域</el-radio-button>
          </el-radio-group>
        </el-form-item> -->
          <!-- <a-form-item label="坡度分析样式:">
            <a-radio-group v-model="gradientStyle">
              <a-radio-button label="markAll">颜色和箭头</a-radio-button>
              <a-radio-button label="markColor">颜色</a-radio-button>
              <a-radio-button label="markArrow">箭头</a-radio-button>
            </a-radio-group>
          </a-form-item> -->
          <!-- <a-form-item class="range-slide-margin" label="坡度区间(度):">
            <a-slider
              v-model="form.gradientRange"
              class="slide-margin"
              range
              :min="0"
              :max="90"
              :marks="markStartEnd"
            />
          </a-form-item>
          <a-form-item class="range-slide-margin" prop="gradientColor" label="颜色表区间:">
            <a-slider
              v-model="form.gradientColor"
              class="slide-margin"
              range
              :min="0"
              :max="90"
              :marks="markColor"
            />
          </a-form-item>
          <a-form-item class="transparency" prop="transparency" label="透明度:">
            <a-slider
              v-model="form.transparency"
              class="slide-margin"
              :step="0.05"
              :min="0"
              :max="1"
              :marks="markOpacity"
              @input="changeOpacity"
            />
          </a-form-item> -->
        </a-form>
        <div>
          <a-button type="primary" size="small" @click="lineAnalysis()">坡度分析</a-button>
          <a-button type="danger" size="small" @click="clear()">清除</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let viewer
let gradient
import { YFGis } from '../../common'
// import YFGis from '../../../dist/YFGis'
export default {
  name: 'GisGradient',
  data() {
    return {
      gradientMode: 'specifyArea',
      gradientRange: [0, 90],
      markStartEnd: {
        0: {
          style: {
            color: '#1989FA'
          },
          label: this.$createElement('strong', '0')
        },
        90: {
          style: {
            color: '#1989FA',
            right: '-11px !important'
          },
          label: this.$createElement('strong', '90')
        }
      },
      markColor: {
        0: {
          style: {
            color: '#1989FA'
          },
          label: this.$createElement('strong', '陡峭')
        },
        90: {
          style: {
            color: '#1989FA',
            right: '-27px !important'
          },
          label: this.$createElement('strong', '平缓')
        }
      },
      markOpacity: {
        0: {
          style: {
            color: '#1989FA'
          },
          label: this.$createElement('strong', '0')
        },
        1: {
          style: {
            color: '#1989FA',
            right: '-7px !important'
          },
          label: this.$createElement('strong', '1')
        }
      },
      gradientStyle: 'markAll',
      predefineColors: [
        '#cccccc',
        '#7FFF00',
        '#FF0000',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.9)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)'
      ],
      form: {
        gradientRange: [0, 90],
        gradientColor: [0, 90],
        transparency: 0.7,
        chooseColor: 1,
        maxValue: 120,
        minValue: 0,
        speed: 1
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      viewer = window.viewer
      gradient = new YFGis.Gradient(viewer)
    })
  },
  beforeDestroy() {
    viewer = null
  },
  methods: {
    lineAnalysis() {
      if (this.form.max < this.form.min) {
        // return $error('最大可见高程需大于最小可见高程')
        return
      }
      gradient.startAnalysis(this.form)
    },
    clear() {
      gradient.dispose()
    }
  }
}
</script>

<style></style>
