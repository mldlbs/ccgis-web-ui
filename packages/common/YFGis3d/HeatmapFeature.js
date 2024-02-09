// 基于超图的热力图工具
/*global h337, SuperMap3D, turf*/ // SuperMap
/*eslint new-cap: */
import DataSource from './Common/DataSource'
import { singleton } from './Utils/singleton'

const common = {
  calcBBOX: (pts) => {
    const lineArr = pts.map(_p => [parseFloat(_p.longitude), parseFloat(_p.latitude)])
    const line = turf.lineString(lineArr)
    return turf.bbox(line)
  },
  calcPoints: (pts, bbox) => {
    const lonW = Math.abs(bbox[0] - bbox[2])
    const latH = Math.abs(bbox[3] - bbox[1])

    const minW = Math.min(bbox[0], bbox[2])
    const minH = Math.min(bbox[1], bbox[3])
    let max = 0
    const points = pts.map(_p => {
      const lonC = parseFloat(_p.longitude) - minW
      const latC = parseFloat(_p.latitude) - minH

      const x = lonC / lonW * 800
      const y = 600 - latC / latH * 600

      const val = parseFloat(_p.value)
      max = Math.max(max, val)

      return { x, y, value: val }
    })

    const data = {
      max: max,
      data: points
    }
    return data
  }
}

class HeatmapFeatureIns {
  constructor(viewer) {
    this.viewer = viewer

    // 创建数据源
    const DataSourceFa = new DataSource(viewer)
    this.dataSource = DataSourceFa.create('heatmap-layer')
    // this.viewer.dataSources.add(this.dataSource)

    const heatmapEl = document.createElement('div')
    heatmapEl.setAttribute('class', 'yf-heatmap')
    heatmapEl.style.width = '800px'
    heatmapEl.style.height = '600px'
    heatmapEl.style.display = 'none'
    const elements = document.getElementsByClassName('yf-heatmap')
    for (let index = 0; index < elements.length; index++) {
      document.body.removeChild(elements[index])
    }

    document.body.appendChild(heatmapEl)

    this.instance = h337.create({
      radius: 30,
      container: heatmapEl
    })
    this.instance.setData({ max: 1, data: { x: 1, y: 1, value: 1 }})
  }

  create(pts, layers) {
    const bbox = common.calcBBOX(pts)
    const data = common.calcPoints(pts, bbox)
    this.instance.setData(data)
    this.dataSource.entities.removeAll()
    this.viewer.dataSources.add(this.dataSource)

    const bounds = SuperMap3D.Rectangle.fromDegrees(...bbox)

    const img = new Image()
    img.src = this.instance.getDataURL()

    img.onload = () => {
      if (layers) {
        this._addOverlayImage(layers, bounds, img)
      } else {
        this._addRectangle(bounds, img)
      }
    }
  }

  _addRectangle(bounds, img) {
    this.dataSource.entities.add({
      name: 'heatmap',
      rectangle: {
        coordinates: bounds,
        material: new SuperMap3D.ImageMaterialProperty({
          image: img,
          transparent: true
        })
      }
    })
  }

  _addOverlayImage(layers, bounds, img) {
    this.layers = layers
    const _layers = this.viewer.scene.layers
    _layers.layerQueue.forEach(ly => {
      if (!ly.layerInfo) return
      const id = layers.find(id => id === ly.layerInfo.resourceId)
      if (id) {
        ly.removeOverlayImage('heat-map')
        ly.addOverlayImage({
          bounds: bounds,
          name: 'heat-map',
          image: img
        })
      }
    })
  }

  clear() {
    this.dataSource.entities.removeAll()
    this.viewer.dataSources.remove(this.dataSource)
    const layers = this.layers
    if (!layers) return
    const _layers = this.viewer.scene.layers
    _layers.layerQueue.forEach(ly => {
      if (!ly.layerInfo) return
      const id = layers.find(id => id === ly.layerInfo.resourceId)
      if (id) {
        ly.removeOverlayImage('heat-map')
      }
    })
  }
}

const HeatmapFeature = singleton(HeatmapFeatureIns)

export default HeatmapFeature
