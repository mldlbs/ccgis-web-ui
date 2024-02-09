<template>
  <div>
    <div class="custom-video">
      <div>
        <video id="video" muted="muted" width="100%" controls="" height="100%" src="/static/video/jksp2.mp4" autoplay="autoplay" loop="" />
      </div>
      <div class="operating tip-info">提示：单击开始绘制，双击结束。</div>
      <a-button size="small" type="primary" @click="drawAction()">编辑</a-button>
      <br>
      <span>
        <video-camera-outlined />
        <span title="路口监控" class="">路口监控</span>
      </span>
      <span>
        <span>定位</span>
        <span>打开</span>
      </span>
    </div>
  </div>
</template>

<script>
// import { VideoCameraOutlined } from '@ant-design/icons-vue'

let viewer, vfusion
import { YFGis } from '../../common'
// import YFGis from '../../../dist/YFGis'
export default {
  name: 'GisProjectionImage',
  components: {},
  data() {
    return {
      list: [
        {
          address: '凤城一路',
          createtime: 1687918106427,
          hlsurl: 'http://p.f1.0413it.com:999/qingyongling_com/a01.mp4',
          lonlat: '123.0086405424925,41.51132234906026',
          qhdm: '210102016',
          rhcs: '1111111111111',
          sprh: '1',
          state: '1',
          vmid: '2624c091-f262-4981-be75-85efef1ec1fe',
          vmname: '摄像头1',
          vmurl: 'http://p.f1.0413it.com:999/qingyongling_com/a01.mp4'
        },
        {
          createtime: 1687918106427,
          height: '1056.3155307897684',
          hlsurl: '/config/video.mp4',
          lonlat: '109.74786123851476,38.24056422529971',
          qhdm: '',
          rhcs: '',
          sprh: '1',
          state: '1',
          vmid: '3ee66bab-5ee1-4bf8-93fb-47adb1bcf9f3',
          vmname: '火车北站南1',
          vmurl: '/config/video.mp4'
        }
      ]
    }
  },
  mounted() {
  },
  methods: {
    drawAction() {
      this.$nextTick(() => {
        viewer = window.viewer
        const drawFeature = new YFGis.DrawFeature(viewer)
        vfusion = new YFGis.VideoShed(viewer)
        const videoEl = document.getElementById('video')
        vfusion.update({
          video: videoEl
        })
        vfusion.active()
        drawFeature.startDrawPoint(res => {
          const p = res.cartographicArr[0]
          vfusion.update({
            hfov: 20,
            vfov: 10,
            target: [p.longitude, p.latitude, p.height],
            video: videoEl
          })
          vfusion.deactive()
          drawFeature.clear()
        })
      })
    }
  }

}
</script>

<style scoped></style>
