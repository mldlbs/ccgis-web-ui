<template>
  <div class="custom-video">
    <div class="panelButton">
      <button type="button" class="queryButton" @click="addFeatures(1)"><span>雪亮工程</span></button>
      <button type="button" class="queryButton" @click="addFeatures(11)"><span>在线人员</span></button>
      <button type="button" class="queryButton" @click="clear"><span>清除</span></button>
      <button type="button" class="queryButton" @click="query"><span>空间查询</span></button>
    </div>
    <div class="panelButton">
      <button type="button" class="queryButton" @click="addFeatures(-1)"><span>绘制区域</span></button>
    </div>
    <div class="panelButton">
      <button type="button" class="queryButton" @click="addFeatures(-2)"><span>轨迹线</span></button>
      <button type="button" class="queryButton" @click="addFeatures(-3)"><span>播放</span></button>
      <button type="button" class="queryButton" @click="addFeatures(-4)"><span>播放速度</span></button>
    </div>
    <div class="panelButton">
      <button type="button" class="queryButton" @click="addFeatures(-5)"><span>热力图</span></button>
      <button type="button" class="queryButton" @click="addFeatures(-55)"><span>清除热力图</span></button>
    </div>
    <div class="panelButton">
      <button type="button" class="queryButton" @click="addFeatures(-6)"><span>添加摄像头</span></button>
    </div>
    <div class="panelButton">
      <button type="button" class="queryButton" @click="addFeatures(-7)"><span>缓冲区-点</span></button>
      <button type="button" class="queryButton" @click="addFeatures(-8)"><span>缓冲区-线</span></button>
      <button type="button" class="queryButton" @click="addFeatures(-9)"><span>缓冲区-面</span></button>
      <button type="button" class="queryButton" @click="addFeatures(-77)"><span>计算面积: {{ area }} 平方</span></button>
      <button type="button" class="queryButton" @click="addFeatures(-88)"><span>分析</span></button>
    </div>
    <div class="panelButton">
      <button type="button" class="queryButton" @click="addFeatures(101)"><span>模型半透明</span></button>
      <button type="button" class="queryButton" @click="addFeatures(201)"><span>数据服务</span></button>
    </div>

    <div class="panelButton">
      <button type="button" class="queryButton" @click="addFeatures(1001)"><span>测试对象销毁</span></button>
      <button type="button" class="queryButton" @click="addFeatures(1002)"><span>测试对象新建</span></button>
    </div>
  </div>
</template>

<script>
/*global SuperMap3D*/
let viewer, entityFeature, drawFeature, popupFeature, queryFeatures, orbitFeature, heatmapFeature, bufferAnalyst
import { YFGis } from '../../common'
import Popup from './Popup/index.js'
import videoData from './data/video.json'
import cluster from './data/cluster.json'
import heatmapData from './data/heatmap.json'
export default {
  name: 'GisFeature',
  data() {
    return {
      area: '',
      list: [],
      xlgcList: []
    }
  },
  mounted() {
    this.list = videoData
    this.$nextTick(() => {
      viewer = window.viewer
      viewer.resolutionScale = 0.8
      this.ref = YFGis.UUID.randomUUID()
      entityFeature = new YFGis.EntityFeature(viewer)
      drawFeature = new YFGis.DrawFeature(viewer)
      popupFeature = new YFGis.PopupFeature(viewer)
      queryFeatures = new YFGis.QueryFeatures()
      orbitFeature = new YFGis.OrbitFeature(viewer)
      bufferAnalyst = new YFGis.BufferAnalyst(viewer)
      heatmapFeature = new YFGis.HeatmapFeature(viewer)

      this.initPopup()
    })

    let i = 0
    const hander2 = (data) => {
      console.log(i++, data)
    }

    YFGis.Event.selected.add(hander2)

    YFGis.Event.enter.add((data) => {
    })
    YFGis.Event.leave.add((data) => {
      popupFeature.close('123412')
    })
  },
  destroyed() {
    if (entityFeature) entityFeature.clear()
    if (popupFeature) popupFeature.clear()
  },
  methods: {
    initPopup() {
      //   const id = YFGis.UUID.randomUUID()
      // 创建气泡
      const cartesian3 = SuperMap3D.Cartesian3.fromDegrees(106.7969971, 31.8514004, 10)
      const popEl = new Popup({
        id: '123412',
        close: (id) => popupFeature.close(id)
      })
      popupFeature.createPopup({
        id: '123412',
        el: popEl,
        cartesian3: cartesian3,
        offsetX: -100,
        offsetY: 100,
        stay: true
      })
    //   _popup.appendChild(popEl)
      //   this.$refs.popup.appendChild(_popup)
    },
    async query() {
      drawFeature.startDrawPoint(async(res) => {
        const geometry = res.geometry
        const point = res.cartographicArr[0]
        const cartesian3 = SuperMap3D.Cartesian3.fromDegrees(point.lon, point.lat, point.height)
        const result = await queryFeatures.queryMapFeaturesByBuffer(
          'http://117.176.63.158:31111/iserver/services/data-SXT/rest/data', // featureResults.rjson?returnContent=true
          'SXT',
          '公共专题数据',
          geometry,
          0.0001
        )
        const data = result.result.features[0] && result.result.features[0].data
        if (!data) return
        const id = YFGis.UUID.randomUUID()
        const popEl = new Popup({ id: id })
        const _popup = popupFeature.createPopup({
          id: id,
          cartesian3: cartesian3,
          offsetX: -100,
          offsetY: 100
        })
        _popup.appendChild(popEl)
        // this.$refs.popup.appendChild(_popup)
      })
    },
    addFeatures(type) {
      switch (type) {
        case -1: {
          window.viewer.scene.globe.depthTestAgainstTerrain = true
          drawFeature.startDrawPolygon((res) => {
            window.viewer.scene.globe.depthTestAgainstTerrain = false
            entityFeature.createWalls([
              {
                id: YFGis.UUID.randomUUID(),
                positions: res.cartographicArr,
                data: {
                  name: '摄像头1',
                  address: '凤城一路',
                  url: 'static/video/jksp2.mp4'
                },
                style: {
                  clamp: 0
                }
              }
            ])
            drawFeature.clear()
          })
          break
        }
        case -2: {
          drawFeature.startDrawLine((res) => {
            orbitFeature.create({
              id: YFGis.UUID.randomUUID(),
              positions: res.cartographicArr,
              data: {
                name: '摄像头1',
                address: '凤城一路',
                url: 'static/video/jksp2.mp4'
              },
              style: {
                url: '/static/images/location4.png',
                width: 30,
                height: 40,
                clamp: 1
              }
            })
            drawFeature.clear()
          })
          break
        }
        case -3: {
          orbitFeature.play()
          break
        }
        case -4: {
          orbitFeature.speed(4)
          break
        }
        case -5: {
          heatmapFeature.create(heatmapData)
          break
        }
        case -55: {
          heatmapFeature.clear()
          break
        }
        case -6: {
          console.log(this.xlgcList)
          entityFeature.createFeatures(this.xlgcList)
          break
        }

        case -7: {
          window.viewer.scene.globe.depthTestAgainstTerrain = true
          bufferAnalyst.draw(
            {
              type: 'point'
            },
            (res) => {
              window.viewer.scene.globe.depthTestAgainstTerrain = false
            }
          )
          break
        }
        case -8: {
          bufferAnalyst.draw({
            type: 'polyline'
          })
          break
        }
        case -9: {
          bufferAnalyst.draw({
            type: 'polygon'
          })
          break
        }
        case -77: {
          this.area = bufferAnalyst.calcArea()
          break
        }
        case -88: {
          bufferAnalyst.analyze()
          break
        }
        case 101: {
          YFGis.Layer.setAlpha(viewer, ['71666'], 0.5)
          break
        }
        case 201: {
          queryFeatures
            .getDatasetInfo(
              'http://117.176.63.158:31111/iserver/services/data-CSSZSS/rest/data', // featureResults.rjson?returnContent=true
              'CSSZCS',
              'YJG'
            )
            .then((res) => {
              console.log(res)
            })
          break
        }
        case 11:
          entityFeature.createFeatures(cluster)
          break
        case 1001:
          entityFeature.destroyed()
          this.$bus.$emit('change-view-visible', false)
          break
        case 1002:
          this.$bus.$emit('change-view-visible', true)
          entityFeature = new YFGis.EntityFeature(viewer)
          break
        default:
          entityFeature.createFeatures(this.list)
          break
      }
    },
    clear() {
      entityFeature.clear()
      drawFeature.clear()
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
.custom-video ::v-deep .yf-popup {
  position: fixed;
  width: 300px;
  height: 200px;
  top: 0;
  left: 0;
  background: #272525;
}

.heatmap {
  position: fixed;
  top: 100px;
  right: 100px;
  background: #fff;
  display: none;
}
</style>
