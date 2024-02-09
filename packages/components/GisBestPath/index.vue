<template>
  <div class="gis-best-path">
    <!--  -->
    <div class="panelButton">
      <button type="button" class="queryButton" @click="selectPoints(1)"><span>选择站点1</span></button>
      <button type="button" class="queryButton" @click="selectPoints(2)"><span>选择站点2</span></button>
      <button type="button" class="queryButton" @click="doAnalysis"><span>分 析</span></button>
      <button type="button" class="queryButton"><span>直线距离</span>{{ length }}</button>
      <button type="button" class="queryButton"><span>驾车</span>{{ tCar }}</button>
      <button type="button" class="queryButton"><span>步行</span>{{ tMan }}</button>
    </div>
  </div>
</template>

<script>
/*global SuperMap3D*/
let viewer
let drawFeature
let queryFeatures
let entityFeature
let popupFeature
let nodes = []
import { Popup, TimePopup } from './Popup/index.js'
import { YFGis } from '../../common'
export default {
  name: 'GisBestPath',
  data() {
    return {
      length: 0,
      tCar: 0,
      tMan: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      viewer = window.viewer
      //   viewer.resolutionScale = 0.8
      drawFeature = new YFGis.DrawFeature(viewer)
      queryFeatures = new YFGis.QueryFeatures()
      entityFeature = new YFGis.EntityFeature(viewer)
      popupFeature = new YFGis.PopupFeature(viewer)

      this.createPopup()
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

    YFGis.Event.enter.add((data) => {
      console.log(data)
      if (data.dataType === '101') {
        const popEl = new Popup({
          id: '123412',
          guide: {
            description: data.description
          },
          close: (id) => popupFeature.close(id)
        })

        popupFeature.updatePopup({
          id: '123412',
          el: popEl,
          cartesian3: data.cartesian3,
          offsetX: -16,
          offsetY: 32,
          clamp: 0,
          stay: true
        })
      }
    })
    YFGis.Event.leave.add((data) => {
      popupFeature.close('123412')
    })
  },
  destroyed() {},
  methods: {
    createPopup() {
      // 创建气泡
      const cartesian3 = SuperMap3D.Cartesian3.fromDegrees(106.7969971, 31.8514004, 10)
      const popEl = new Popup({
        id: '123412',
        guide: {
          description: ''
        },
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
    },
    selectPoints(type) {
      window.viewer.scene.globe.depthTestAgainstTerrain = true
      switch (type) {
        case 1:
          drawFeature.startDrawPoint((res) => {
            nodes = []
            console.log(res)
            const geometry = res.geometry
            const position = res.cartographicArr[0]
            const start = [{
              'id': YFGis.UUID.randomUUID(),
              'label': '摄像头1',
              'type': '1',
              'position': position,
              'data': {
                dataType: '101',
                'description': ''
              },
              'style': {
                'url': '/static/images/marker/1000007935.png',
                'width': 105,
                'height': 90,
                'lx': 0,
                'ly': 0,
                'px': 0,
                'py': -45,
                'clamp': 1
              }
            }]

            entityFeature.createFeatures(start, false)
            nodes.push(geometry)
            drawFeature.clear()
          })
          break
        case 2:
          drawFeature.startDrawPoint((res) => {
            if (nodes.length < 1) {
              console.log('请先选择初始位置')
              return
            }
            const geometry = res.geometry
            const position = res.cartographicArr[0]
            const end = [{
              'id': YFGis.UUID.randomUUID(),
              'label': '摄像头1',
              'type': '1',
              'position': position,
              'data': {
                dataType: '101',
                'description': ''
              },
              'style': {
                'url': '/static/images/marker/1000007936.png',
                'width': 105,
                'height': 90,
                'lx': 0,
                'ly': 0,
                'px': 0,
                'py': -45,
                'clamp': 1
              }
            }]

            entityFeature.createFeatures(end, false)
            nodes.push(geometry)
            drawFeature.clear()
          })
          break
        default:
          break
      }
    },
    doAnalysis() {
      queryFeatures.getPathService('http://117.176.63.158:31111/iserver/services/transportnetworkanalyst-CQZGD/rest/networkanalyst/CQZGD_Network@CQZGD', nodes, 'lenth').then((res) => {
        const pathList = res.originResult.pathList
        if (!pathList) return
        console.log(pathList)

        this.calcTime(pathList)
        this.addRoute(pathList)
        // this.addPathGuideItems(pathList)
        this.addPopup()
      })
    },
    addPopup() {
      const cartesian3 = SuperMap3D.Cartesian3.fromDegrees(nodes[0].x, nodes[0].y, 0)
      const popEl = new TimePopup({
        id: 'line_1241234',
        time: {
          tcar: parseInt(this.tCar),
          tman: parseInt(this.tMan)
        },
        close: (id) => popupFeature.close(id)
      })
      popupFeature.createPopup({
        id: 'line_1241234',
        el: popEl,
        cartesian3: cartesian3,
        offsetX: 0,
        offsetY: 165,
        stay: true
      })
    },
    calcTime(pathList) {
      this.tCar = 0
      this.tMan = 0
      this.length = 0
      for (let index = 0; index < pathList.length; index++) {
        const path = pathList[index]
        const nodes = path.pathGuideItems
        const nLength = nodes.length - 4
        const length = this.length = path.route.length
        this.tCar += length / (50 * 1000) * 60 + 20 / 60 * nLength
        this.tMan += length / (5 * 1000) * 60 + 20 / 60 * nLength
      }
    },
    addRoute(pathList) {
      const points = []
      const positions = []
      for (let index = 0; index < pathList.length; index++) {
        const path = pathList[index]
        const line = path.route.line
        const lPoints = line.points
        for (let i = 0; i < lPoints.length; i++) {
          points.push(lPoints[i].x, lPoints[i].y)
          positions.push({ longitude: lPoints[i].x, latitude: lPoints[i].y })
        }
      }
      this.addLineEntity(positions)
    },
    addPathGuideItems(pathList) {
      // pathGuideItems
      const guides = []
      for (let index = 0; index < pathList.length; index++) {
        const path = pathList[index]
        path.pathGuideItems.forEach(guide => {
          const geometry = guide.geometry
          const position = {
            longitude: geometry.center.x,
            latitude: geometry.center.y,
            height: 0
          }
          guides.push({
            'id': YFGis.UUID.randomUUID(),
            'label': '摄像头1',
            'type': '1',
            'position': position,
            'data': {
              dataType: '101',
              'description': guide.description
            },
            'style': {
              'url': '/static/images/marker/location4.png',
              'width': 105,
              'height': 90,
              'lx': 0,
              'ly': 0,
              'px': 0,
              'py': -45,
              'clamp': 1
            }
          })
        })
      }
      entityFeature.createFeatures(guides)
    },
    addLineEntity(positions) {
      entityFeature.createLines([
        {
          id: YFGis.UUID.randomUUID(),
          positions: positions,
          type: '1',
          data: {},
          style: {
            width: 3,
            clamp: 1
          }
        }
      ])
    },
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

.panelButton .queryButton {
  margin: 0 5px;
  height: 23px;
}

button {
  background: transparent;
  color: var(--base-light-color, #45c3ff);
  border-radius: 6px;
  border: solid 1px var(--base-light-color, #45c3ff);
  padding: 0 5px;
  cursor: pointer;
}
/* .gis-pipe-burst span {
  cursor: pointer;
} */

.item2 {
  width: 150px;
}
</style>
